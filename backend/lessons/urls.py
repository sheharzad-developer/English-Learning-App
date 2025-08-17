from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LessonViewSet, UserProgressViewSet, AchievementViewSet,
    DailyChallengeViewSet, UserChallengeViewSet, CategoryViewSet,
    TagViewSet, UserNoteViewSet, UserFeedbackViewSet,
    LeaderboardViewSet, BadgeViewSet, UserBadgeViewSet
)

router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'progress', UserProgressViewSet, basename='progress')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'challenges', DailyChallengeViewSet, basename='challenge')
router.register(r'user-challenges', UserChallengeViewSet, basename='user-challenge')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'notes', UserNoteViewSet, basename='note')
router.register(r'feedback', UserFeedbackViewSet, basename='feedback')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'badges', BadgeViewSet, basename='badge')
router.register(r'user-badges', UserBadgeViewSet, basename='user-badge')

urlpatterns = [
    path('', include(router.urls)),
] 