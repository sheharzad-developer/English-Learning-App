from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Category, SkillLevel, Lesson, Exercise, UserProgress, 
    Submission, EssaySubmission, SpeechSubmission,
    UserPoints, Badge, UserBadge, UserStreak, Leaderboard
)

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for learning categories"""
    lesson_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'order_index', 'lesson_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_lesson_count(self, obj):
        return obj.lessons.filter(is_published=True).count()


class SkillLevelSerializer(serializers.ModelSerializer):
    """Serializer for skill levels"""
    lesson_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SkillLevel
        fields = ['id', 'name', 'order_index', 'description', 'min_points', 'lesson_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_lesson_count(self, obj):
        return obj.lessons.filter(is_published=True).count()


class ExerciseListSerializer(serializers.ModelSerializer):
    """Simplified serializer for exercise lists"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Exercise
        fields = [
            'id', 'title', 'type', 'type_display', 'points', 
            'difficulty', 'order_index', 'time_limit'
        ]


class ExerciseDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for individual exercises"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Exercise
        fields = [
            'id', 'lesson', 'title', 'type', 'type_display', 'content', 
            'options', 'correct_answer', 'points', 'difficulty', 
            'order_index', 'time_limit', 'hints', 'explanation', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def to_representation(self, instance):
        """Hide correct_answer from students"""
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        # Hide correct answers from students
        if request and hasattr(request, 'user'):
            user = request.user
            if user.is_authenticated and user.role == 'student':
                data.pop('correct_answer', None)
        
        return data


class LessonListSerializer(serializers.ModelSerializer):
    """Simplified serializer for lesson lists"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    skill_level_name = serializers.CharField(source='skill_level.name', read_only=True)
    exercise_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'description', 'category_name', 'skill_level_name',
            'thumbnail', 'duration', 'points', 'exercise_count', 'order_index'
        ]


class LessonDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for individual lessons"""
    category = CategorySerializer(read_only=True)
    skill_level = SkillLevelSerializer(read_only=True)
    exercises = ExerciseListSerializer(many=True, read_only=True)
    user_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'description', 'category', 'skill_level', 
            'content', 'video_url', 'audio_url', 'thumbnail', 'duration',
            'points', 'order_index', 'prerequisites', 'exercises', 
            'user_progress', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_progress(self, obj):
        """Get user's progress for this lesson"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = UserProgress.objects.get(user=request.user, lesson=obj)
                return UserProgressSerializer(progress).data
            except UserProgress.DoesNotExist:
                return None
        return None


class UserProgressSerializer(serializers.ModelSerializer):
    """Serializer for user progress tracking"""
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = UserProgress
        fields = [
            'id', 'lesson', 'lesson_title', 'completed', 'score', 
            'attempts', 'time_spent', 'completed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubmissionSerializer(serializers.ModelSerializer):
    """Serializer for exercise submissions"""
    exercise_title = serializers.CharField(source='exercise.title', read_only=True)
    exercise_type = serializers.CharField(source='exercise.type', read_only=True)
    
    class Meta:
        model = Submission
        fields = [
            'id', 'exercise', 'exercise_title', 'exercise_type', 
            'answer', 'score', 'is_correct', 'feedback', 
            'time_taken', 'submitted_at'
        ]
        read_only_fields = ['id', 'score', 'is_correct', 'feedback', 'submitted_at']
    
    def create(self, validated_data):
        """Auto-grade submission on creation"""
        submission = super().create(validated_data)
        self._grade_submission(submission)
        return submission
    
    def _grade_submission(self, submission):
        """Grade the submission based on exercise type"""
        exercise = submission.exercise
        user_answer = submission.answer
        correct_answer = exercise.correct_answer
        
        if exercise.type == 'mcq':
            # Multiple choice grading
            is_correct = user_answer.get('selected') == correct_answer.get('correct_option')
            submission.score = 100.0 if is_correct else 0.0
            submission.is_correct = is_correct
            
        elif exercise.type == 'fill_blank':
            # Fill in the blank grading
            user_answers = user_answer.get('answers', [])
            correct_answers = correct_answer.get('answers', [])
            
            if len(user_answers) == len(correct_answers):
                correct_count = sum(
                    1 for user_ans, correct_ans in zip(user_answers, correct_answers)
                    if user_ans.lower().strip() == correct_ans.lower().strip()
                )
                submission.score = (correct_count / len(correct_answers)) * 100
                submission.is_correct = submission.score >= 70  # 70% threshold
            else:
                submission.score = 0.0
                submission.is_correct = False
                
        elif exercise.type == 'matching':
            # Matching exercise grading
            user_matches = user_answer.get('matches', {})
            correct_matches = correct_answer.get('matches', {})
            
            correct_count = sum(
                1 for key, value in user_matches.items()
                if correct_matches.get(key) == value
            )
            total_matches = len(correct_matches)
            submission.score = (correct_count / total_matches) * 100 if total_matches > 0 else 0
            submission.is_correct = submission.score >= 70
        
        # For essay and speaking, score will be set by external processing
        elif exercise.type in ['essay', 'speaking']:
            submission.score = 0.0
            submission.is_correct = False
            submission.feedback = "Submission received. Processing for detailed feedback."
        
        submission.save()


class EssaySubmissionSerializer(serializers.ModelSerializer):
    """Serializer for essay submissions"""
    submission = SubmissionSerializer(read_only=True)
    
    class Meta:
        model = EssaySubmission
        fields = [
            'id', 'submission', 'essay_text', 'grammar_score', 
            'spelling_score', 'vocabulary_score', 'structure_score',
            'feedback_json', 'word_count', 'processed_at', 'processing_status'
        ]
        read_only_fields = [
            'id', 'grammar_score', 'spelling_score', 'vocabulary_score',
            'structure_score', 'feedback_json', 'word_count', 
            'processed_at', 'processing_status'
        ]


class SpeechSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for speech submissions"""
    submission = SubmissionSerializer(read_only=True)
    
    class Meta:
        model = SpeechSubmission
        fields = [
            'id', 'submission', 'audio_file', 'transcript',
            'pronunciation_score', 'fluency_score', 'accuracy_score',
            'feedback_json', 'processed_at', 'processing_status'
        ]
        read_only_fields = [
            'id', 'transcript', 'pronunciation_score', 'fluency_score',
            'accuracy_score', 'feedback_json', 'processed_at', 'processing_status'
        ]


class UserPointsSerializer(serializers.ModelSerializer):
    """Serializer for user points"""
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    
    class Meta:
        model = UserPoints
        fields = [
            'id', 'points', 'source', 'source_display', 
            'source_id', 'description', 'earned_at'
        ]
        read_only_fields = ['id', 'earned_at']


class BadgeSerializer(serializers.ModelSerializer):
    """Serializer for badges"""
    rarity_display = serializers.CharField(source='get_rarity_display', read_only=True)
    earned_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Badge
        fields = [
            'id', 'name', 'description', 'icon', 'criteria',
            'points_reward', 'rarity', 'rarity_display', 
            'earned_count', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_earned_count(self, obj):
        return obj.earned_by.count()


class UserBadgeSerializer(serializers.ModelSerializer):
    """Serializer for user badges"""
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at']
        read_only_fields = ['id', 'earned_at']


class UserStreakSerializer(serializers.ModelSerializer):
    """Serializer for user streaks"""
    
    class Meta:
        model = UserStreak
        fields = [
            'id', 'current_streak', 'longest_streak', 
            'last_activity_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for leaderboard"""
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    profile_picture = serializers.URLField(source='user.profile_picture', read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = [
            'rank', 'username', 'full_name', 'profile_picture',
            'total_points', 'lessons_completed', 'badges_earned', 
            'current_streak', 'last_updated'
        ]
        read_only_fields = ['rank', 'last_updated']


# Specialized serializers for different use cases

class LessonProgressSerializer(serializers.Serializer):
    """Serializer for lesson progress updates"""
    lesson_id = serializers.IntegerField()
    time_spent = serializers.IntegerField(min_value=0)
    completed = serializers.BooleanField(default=False)
    score = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0, max_value=100, required=False)


class QuizSubmissionSerializer(serializers.Serializer):
    """Serializer for quiz submissions"""
    exercise_id = serializers.IntegerField()
    answers = serializers.JSONField()
    time_taken = serializers.IntegerField(min_value=0, required=False)
    
    def validate_exercise_id(self, value):
        try:
            exercise = Exercise.objects.get(id=value)
            if exercise.type not in ['mcq', 'fill_blank', 'matching', 'drag_drop']:
                raise serializers.ValidationError("This endpoint only accepts quiz-type exercises.")
            return value
        except Exercise.DoesNotExist:
            raise serializers.ValidationError("Exercise not found.")


class EssaySubmissionCreateSerializer(serializers.Serializer):
    """Serializer for creating essay submissions"""
    exercise_id = serializers.IntegerField()
    essay_text = serializers.CharField(min_length=10, max_length=5000)
    time_taken = serializers.IntegerField(min_value=0, required=False)
    
    def validate_exercise_id(self, value):
        try:
            exercise = Exercise.objects.get(id=value)
            if exercise.type != 'essay':
                raise serializers.ValidationError("This endpoint only accepts essay exercises.")
            return value
        except Exercise.DoesNotExist:
            raise serializers.ValidationError("Exercise not found.")


class SpeechSubmissionCreateSerializer(serializers.Serializer):
    """Serializer for creating speech submissions"""
    exercise_id = serializers.IntegerField()
    audio_file = serializers.FileField()
    time_taken = serializers.IntegerField(min_value=0, required=False)
    
    def validate_exercise_id(self, value):
        try:
            exercise = Exercise.objects.get(id=value)
            if exercise.type != 'speaking':
                raise serializers.ValidationError("This endpoint only accepts speaking exercises.")
            return value
        except Exercise.DoesNotExist:
            raise serializers.ValidationError("Exercise not found.")
    
    def validate_audio_file(self, value):
        # Validate file type and size
        allowed_types = ['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Only audio files are allowed (WAV, MP3, M4A, OGG).")
        
        # Limit file size to 10MB
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("Audio file size cannot exceed 10MB.")
        
        return value


class UserStatsSerializer(serializers.Serializer):
    """Serializer for user statistics"""
    total_points = serializers.IntegerField()
    lessons_completed = serializers.IntegerField()
    exercises_completed = serializers.IntegerField()
    badges_earned = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    average_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    time_spent_learning = serializers.IntegerField()  # in minutes
    rank = serializers.IntegerField()
    level = serializers.CharField()