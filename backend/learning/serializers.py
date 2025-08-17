from rest_framework import serializers
from .models import Lesson, Exercise
from rest_framework import serializers
from django.contrib.auth.models import User
from learning.models import Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class AdminStatsSerializer(serializers.Serializer):
    users = serializers.IntegerField()
    lessons = serializers.IntegerField()
    submissions = serializers.IntegerField() 