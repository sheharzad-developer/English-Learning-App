from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Category, Tag, Lesson, Exercise, UserProgress,
    ExerciseAttempt, Achievement, UserAchievement,
    DailyChallenge, UserChallenge, UserNote, UserFeedback,
    Leaderboard, Badge, UserBadge
)

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'

class ExerciseAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseAttempt
        fields = '__all__'
        read_only_fields = ('is_correct', 'points_earned', 'accuracy')

class UserProgressSerializer(serializers.ModelSerializer):
    completed_exercises = ExerciseSerializer(many=True, read_only=True)
    lesson = LessonSerializer(read_only=True)

    class Meta:
        model = UserProgress
        fields = '__all__'

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = '__all__'

class DailyChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyChallenge
        fields = '__all__'

class UserChallengeSerializer(serializers.ModelSerializer):
    challenge = DailyChallengeSerializer(read_only=True)

    class Meta:
        model = UserChallenge
        fields = '__all__'

class UserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Leaderboard
        fields = '__all__'
        read_only_fields = ('user', 'last_updated')

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = '__all__'
        read_only_fields = ('user', 'earned_at')

class LessonDetailSerializer(LessonSerializer):
    user_progress = serializers.SerializerMethodField()
    user_notes = serializers.SerializerMethodField()
    user_feedback = serializers.SerializerMethodField()

    class Meta(LessonSerializer.Meta):
        fields = ('id', 'title', 'description', 'content', 'difficulty', 'duration', 
                 'category', 'tags', 'exercises', 'user_progress', 'user_notes', 'user_feedback')

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = UserProgress.objects.get(user=request.user, lesson=obj)
                return UserProgressSerializer(progress).data
            except UserProgress.DoesNotExist:
                return None
        return None

    def get_user_notes(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            notes = UserNote.objects.filter(user=request.user, lesson=obj)
            return UserNoteSerializer(notes, many=True).data
        return []

    def get_user_feedback(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                feedback = UserFeedback.objects.get(user=request.user, lesson=obj)
                return UserFeedbackSerializer(feedback).data
            except UserFeedback.DoesNotExist:
                return None
        return None 