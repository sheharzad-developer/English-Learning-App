from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

class Lesson(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Exercise(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises')
    question = models.TextField()
    correct_answer = models.CharField(max_length=255)
