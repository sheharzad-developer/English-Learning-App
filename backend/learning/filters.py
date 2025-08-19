import django_filters
from django.db.models import Q
from .models import Lesson, Exercise, UserProgress, Submission


class LessonFilter(django_filters.FilterSet):
    """Filter for lessons"""
    category = django_filters.NumberFilter(field_name='category__id')
    skill_level = django_filters.NumberFilter(field_name='skill_level__id')
    difficulty = django_filters.ChoiceFilter(
        choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')]
    )
    points_min = django_filters.NumberFilter(field_name='points', lookup_expr='gte')
    points_max = django_filters.NumberFilter(field_name='points', lookup_expr='lte')
    duration_min = django_filters.NumberFilter(field_name='duration', lookup_expr='gte')
    duration_max = django_filters.NumberFilter(field_name='duration', lookup_expr='lte')
    has_video = django_filters.BooleanFilter(method='filter_has_video')
    has_audio = django_filters.BooleanFilter(method='filter_has_audio')
    search = django_filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Lesson
        fields = [
            'category', 'skill_level', 'difficulty', 'points_min', 'points_max',
            'duration_min', 'duration_max', 'has_video', 'has_audio', 'search'
        ]
    
    def filter_has_video(self, queryset, name, value):
        if value:
            return queryset.exclude(video_url__isnull=True).exclude(video_url='')
        return queryset.filter(Q(video_url__isnull=True) | Q(video_url=''))
    
    def filter_has_audio(self, queryset, name, value):
        if value:
            return queryset.exclude(audio_url__isnull=True).exclude(audio_url='')
        return queryset.filter(Q(audio_url__isnull=True) | Q(audio_url=''))
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(category__name__icontains=value) |
            Q(skill_level__name__icontains=value)
        )


class ExerciseFilter(django_filters.FilterSet):
    """Filter for exercises"""
    lesson = django_filters.NumberFilter(field_name='lesson__id')
    lesson_category = django_filters.NumberFilter(field_name='lesson__category__id')
    lesson_skill_level = django_filters.NumberFilter(field_name='lesson__skill_level__id')
    type = django_filters.ChoiceFilter(
        choices=[
            ('mcq', 'Multiple Choice'),
            ('fill_blank', 'Fill in the Blank'),
            ('matching', 'Matching'),
            ('drag_drop', 'Drag and Drop'),
            ('essay', 'Essay'),
            ('speaking', 'Speaking'),
            ('listening', 'Listening')
        ]
    )
    difficulty = django_filters.ChoiceFilter(
        choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')]
    )
    points_min = django_filters.NumberFilter(field_name='points', lookup_expr='gte')
    points_max = django_filters.NumberFilter(field_name='points', lookup_expr='lte')
    time_limit_min = django_filters.NumberFilter(field_name='time_limit', lookup_expr='gte')
    time_limit_max = django_filters.NumberFilter(field_name='time_limit', lookup_expr='lte')
    search = django_filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Exercise
        fields = [
            'lesson', 'lesson_category', 'lesson_skill_level', 'type', 'difficulty',
            'points_min', 'points_max', 'time_limit_min', 'time_limit_max', 'search'
        ]
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(lesson__title__icontains=value) |
            Q(lesson__category__name__icontains=value)
        )


class UserProgressFilter(django_filters.FilterSet):
    """Filter for user progress"""
    lesson = django_filters.NumberFilter(field_name='lesson__id')
    lesson_category = django_filters.NumberFilter(field_name='lesson__category__id')
    lesson_skill_level = django_filters.NumberFilter(field_name='lesson__skill_level__id')
    completed = django_filters.BooleanFilter()
    score_min = django_filters.NumberFilter(field_name='score', lookup_expr='gte')
    score_max = django_filters.NumberFilter(field_name='score', lookup_expr='lte')
    date_from = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    completed_from = django_filters.DateFilter(field_name='completed_at', lookup_expr='gte')
    completed_to = django_filters.DateFilter(field_name='completed_at', lookup_expr='lte')
    
    class Meta:
        model = UserProgress
        fields = [
            'lesson', 'lesson_category', 'lesson_skill_level', 'completed',
            'score_min', 'score_max', 'date_from', 'date_to',
            'completed_from', 'completed_to'
        ]


class SubmissionFilter(django_filters.FilterSet):
    """Filter for submissions"""
    exercise = django_filters.NumberFilter(field_name='exercise__id')
    exercise_type = django_filters.ChoiceFilter(
        field_name='exercise__type',
        choices=[
            ('mcq', 'Multiple Choice'),
            ('fill_blank', 'Fill in the Blank'),
            ('matching', 'Matching'),
            ('drag_drop', 'Drag and Drop'),
            ('essay', 'Essay'),
            ('speaking', 'Speaking'),
            ('listening', 'Listening')
        ]
    )
    lesson = django_filters.NumberFilter(field_name='exercise__lesson__id')
    lesson_category = django_filters.NumberFilter(field_name='exercise__lesson__category__id')
    lesson_skill_level = django_filters.NumberFilter(field_name='exercise__lesson__skill_level__id')
    is_correct = django_filters.BooleanFilter()
    score_min = django_filters.NumberFilter(field_name='score', lookup_expr='gte')
    score_max = django_filters.NumberFilter(field_name='score', lookup_expr='lte')
    date_from = django_filters.DateFilter(field_name='submitted_at', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='submitted_at', lookup_expr='lte')
    
    class Meta:
        model = Submission
        fields = [
            'exercise', 'exercise_type', 'lesson', 'lesson_category',
            'lesson_skill_level', 'is_correct', 'score_min', 'score_max',
            'date_from', 'date_to'
        ]