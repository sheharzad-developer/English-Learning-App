from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import json

User = get_user_model()


class Category(models.Model):
    """Learning categories like Grammar, Vocabulary, Listening, etc."""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)  # Icon filename or URL
    order_index = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order_index', 'name']

    def __str__(self):
        return self.name


class SkillLevel(models.Model):
    """Skill levels from Beginner to Advanced"""
    name = models.CharField(max_length=30, unique=True)
    order_index = models.IntegerField(unique=True)
    description = models.TextField(blank=True)
    min_points = models.IntegerField(default=0)  # Minimum points required to unlock
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order_index']

    def __str__(self):
        return self.name


class Lesson(models.Model):
    """Individual lessons with multimedia content"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='lessons')
    skill_level = models.ForeignKey(SkillLevel, on_delete=models.CASCADE, related_name='lessons')
    content = models.JSONField(default=dict, help_text="Rich content with text, images, videos")
    video_url = models.URLField(blank=True, max_length=500)
    audio_url = models.URLField(blank=True, max_length=500)
    thumbnail = models.URLField(blank=True, max_length=500)
    duration = models.IntegerField(null=True, blank=True, help_text="Duration in minutes")
    points = models.IntegerField(default=10)
    order_index = models.IntegerField(default=0)
    is_published = models.BooleanField(default=False)
    prerequisites = models.JSONField(default=list, help_text="Array of lesson IDs required before this lesson")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'skill_level', 'order_index']
        indexes = [
            models.Index(fields=['category', 'skill_level']),
            models.Index(fields=['is_published']),
        ]

    def __str__(self):
        return f"{self.title} ({self.category.name} - {self.skill_level.name})"

    @property
    def exercise_count(self):
        return self.exercises.count()


class Exercise(models.Model):
    """Individual exercises within lessons"""
    EXERCISE_TYPES = [
        ('mcq', 'Multiple Choice Question'),
        ('fill_blank', 'Fill in the Blank'),
        ('matching', 'Matching'),
        ('essay', 'Essay Writing'),
        ('speaking', 'Speaking Practice'),
        ('listening', 'Listening Comprehension'),
        ('reading', 'Reading Comprehension'),
        ('drag_drop', 'Drag and Drop'),
    ]

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises')
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=EXERCISE_TYPES)
    content = models.JSONField(default=dict, help_text="Question content, media URLs, instructions")
    options = models.JSONField(default=list, help_text="For MCQ, matching options")
    correct_answer = models.JSONField(default=dict, help_text="Correct answers/patterns")
    points = models.IntegerField(default=5)
    difficulty = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Difficulty scale 1-5"
    )
    order_index = models.IntegerField(default=0)
    time_limit = models.IntegerField(null=True, blank=True, help_text="Time limit in seconds")
    hints = models.JSONField(default=list, help_text="Array of hints")
    explanation = models.TextField(blank=True, help_text="Explanation for correct answer")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['lesson', 'order_index']
        indexes = [
            models.Index(fields=['lesson', 'type']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_type_display()})"


class UserProgress(models.Model):
    """Track user progress through lessons"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='user_progress')
    completed = models.BooleanField(default=False)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Percentage score")
    attempts = models.IntegerField(default=0)
    time_spent = models.IntegerField(default=0, help_text="Time spent in seconds")
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'lesson']
        indexes = [
            models.Index(fields=['user', 'completed']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} ({self.score}%)"

    def mark_completed(self, score=None):
        """Mark lesson as completed and update score"""
        self.completed = True
        self.completed_at = timezone.now()
        if score is not None:
            self.score = score
        self.save()


class Submission(models.Model):
    """Base model for exercise submissions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='submissions')
    answer = models.JSONField(help_text="User's answer")
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    is_correct = models.BooleanField(default=False)
    feedback = models.TextField(blank=True)
    time_taken = models.IntegerField(null=True, blank=True, help_text="Time taken in seconds")
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'exercise']),
            models.Index(fields=['submitted_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.exercise.title} ({self.score}%)"


class EssaySubmission(models.Model):
    """Extended submission for essay exercises"""
    PROCESSING_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    submission = models.OneToOneField(Submission, on_delete=models.CASCADE, related_name='essay_details')
    essay_text = models.TextField()
    grammar_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    spelling_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    vocabulary_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    structure_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback_json = models.JSONField(default=dict, help_text="Detailed feedback from grammar API")
    word_count = models.IntegerField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS, default='pending')

    def __str__(self):
        return f"Essay: {self.submission.user.username} - {self.submission.exercise.title}"


class SpeechSubmission(models.Model):
    """Extended submission for speaking exercises"""
    PROCESSING_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    submission = models.OneToOneField(Submission, on_delete=models.CASCADE, related_name='speech_details')
    audio_file = models.FileField(upload_to='speech_submissions/', null=True, blank=True)
    transcript = models.TextField(blank=True)
    pronunciation_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fluency_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    accuracy_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback_json = models.JSONField(default=dict, help_text="Detailed speech analysis")
    processed_at = models.DateTimeField(null=True, blank=True)
    processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS, default='pending')

    def __str__(self):
        return f"Speech: {self.submission.user.username} - {self.submission.exercise.title}"


class UserPoints(models.Model):
    """Track points earned by users"""
    POINT_SOURCES = [
        ('lesson_completion', 'Lesson Completion'),
        ('exercise_correct', 'Exercise Correct Answer'),
        ('daily_streak', 'Daily Streak'),
        ('badge_earned', 'Badge Earned'),
        ('perfect_score', 'Perfect Score'),
        ('first_attempt', 'First Attempt Success'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='points')
    points = models.IntegerField()
    source = models.CharField(max_length=100, choices=POINT_SOURCES)
    source_id = models.IntegerField(null=True, blank=True, help_text="ID of the source (lesson_id, exercise_id, etc.)")
    description = models.TextField(blank=True)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'earned_at']),
            models.Index(fields=['source']),
        ]

    def __str__(self):
        return f"{self.user.username} earned {self.points} points for {self.get_source_display()}"


class Badge(models.Model):
    """Achievement badges"""
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.URLField(max_length=500, blank=True)
    criteria = models.JSONField(help_text="Conditions to earn badge")
    points_reward = models.IntegerField(default=0)
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default='common')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_rarity_display()})"


class UserBadge(models.Model):
    """Badges earned by users"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='earned_by')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'badge']
        indexes = [
            models.Index(fields=['user', 'earned_at']),
        ]

    def __str__(self):
        return f"{self.user.username} earned {self.badge.name}"


class UserStreak(models.Model):
    """Track user learning streaks"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='streak')
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Current: {self.current_streak}, Longest: {self.longest_streak}"

    def update_streak(self):
        """Update streak based on current date"""
        today = timezone.now().date()
        
        if self.last_activity_date is None:
            # First activity
            self.current_streak = 1
            self.longest_streak = 1
            self.last_activity_date = today
        elif self.last_activity_date == today:
            # Already active today, no change
            return
        elif self.last_activity_date == today - timezone.timedelta(days=1):
            # Consecutive day
            self.current_streak += 1
            if self.current_streak > self.longest_streak:
                self.longest_streak = self.current_streak
            self.last_activity_date = today
        else:
            # Streak broken
            self.current_streak = 1
            self.last_activity_date = today
        
        self.save()


class Leaderboard(models.Model):
    """Materialized leaderboard data (updated periodically)"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='leaderboard_entry')
    total_points = models.IntegerField(default=0)
    lessons_completed = models.IntegerField(default=0)
    badges_earned = models.IntegerField(default=0)
    current_streak = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-total_points', '-lessons_completed']
        indexes = [
            models.Index(fields=['rank']),
            models.Index(fields=['-total_points']),
        ]

    def __str__(self):
        return f"#{self.rank} {self.user.username} ({self.total_points} points)"

    @classmethod
    def update_leaderboard(cls):
        """Update leaderboard rankings"""
        from django.db.models import Sum, Count
        
        # Calculate stats for all active students
        users_data = User.objects.filter(
            is_active=True, 
            role='student'
        ).annotate(
            total_points=Sum('points__points') or 0,
            lessons_completed=Count('lesson_progress', filter=models.Q(lesson_progress__completed=True)),
            badges_earned=Count('badges')
        ).order_by('-total_points', '-lessons_completed')
        
        # Update or create leaderboard entries
        for rank, user_data in enumerate(users_data, 1):
            streak = getattr(user_data, 'streak', None)
            current_streak = streak.current_streak if streak else 0
            
            cls.objects.update_or_create(
                user=user_data,
                defaults={
                    'total_points': user_data.total_points,
                    'lessons_completed': user_data.lessons_completed,
                    'badges_earned': user_data.badges_earned,
                    'current_streak': current_streak,
                    'rank': rank,
                }
            )
