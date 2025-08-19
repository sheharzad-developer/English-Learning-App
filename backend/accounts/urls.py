from django.urls import path
from .views import (
    RegisterView, LoginView, UserProfileView, UserListView,
    TeacherDashboardView, StudentDashboardView, AdminDashboardView
)
from .social_views import GoogleLogin, FacebookLogin, google_auth, facebook_auth

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Social authentication endpoints
    path('auth/google/', google_auth, name='google-auth'),
    path('auth/facebook/', facebook_auth, name='facebook-auth'),
    path('auth/google/login/', GoogleLogin.as_view(), name='google-login'),
    path('auth/facebook/login/', FacebookLogin.as_view(), name='facebook-login'),
    
    # Role-based dashboard endpoints
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('teacher/dashboard/', TeacherDashboardView.as_view(), name='teacher-dashboard'),
    path('student/dashboard/', StudentDashboardView.as_view(), name='student-dashboard'),
    
    # Admin-only endpoints
    path('admin/users/', UserListView.as_view(), name='admin-user-list'),
]
