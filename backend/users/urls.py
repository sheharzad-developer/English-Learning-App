from django.urls import path
from .views import (
    RegisterView, 
    ProfileView, 
    MyTokenObtainPairView,
    UserListView,
    UserDetailView,
    UserManagementView
)

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    
    # Profile endpoints
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Admin user management endpoints
    path('list/', UserListView.as_view(), name='user-list'),
    path('detail/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('manage/', UserManagementView.as_view(), name='user-manage'),
    path('manage/<int:user_id>/', UserManagementView.as_view(), name='user-manage-detail'),
]
