from rest_framework import viewsets
from .models import Lesson, Exercise
from .serializers import LessonSerializer, ExerciseSerializer, AdminStatsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from learning.models import Lesson


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        user_count = User.objects.count()
        lesson_count = Lesson.objects.count()
        submission_count = 0  # UserProgress removed

        stats = {
            'users': user_count,
            'lessons': lesson_count,
            'submissions': submission_count
        }

        serializer = AdminStatsSerializer(stats)
        return Response(serializer.data) 