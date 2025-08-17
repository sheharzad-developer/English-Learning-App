from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, ExerciseViewSet, AdminStatsView


router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'exercises', ExerciseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]
