from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import timedelta

User = get_user_model()

class Lesson(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('master', 'Master'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    estimated_time = models.IntegerField(help_text='Estimated time in minutes')
    points_available = models.IntegerField(default=100)
    image_url = models.URLField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    prerequisites = models.ManyToManyField('self', blank=True, symmetrical=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField('Tag', blank=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#3498db")
    icon = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default="#95a5a6")

    def __str__(self):
        return self.name

class Exercise(models.Model):
    EXERCISE_TYPES = [
        ('multiple-choice', 'Multiple Choice'),
        ('fill-in-blank', 'Fill in the Blank'),
        ('matching', 'Matching'),
        ('listening', 'Listening'),
        ('speaking', 'Speaking'),
        ('drag-drop', 'Drag and Drop'),
        ('true-false', 'True/False'),
        ('ordering', 'Ordering'),
        ('crossword', 'Crossword'),
        ('word-search', 'Word Search'),
        ('flashcards', 'Flashcards'),
        ('dictation', 'Dictation'),
        ('translation', 'Translation'),
        ('role-play', 'Role Play'),
        ('scenario', 'Scenario')
    ]

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises')
    type = models.CharField(max_length=20, choices=EXERCISE_TYPES)
    question = models.TextField()
    options = models.JSONField(blank=True, null=True)
    correct_answer = models.TextField()
    explanation = models.TextField(blank=True)
    points = models.IntegerField(default=10)
    time_limit = models.IntegerField(help_text='Time limit in seconds', null=True, blank=True)
    hints = models.JSONField(blank=True, null=True)
    difficulty_multiplier = models.FloatField(default=1.0)
    required_accuracy = models.FloatField(default=0.8)
    feedback_type = models.CharField(
        max_length=20,
        choices=[
            ('immediate', 'Immediate'),
            ('delayed', 'Delayed'),
            ('none', 'None')
        ],
        default='immediate'
    )
    image_url = models.URLField(blank=True)
    audio_url = models.URLField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.lesson.title} - {self.type}"

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    completed_exercises = models.ManyToManyField(Exercise, blank=True)
    accuracy = models.FloatField(default=0.0)
    time_spent = models.IntegerField(default=0)  # in seconds
    streak_days = models.IntegerField(default=0)
    last_streak_date = models.DateField(null=True, blank=True)
    mastery_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('master', 'Master')
        ],
        default='beginner'
    )
    completed = models.BooleanField(default=False)
    favorite = models.BooleanField(default=False)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'lesson']
        verbose_name_plural = "User Progress"

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

class ExerciseAttempt(models.Model):
    user_progress = models.ForeignKey(UserProgress, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    user_answer = models.TextField()
    is_correct = models.BooleanField()
    points_earned = models.IntegerField(default=0)
    time_taken = models.IntegerField(null=True, blank=True)  # in seconds
    accuracy = models.FloatField(default=0.0)
    hints_used = models.IntegerField(default=0)
    feedback_given = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_progress.user.username} - {self.exercise}"

class Achievement(models.Model):
    ACHIEVEMENT_TYPES = [
        ('streak', 'Streak'),
        ('score', 'Score'),
        ('complete', 'Completion'),
        ('mastery', 'Mastery'),
        ('challenge', 'Challenge'),
        ('social', 'Social'),
        ('special', 'Special')
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES)
    requirement = models.IntegerField()
    points_reward = models.IntegerField(default=0)
    badge_image = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'achievement']

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"

class DailyChallenge(models.Model):
    CHALLENGE_TYPES = [
        ('streak', 'Streak'),
        ('score', 'Score'),
        ('complete', 'Completion'),
        ('practice', 'Practice Time')
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=CHALLENGE_TYPES)
    requirement = models.IntegerField()
    points_reward = models.IntegerField(default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class UserChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(DailyChallenge, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'challenge']

    def __str__(self):
        return f"{self.user.username} - {self.challenge.title}"

class UserNote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    content = models.TextField()
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

class UserFeedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'lesson']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

class Leaderboard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_score = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    total_exercises = models.IntegerField(default=0)
    average_accuracy = models.FloatField(default=0.0)
    streak_days = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-total_score', '-average_accuracy']

    def __str__(self):
        return f"{self.user.username} - Rank {self.rank}"

class Badge(models.Model):
    BADGE_TYPES = [
        ('achievement', 'Achievement'),
        ('milestone', 'Milestone'),
        ('special', 'Special'),
        ('event', 'Event')
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=BADGE_TYPES)
    image_url = models.URLField()
    requirement = models.IntegerField()
    points_reward = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'badge']

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}" 