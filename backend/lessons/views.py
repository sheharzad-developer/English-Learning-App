from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta, date
from django.db.models import Avg, Count, Sum
from .models import (
    Lesson, Exercise, UserProgress, ExerciseAttempt,
    Achievement, UserAchievement, DailyChallenge, UserChallenge,
    Category, Tag, UserNote, UserFeedback, Leaderboard,
    Badge, UserBadge
)
from .serializers import (
    LessonSerializer, ExerciseSerializer, UserProgressSerializer,
    ExerciseAttemptSerializer, AchievementSerializer, UserAchievementSerializer,
    DailyChallengeSerializer, UserChallengeSerializer, CategorySerializer,
    TagSerializer, UserNoteSerializer, UserFeedbackSerializer,
    LessonDetailSerializer, LeaderboardSerializer, BadgeSerializer,
    UserBadgeSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.filter(is_active=True)
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonDetailSerializer
        return LessonSerializer

    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        lesson = self.get_object()
        exercise_id = request.data.get('exercise_id')
        user_answer = request.data.get('answer')
        time_taken = request.data.get('time_taken')
        hints_used = request.data.get('hints_used', 0)

        try:
            exercise = Exercise.objects.get(id=exercise_id, lesson=lesson)
        except Exercise.DoesNotExist:
            return Response(
                {'error': 'Exercise not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Get or create user progress
        user_progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )

        # Check if exercise was already attempted
        if ExerciseAttempt.objects.filter(
            user_progress=user_progress,
            exercise=exercise
        ).exists():
            return Response(
                {'error': 'Exercise already attempted'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate points based on time taken and hints used
        base_points = exercise.points
        if time_taken and exercise.time_limit:
            time_bonus = max(0, 1 - (time_taken / exercise.time_limit))
            base_points *= (1 + time_bonus)
        
        hint_penalty = hints_used * 0.1  # 10% penalty per hint
        final_points = int(base_points * (1 - hint_penalty) * exercise.difficulty_multiplier)

        # Check answer and calculate accuracy
        is_correct = user_answer == exercise.correct_answer
        accuracy = 1.0 if is_correct else 0.0

        # For speaking exercises, calculate accuracy based on similarity
        if exercise.type == 'speaking':
            accuracy = self._calculate_speech_accuracy(user_answer, exercise.correct_answer)
            is_correct = accuracy >= exercise.required_accuracy

        # Create attempt record
        attempt = ExerciseAttempt.objects.create(
            user_progress=user_progress,
            exercise=exercise,
            user_answer=user_answer,
            is_correct=is_correct,
            points_earned=final_points if is_correct else 0,
            time_taken=time_taken,
            accuracy=accuracy,
            hints_used=hints_used
        )

        # Update user progress
        user_progress.score += final_points if is_correct else 0
        user_progress.completed_exercises.add(exercise)
        user_progress.time_spent += time_taken or 0
        
        # Update accuracy
        total_attempts = ExerciseAttempt.objects.filter(user_progress=user_progress).count()
        user_progress.accuracy = (
            (user_progress.accuracy * (total_attempts - 1) + accuracy) / total_attempts
        )
        
        # Check if lesson is completed
        total_exercises = lesson.exercises.count()
        completed_exercises = user_progress.completed_exercises.count()
        if completed_exercises == total_exercises:
            user_progress.completed = True
            self._award_achievement(request.user, 'lesson_complete', lesson)

        # Update streak
        self._update_streak(user_progress)
        
        # Update mastery level
        self._update_mastery_level(user_progress)
        
        user_progress.save()

        # Update leaderboard
        self._update_leaderboard(request.user)

        # Check for other achievements
        self._check_achievements(request.user, user_progress)

        # Update daily challenges
        self._update_daily_challenges(request.user, user_progress, attempt)

        return Response({
            'is_correct': is_correct,
            'points_earned': final_points if is_correct else 0,
            'explanation': exercise.explanation,
            'total_score': user_progress.score,
            'completed': user_progress.completed,
            'accuracy': accuracy,
            'mastery_level': user_progress.mastery_level
        })

    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        lesson = self.get_object()
        content = request.data.get('content')
        is_public = request.data.get('is_public', False)

        note = UserNote.objects.create(
            user=request.user,
            lesson=lesson,
            content=content,
            is_public=is_public
        )

        return Response(UserNoteSerializer(note).data)

    @action(detail=True, methods=['post'])
    def add_feedback(self, request, pk=None):
        lesson = self.get_object()
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')

        feedback = UserFeedback.objects.create(
            user=request.user,
            lesson=lesson,
            rating=rating,
            comment=comment
        )

        return Response(UserFeedbackSerializer(feedback).data)

    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        lesson = self.get_object()
        user_progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )
        user_progress.favorite = not user_progress.favorite
        user_progress.save()

        return Response({
            'favorite': user_progress.favorite
        })

    def _calculate_speech_accuracy(self, user_answer, correct_answer):
        # Implement speech recognition accuracy calculation
        # This is a placeholder - implement actual speech recognition logic
        return 0.8

    def _update_streak(self, user_progress):
        today = timezone.now().date()
        if user_progress.last_streak_date:
            if today - user_progress.last_streak_date == timedelta(days=1):
                user_progress.streak_days += 1
            elif today - user_progress.last_streak_date > timedelta(days=1):
                user_progress.streak_days = 1
        else:
            user_progress.streak_days = 1
        user_progress.last_streak_date = today

    def _update_mastery_level(self, user_progress):
        accuracy = user_progress.accuracy
        if accuracy >= 0.95:
            user_progress.mastery_level = 'master'
        elif accuracy >= 0.85:
            user_progress.mastery_level = 'advanced'
        elif accuracy >= 0.75:
            user_progress.mastery_level = 'intermediate'
        else:
            user_progress.mastery_level = 'beginner'

    def _update_leaderboard(self, user):
        # Calculate total score
        total_score = UserProgress.objects.filter(user=user).aggregate(
            total=Sum('score')
        )['total'] or 0

        # Calculate total lessons and exercises
        total_lessons = UserProgress.objects.filter(
            user=user,
            completed=True
        ).count()

        total_exercises = ExerciseAttempt.objects.filter(
            user_progress__user=user
        ).count()

        # Calculate average accuracy
        avg_accuracy = ExerciseAttempt.objects.filter(
            user_progress__user=user
        ).aggregate(
            avg=Avg('accuracy')
        )['avg'] or 0

        # Get current streak
        streak = UserProgress.objects.filter(
            user=user
        ).order_by('-last_streak_date').first()
        streak_days = streak.streak_days if streak else 0

        # Update or create leaderboard entry
        leaderboard, created = Leaderboard.objects.get_or_create(user=user)
        leaderboard.total_score = total_score
        leaderboard.total_lessons = total_lessons
        leaderboard.total_exercises = total_exercises
        leaderboard.average_accuracy = avg_accuracy
        leaderboard.streak_days = streak_days
        leaderboard.save()

        # Update ranks
        self._update_ranks()

    def _update_ranks(self):
        leaderboard = Leaderboard.objects.all().order_by(
            '-total_score',
            '-average_accuracy'
        )
        for index, entry in enumerate(leaderboard, 1):
            entry.rank = index
            entry.save()

    def _award_achievement(self, user, achievement_type, lesson=None):
        achievement = Achievement.objects.filter(type=achievement_type).first()
        if achievement:
            UserAchievement.objects.get_or_create(
                user=user,
                achievement=achievement
            )

    def _check_achievements(self, user, user_progress):
        # Check streak achievements
        streak_achievements = Achievement.objects.filter(type='streak')
        for achievement in streak_achievements:
            if user_progress.streak_days >= achievement.requirement:
                self._award_achievement(user, 'streak')

        # Check score achievements
        score_achievements = Achievement.objects.filter(type='score')
        for achievement in score_achievements:
            if user_progress.score >= achievement.requirement:
                self._award_achievement(user, 'score')

        # Check perfect score achievement
        if user_progress.completed and user_progress.score == user_progress.lesson.points_available:
            self._award_achievement(user, 'perfect')

        # Check mastery achievements
        mastery_achievements = Achievement.objects.filter(type='mastery')
        for achievement in mastery_achievements:
            if user_progress.mastery_level == achievement.requirement:
                self._award_achievement(user, 'mastery')

    def _update_daily_challenges(self, user, user_progress, attempt):
        today = date.today()
        active_challenges = DailyChallenge.objects.filter(
            is_active=True,
            start_date__lte=today,
            end_date__gte=today
        )

        for challenge in active_challenges:
            user_challenge, created = UserChallenge.objects.get_or_create(
                user=user,
                challenge=challenge
            )

            if not user_challenge.completed:
                if challenge.type == 'streak':
                    user_challenge.progress = user_progress.streak_days
                elif challenge.type == 'score':
                    user_challenge.progress = user_progress.score
                elif challenge.type == 'complete':
                    user_challenge.progress = user_progress.completed_exercises.count()
                elif challenge.type == 'practice':
                    user_challenge.progress = user_progress.time_spent // 60  # Convert to minutes

                if user_challenge.progress >= challenge.requirement:
                    user_challenge.completed = True
                    user_challenge.completed_at = timezone.now()
                    # Award points
                    user_progress.score += challenge.points_reward
                    # Award achievement
                    self._award_achievement(user, 'challenge')

                user_challenge.save()

class UserProgressViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)

class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.achievements.all()

class DailyChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DailyChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        today = date.today()
        return DailyChallenge.objects.filter(
            is_active=True,
            start_date__lte=today,
            end_date__gte=today
        )

class UserChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserChallenge.objects.filter(user=self.request.user)

class UserNoteViewSet(viewsets.ModelViewSet):
    serializer_class = UserNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserNote.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserFeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = UserFeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserFeedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeaderboardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Leaderboard.objects.all().order_by('rank')[:100]

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Badge.objects.filter(is_active=True)

class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user) 