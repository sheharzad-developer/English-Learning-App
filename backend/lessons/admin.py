from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Lesson, Exercise, UserProgress, ExerciseAttempt,
    Achievement, UserAchievement, DailyChallenge, UserChallenge,
    Category, Tag, UserNote, UserFeedback
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'color_display')
    search_fields = ('name', 'description')
    list_filter = ('name',)

    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 5px 10px; border-radius: 3px;">{}</span>',
            obj.color,
            obj.color
        )
    color_display.short_description = 'Color'

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'color_display')
    search_fields = ('name',)

    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 5px 10px; border-radius: 3px;">{}</span>',
            obj.color,
            obj.color
        )
    color_display.short_description = 'Color'

class ExerciseInline(admin.TabularInline):
    model = Exercise
    extra = 1
    fields = ('type', 'question', 'points', 'order', 'is_active')

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'estimated_time', 'points_available', 'is_active', 'order')
    list_filter = ('difficulty', 'is_active', 'category', 'tags')
    search_fields = ('title', 'description')
    inlines = [ExerciseInline]
    filter_horizontal = ('prerequisites', 'tags')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'difficulty', 'estimated_time', 'points_available')
        }),
        ('Media', {
            'fields': ('image_url', 'video_url')
        }),
        ('Organization', {
            'fields': ('category', 'tags', 'prerequisites', 'order')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'type', 'points', 'time_limit', 'is_active', 'order')
    list_filter = ('type', 'is_active', 'lesson')
    search_fields = ('question', 'explanation')
    fieldsets = (
        ('Basic Information', {
            'fields': ('lesson', 'type', 'question', 'correct_answer', 'explanation')
        }),
        ('Options and Media', {
            'fields': ('options', 'image_url', 'audio_url')
        }),
        ('Scoring and Timing', {
            'fields': ('points', 'time_limit', 'difficulty_multiplier', 'required_accuracy')
        }),
        ('Hints and Feedback', {
            'fields': ('hints', 'feedback_type')
        }),
        ('Status', {
            'fields': ('is_active', 'order')
        }),
    )

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'score', 'completed', 'mastery_level', 'streak_days')
    list_filter = ('completed', 'mastery_level', 'lesson')
    search_fields = ('user__email', 'lesson__title')
    filter_horizontal = ('completed_exercises',)

@admin.register(ExerciseAttempt)
class ExerciseAttemptAdmin(admin.ModelAdmin):
    list_display = ('user_progress', 'exercise', 'is_correct', 'points_earned', 'time_taken', 'created_at')
    list_filter = ('is_correct', 'exercise__type')
    search_fields = ('user_progress__user__email', 'exercise__question')
    readonly_fields = ('created_at',)

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'requirement', 'points_reward', 'is_active', 'color_display')
    list_filter = ('type', 'is_active')
    search_fields = ('name', 'description')

    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 5px 10px; border-radius: 3px;">{}</span>',
            obj.color,
            obj.color
        )
    color_display.short_description = 'Color'

@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'earned_at')
    list_filter = ('achievement__type',)
    search_fields = ('user__email', 'achievement__name')
    readonly_fields = ('earned_at',)

@admin.register(DailyChallenge)
class DailyChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'requirement', 'points_reward', 'start_date', 'end_date', 'is_active')
    list_filter = ('type', 'is_active')
    search_fields = ('title', 'description')
    date_hierarchy = 'start_date'

@admin.register(UserChallenge)
class UserChallengeAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'progress', 'completed', 'completed_at')
    list_filter = ('completed', 'challenge__type')
    search_fields = ('user__email', 'challenge__title')
    readonly_fields = ('completed_at',)

@admin.register(UserNote)
class UserNoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'is_public', 'created_at', 'updated_at')
    list_filter = ('is_public', 'lesson')
    search_fields = ('user__email', 'lesson__title', 'content')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'rating', 'created_at')
    list_filter = ('rating', 'lesson')
    search_fields = ('user__email', 'lesson__title', 'comment')
    readonly_fields = ('created_at',) 