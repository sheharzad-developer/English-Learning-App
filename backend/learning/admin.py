from django.contrib import admin
from .models import (
    Category, SkillLevel, Lesson, Exercise, UserProgress, 
    Submission, EssaySubmission, SpeechSubmission,
    UserPoints, Badge, UserBadge, UserStreak, Leaderboard
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']


@admin.register(SkillLevel)
class SkillLevelAdmin(admin.ModelAdmin):
    list_display = ['name', 'order_index', 'min_points', 'created_at']
    list_filter = ['order_index', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['order_index']


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'skill_level', 'points', 'is_published', 'created_at']
    list_filter = ['category', 'skill_level', 'is_published', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'skill_level')
        }),
        ('Content', {
            'fields': ('content', 'video_url', 'audio_url', 'thumbnail')
        }),
        ('Settings', {
            'fields': ('duration', 'points', 'is_published', 'order_index')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'type', 'difficulty', 'points', 'created_at']
    list_filter = ['type', 'difficulty', 'lesson__category', 'created_at']
    search_fields = ['title', 'lesson__title']
    readonly_fields = ['created_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'lesson', 'type')
        }),
        ('Content', {
            'fields': ('content', 'options', 'correct_answer', 'hints', 'explanation')
        }),
        ('Settings', {
            'fields': ('difficulty', 'points', 'time_limit', 'order_index')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'completed', 'score', 'created_at', 'completed_at']
    list_filter = ['completed', 'lesson__category', 'lesson__skill_level', 'created_at']
    search_fields = ['user__username', 'user__email', 'lesson__title']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    fieldsets = (
        ('Progress Information', {
            'fields': ('user', 'lesson', 'completed', 'score', 'attempts', 'time_spent')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['user', 'exercise', 'score', 'is_correct', 'submitted_at']
    list_filter = ['is_correct', 'exercise__type', 'submitted_at']
    search_fields = ['user__username', 'exercise__title']
    readonly_fields = ['submitted_at']


@admin.register(EssaySubmission)
class EssaySubmissionAdmin(admin.ModelAdmin):
    list_display = ['submission', 'processing_status', 'grammar_score', 'spelling_score', 'processed_at']
    list_filter = ['processing_status', 'processed_at']
    readonly_fields = ['processed_at']


@admin.register(SpeechSubmission)
class SpeechSubmissionAdmin(admin.ModelAdmin):
    list_display = ['submission', 'processing_status', 'pronunciation_score', 'fluency_score', 'processed_at']
    list_filter = ['processing_status', 'processed_at']
    readonly_fields = ['processed_at']


@admin.register(UserPoints)
class UserPointsAdmin(admin.ModelAdmin):
    list_display = ['user', 'points', 'source', 'description', 'earned_at']
    list_filter = ['source', 'earned_at']
    search_fields = ['user__username', 'description']
    readonly_fields = ['earned_at']


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'points_reward', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ['user', 'badge', 'earned_at']
    list_filter = ['badge', 'earned_at']
    search_fields = ['user__username', 'badge__name']
    readonly_fields = ['earned_at']


@admin.register(UserStreak)
class UserStreakAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_streak', 'longest_streak', 'last_activity_date']
    search_fields = ['user__username']
    readonly_fields = ['last_activity_date']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_points', 'rank', 'lessons_completed', 'badges_earned']
    search_fields = ['user__username']
    readonly_fields = ['user', 'total_points', 'rank', 'lessons_completed', 'badges_earned']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False