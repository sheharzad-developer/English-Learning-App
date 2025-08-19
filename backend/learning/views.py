from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.db.models import Q, Count, Avg, Sum, F
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import (
    Category, SkillLevel, Lesson, Exercise, UserProgress,
    Submission, EssaySubmission, SpeechSubmission,
    UserPoints, Badge, UserBadge, UserStreak, Leaderboard
)
from .serializers import (
    CategorySerializer, SkillLevelSerializer,
    LessonListSerializer, LessonDetailSerializer,
    ExerciseListSerializer, ExerciseDetailSerializer,
    UserProgressSerializer, SubmissionSerializer,
    EssaySubmissionSerializer, SpeechSubmissionSerializer,
    UserPointsSerializer, BadgeSerializer, UserBadgeSerializer,
    UserStreakSerializer, LeaderboardSerializer,
    LessonProgressSerializer, QuizSubmissionSerializer,
    EssaySubmissionCreateSerializer, SpeechSubmissionCreateSerializer,
    UserStatsSerializer
)
from .permissions import IsOwnerOrReadOnly, IsTeacherOrAdmin
from .filters import LessonFilter, ExerciseFilter
from .utils import (
    process_essay_submission, process_speech_submission,
    award_points, check_and_award_badges, update_user_streak
)

User = get_user_model()


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for learning categories"""
    queryset = Category.objects.all().order_by('order_index')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order_index', 'created_at']
    ordering = ['order_index']

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        """Get all lessons for a specific category"""
        category = self.get_object()
        lessons = Lesson.objects.filter(
            category=category,
            is_published=True
        ).order_by('order_index')
        
        # Apply skill level filter if provided
        skill_level = request.query_params.get('skill_level')
        if skill_level:
            lessons = lessons.filter(skill_level_id=skill_level)
        
        serializer = LessonListSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)


class SkillLevelViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for skill levels"""
    queryset = SkillLevel.objects.all().order_by('order_index')
    serializer_class = SkillLevelSerializer
    permission_classes = [permissions.AllowAny]
    ordering = ['order_index']

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        """Get all lessons for a specific skill level"""
        skill_level = self.get_object()
        lessons = Lesson.objects.filter(
            skill_level=skill_level,
            is_published=True
        ).order_by('order_index')
        
        # Apply category filter if provided
        category = request.query_params.get('category')
        if category:
            lessons = lessons.filter(category_id=category)
        
        serializer = LessonListSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for lessons with filtering and search"""
    queryset = Lesson.objects.filter(is_published=True)
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = LessonFilter
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'order_index', 'created_at', 'points']
    ordering = ['order_index']

    def get_queryset(self):
        """Filter lessons based on user role and publication status"""
        queryset = Lesson.objects.select_related('category', 'skill_level').prefetch_related('exercises')
        
        # Anonymous users and students only see published lessons
        if not self.request.user.is_authenticated or getattr(self.request.user, 'role', 'student') == 'student':
            queryset = queryset.filter(is_published=True)
        
        return queryset

    def get_serializer_class(self):
        """Use different serializers for list and detail views"""
        if self.action == 'list':
            return LessonListSerializer
        return LessonDetailSerializer

    @action(detail=True, methods=['post'])
    def start_lesson(self, request, pk=None):
        """Mark lesson as started for the user"""
        lesson = self.get_object()
        user = request.user
        
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            lesson=lesson,
            defaults={'started_at': timezone.now()}
        )
        
        if not created and not progress.started_at:
            progress.started_at = timezone.now()
            progress.save()
        
        serializer = UserProgressSerializer(progress)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete_lesson(self, request, pk=None):
        """Mark lesson as completed and update progress"""
        lesson = self.get_object()
        user = request.user
        serializer = LessonProgressSerializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                # Update or create progress
                progress, created = UserProgress.objects.get_or_create(
                    user=user,
                    lesson=lesson,
                    defaults={
                        'completed': True,
                        'completed_at': timezone.now(),
                        'time_spent': serializer.validated_data.get('time_spent', 0),
                        'score': serializer.validated_data.get('score', 0)
                    }
                )
                
                if not created:
                    progress.completed = True
                    progress.completed_at = timezone.now()
                    progress.time_spent += serializer.validated_data.get('time_spent', 0)
                    if 'score' in serializer.validated_data:
                        progress.score = max(progress.score, serializer.validated_data['score'])
                    progress.save()
                
                # Award points for lesson completion
                if progress.completed and created:
                    award_points(
                        user=user,
                        points=lesson.points,
                        source='lesson',
                        source_id=lesson.id,
                        description=f"Completed lesson: {lesson.title}"
                    )
                
                # Update streak and check for badges
                update_user_streak(user)
                check_and_award_badges(user)
            
            return Response(UserProgressSerializer(progress).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def exercises(self, request, pk=None):
        """Get all exercises for a lesson"""
        lesson = self.get_object()
        exercises = lesson.exercises.all().order_by('order_index')
        serializer = ExerciseListSerializer(exercises, many=True, context={'request': request})
        return Response(serializer.data)


class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for exercises with submission handling"""
    queryset = Exercise.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ExerciseFilter
    search_fields = ['title']
    ordering_fields = ['title', 'order_index', 'created_at', 'points']
    ordering = ['order_index']

    def get_queryset(self):
        """Filter exercises based on lesson access"""
        queryset = Exercise.objects.select_related('lesson')
        
        # Students only see exercises from published lessons
        if self.request.user.role == 'student':
            queryset = queryset.filter(lesson__is_published=True)
        
        return queryset

    def get_serializer_class(self):
        """Use different serializers for list and detail views"""
        if self.action == 'list':
            return ExerciseListSerializer
        return ExerciseDetailSerializer

    @action(detail=True, methods=['post'])
    def submit_quiz(self, request, pk=None):
        """Submit quiz answers for auto-grading"""
        exercise = self.get_object()
        user = request.user
        
        if exercise.type not in ['mcq', 'fill_blank', 'matching', 'drag_drop']:
            return Response(
                {'error': 'This endpoint only accepts quiz-type exercises.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = QuizSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Create submission
                submission = Submission.objects.create(
                    user=user,
                    exercise=exercise,
                    answer=serializer.validated_data['answers'],
                    time_taken=serializer.validated_data.get('time_taken', 0)
                )
                
                # Award points if correct
                if submission.is_correct:
                    award_points(
                        user=user,
                        points=exercise.points,
                        source='exercise',
                        source_id=exercise.id,
                        description=f"Completed exercise: {exercise.title}"
                    )
                
                # Update streak and check for badges
                update_user_streak(user)
                check_and_award_badges(user)
            
            return Response(SubmissionSerializer(submission).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def submit_essay(self, request, pk=None):
        """Submit essay for grammar checking and scoring"""
        exercise = self.get_object()
        user = request.user
        
        if exercise.type != 'essay':
            return Response(
                {'error': 'This endpoint only accepts essay exercises.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = EssaySubmissionCreateSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Create base submission
                submission = Submission.objects.create(
                    user=user,
                    exercise=exercise,
                    answer={'essay_text': serializer.validated_data['essay_text']},
                    time_taken=serializer.validated_data.get('time_taken', 0)
                )
                
                # Create essay submission
                essay_submission = EssaySubmission.objects.create(
                    submission=submission,
                    essay_text=serializer.validated_data['essay_text'],
                    word_count=len(serializer.validated_data['essay_text'].split())
                )
                
                # Process essay asynchronously (in a real app, use Celery)
                process_essay_submission.delay(essay_submission.id)
            
            return Response(EssaySubmissionSerializer(essay_submission).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def submit_speech(self, request, pk=None):
        """Submit speech recording for pronunciation scoring"""
        exercise = self.get_object()
        user = request.user
        
        if exercise.type != 'speaking':
            return Response(
                {'error': 'This endpoint only accepts speaking exercises.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = SpeechSubmissionCreateSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Create base submission
                submission = Submission.objects.create(
                    user=user,
                    exercise=exercise,
                    answer={'audio_submitted': True},
                    time_taken=serializer.validated_data.get('time_taken', 0)
                )
                
                # Create speech submission
                speech_submission = SpeechSubmission.objects.create(
                    submission=submission,
                    audio_file=serializer.validated_data['audio_file']
                )
                
                # Process speech asynchronously (in a real app, use Celery)
                process_speech_submission.delay(speech_submission.id)
            
            return Response(SpeechSubmissionSerializer(speech_submission).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user progress tracking"""
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['lesson__category', 'lesson__skill_level', 'completed']
    ordering_fields = ['created_at', 'completed_at', 'score']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return progress for the current user only"""
        return UserProgress.objects.filter(
            user=self.request.user
        ).select_related('lesson', 'lesson__category', 'lesson__skill_level')

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user's learning statistics"""
        user = request.user
        
        # Calculate statistics
        progress_qs = UserProgress.objects.filter(user=user)
        submissions_qs = Submission.objects.filter(user=user)
        
        stats = {
            'total_points': UserPoints.objects.filter(user=user).aggregate(
                total=Sum('points')
            )['total'] or 0,
            'lessons_completed': progress_qs.filter(completed=True).count(),
            'exercises_completed': submissions_qs.filter(is_correct=True).count(),
            'badges_earned': UserBadge.objects.filter(user=user).count(),
            'current_streak': getattr(UserStreak.objects.filter(user=user).first(), 'current_streak', 0),
            'longest_streak': getattr(UserStreak.objects.filter(user=user).first(), 'longest_streak', 0),
            'average_score': submissions_qs.aggregate(
                avg=Avg('score')
            )['avg'] or 0,
            'time_spent_learning': progress_qs.aggregate(
                total=Sum('time_spent')
            )['total'] or 0,
            'rank': self._get_user_rank(user),
            'level': self._get_user_level(user)
        }
        
        serializer = UserStatsSerializer(stats)
        return Response(serializer.data)
    
    def _get_user_rank(self, user):
        """Calculate user's rank based on total points"""
        user_points = UserPoints.objects.filter(user=user).aggregate(
            total=Sum('points')
        )['total'] or 0
        
        higher_ranked = User.objects.filter(
            userpoints__points__gt=user_points
        ).distinct().count()
        
        return higher_ranked + 1
    
    def _get_user_level(self, user):
        """Determine user's skill level based on points"""
        user_points = UserPoints.objects.filter(user=user).aggregate(
            total=Sum('points')
        )['total'] or 0
        
        skill_level = SkillLevel.objects.filter(
            min_points__lte=user_points
        ).order_by('-min_points').first()
        
        return skill_level.name if skill_level else 'Beginner'


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for exercise submissions"""
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['exercise__type', 'is_correct', 'exercise__lesson']
    ordering_fields = ['submitted_at', 'score']
    ordering = ['-submitted_at']

    def get_queryset(self):
        """Return submissions for the current user only"""
        return Submission.objects.filter(
            user=self.request.user
        ).select_related('exercise', 'exercise__lesson')


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for badges"""
    queryset = Badge.objects.filter(is_active=True)
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'rarity', 'created_at']
    ordering = ['rarity', 'name']


class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user badges"""
    queryset = UserBadge.objects.all()
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    ordering = ['-earned_at']

    def get_queryset(self):
        """Return badges for the current user only"""
        return UserBadge.objects.filter(
            user=self.request.user
        ).select_related('badge')


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for leaderboard data"""
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['rank']

    def get_queryset(self):
        """Return top users from leaderboard"""
        limit = int(self.request.query_params.get('limit', 50))
        return Leaderboard.objects.all()[:limit]

    @action(detail=False, methods=['get'])
    def my_rank(self, request):
        """Get current user's rank and nearby users"""
        user = request.user
        
        try:
            user_entry = Leaderboard.objects.get(user=user)
            rank = user_entry.rank
            
            # Get users around current user's rank
            nearby_range = 5
            start_rank = max(1, rank - nearby_range)
            end_rank = rank + nearby_range
            
            nearby_users = Leaderboard.objects.filter(
                rank__gte=start_rank,
                rank__lte=end_rank
            )
            
            serializer = LeaderboardSerializer(nearby_users, many=True)
            return Response({
                'my_rank': rank,
                'nearby_users': serializer.data
            })
            
        except Leaderboard.DoesNotExist:
            return Response({
                'my_rank': None,
                'nearby_users': []
            })


class UserStreakViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user streaks"""
    queryset = UserStreak.objects.all()
    serializer_class = UserStreakSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        """Return streak for the current user only"""
        return UserStreak.objects.filter(user=self.request.user)


class UserPointsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user points"""
    queryset = UserPoints.objects.all()
    serializer_class = UserPointsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['source']
    ordering_fields = ['earned_at', 'points']
    ordering = ['-earned_at']

    def get_queryset(self):
        """Return points for the current user only"""
        return UserPoints.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def total(self, request):
        """Get user's total points"""
        total_points = self.get_queryset().aggregate(
            total=Sum('points')
        )['total'] or 0
        
        return Response({'total_points': total_points})


class UserStatsView(APIView):
    """API view for user statistics"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get user progress stats
        total_lessons = UserProgress.objects.filter(user=user).count()
        completed_lessons = UserProgress.objects.filter(user=user, completed=True).count()
        
        # Get submission stats
        total_submissions = Submission.objects.filter(user=user).count()
        correct_submissions = Submission.objects.filter(user=user, is_correct=True).count()
        
        # Get points and badges
        total_points = UserPoints.objects.filter(user=user).aggregate(
            total=Sum('points')
        )['total'] or 0
        
        total_badges = UserBadge.objects.filter(user=user).count()
        
        # Get streak info
        streak = UserStreak.objects.filter(user=user).first()
        current_streak = streak.current_streak if streak else 0
        longest_streak = streak.longest_streak if streak else 0
        
        return Response({
            'lessons': {
                'total': total_lessons,
                'completed': completed_lessons,
                'completion_rate': (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
            },
            'submissions': {
                'total': total_submissions,
                'correct': correct_submissions,
                'accuracy': (correct_submissions / total_submissions * 100) if total_submissions > 0 else 0
            },
            'points': total_points,
            'badges': total_badges,
            'streak': {
                'current': current_streak,
                'longest': longest_streak
            }
        })


class DashboardView(APIView):
    """API view for dashboard data"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get recent progress
        recent_progress = UserProgress.objects.filter(
            user=user
        ).select_related('lesson', 'lesson__category').order_by('-updated_at')[:5]
        
        # Get recommended lessons
        user_skill_levels = UserProgress.objects.filter(
            user=user, completed=True
        ).values_list('lesson__skill_level', flat=True).distinct()
        
        if user_skill_levels:
            max_skill_level = max(user_skill_levels)
            recommended_lessons = Lesson.objects.filter(
                is_published=True,
                skill_level__order_index__lte=max_skill_level + 1
            ).exclude(
                id__in=UserProgress.objects.filter(user=user).values_list('lesson_id', flat=True)
            )[:5]
        else:
            recommended_lessons = Lesson.objects.filter(
                is_published=True,
                skill_level__order_index=1
            )[:5]
        
        # Get recent badges
        recent_badges = UserBadge.objects.filter(
            user=user
        ).select_related('badge').order_by('-earned_at')[:3]
        
        # Get leaderboard position
        try:
            user_rank = Leaderboard.objects.get(user=user).rank
        except Leaderboard.DoesNotExist:
            user_rank = None
        
        return Response({
            'recent_progress': LessonProgressSerializer(recent_progress, many=True).data,
            'recommended_lessons': LessonListSerializer(recommended_lessons, many=True).data,
            'recent_badges': UserBadgeSerializer(recent_badges, many=True).data,
            'user_rank': user_rank
        })