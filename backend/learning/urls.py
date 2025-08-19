from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'skill-levels', views.SkillLevelViewSet)
router.register(r'lessons', views.LessonViewSet)
router.register(r'exercises', views.ExerciseViewSet)
router.register(r'user-progress', views.UserProgressViewSet)
router.register(r'submissions', views.SubmissionViewSet)
router.register(r'badges', views.BadgeViewSet)
router.register(r'user-badges', views.UserBadgeViewSet)
router.register(r'leaderboard', views.LeaderboardViewSet)
router.register(r'user-streaks', views.UserStreakViewSet)
router.register(r'user-points', views.UserPointsViewSet)

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    
    # Additional custom endpoints
    path('stats/', views.UserStatsView.as_view(), name='user-stats'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    
    # Lesson-specific endpoints
    path('lessons/<int:lesson_id>/start/', 
         views.LessonViewSet.as_view({'post': 'start_lesson'}), 
         name='start-lesson'),
    path('lessons/<int:lesson_id>/complete/', 
         views.LessonViewSet.as_view({'post': 'complete_lesson'}), 
         name='complete-lesson'),
    
    # Exercise submission endpoints
    path('exercises/<int:exercise_id>/submit-quiz/', 
         views.ExerciseViewSet.as_view({'post': 'submit_quiz'}), 
         name='submit-quiz'),
    path('exercises/<int:exercise_id>/submit-essay/', 
         views.ExerciseViewSet.as_view({'post': 'submit_essay'}), 
         name='submit-essay'),
    path('exercises/<int:exercise_id>/submit-speech/', 
         views.ExerciseViewSet.as_view({'post': 'submit_speech'}), 
         name='submit-speech'),
    
    # Progress tracking endpoints
    path('progress/lesson/<int:lesson_id>/', 
         views.UserProgressViewSet.as_view({'get': 'lesson_progress'}), 
         name='lesson-progress'),
    path('progress/category/<int:category_id>/', 
         views.UserProgressViewSet.as_view({'get': 'category_progress'}), 
         name='category-progress'),
    
    # Gamification endpoints
    path('my-badges/', 
         views.UserBadgeViewSet.as_view({'get': 'my_badges'}), 
         name='my-badges'),
    path('my-points/', 
         views.UserPointsViewSet.as_view({'get': 'my_points'}), 
         name='my-points'),
    path('my-streak/', 
         views.UserStreakViewSet.as_view({'get': 'my_streak'}), 
         name='my-streak'),
    
    # Leaderboard endpoints
    path('leaderboard/global/', 
         views.LeaderboardViewSet.as_view({'get': 'global_leaderboard'}), 
         name='global-leaderboard'),
    path('leaderboard/category/<int:category_id>/', 
         views.LeaderboardViewSet.as_view({'get': 'category_leaderboard'}), 
         name='category-leaderboard'),
]

# Add router URLs
urlpatterns += router.urls
