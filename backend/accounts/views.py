# accounts/views.py
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import user_passes_test
from django.utils.decorators import method_decorator
from .serializers import UserSerializer, RegisterSerializer, UserProfileUpdateSerializer
from .models import CustomUser

# Custom permission classes
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin

class IsTeacherUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_teacher or request.user.is_admin)

class IsStudentUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_student or request.user.is_admin)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username_or_email = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')
        
        if not username_or_email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Try to authenticate with email
        user = None
        try:
            user_obj = CustomUser.objects.get(email=username_or_email)
            user = authenticate(request, username=user_obj.username or user_obj.email, password=password)
            if not user:
                # Try authenticating directly with email as username
                user = authenticate(request, username=username_or_email, password=password)
        except CustomUser.DoesNotExist:
            pass
        
        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login successful'
            })
        else:
            return Response({
                'error': 'No active account found with the given credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'user': UserSerializer(request.user).data,
                'message': 'Profile updated successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    """Admin-only view to list all users"""
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = CustomUser.objects.all()
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role)
        return queryset

class TeacherDashboardView(APIView):
    """Teacher-specific dashboard view"""
    permission_classes = [IsTeacherUser]
    
    def get(self, request):
        # Get teacher's students and classes
        students = CustomUser.objects.filter(role='student')
        return Response({
            'teacher': UserSerializer(request.user).data,
            'total_students': students.count(),
            'message': 'Teacher dashboard data'
        })

class StudentDashboardView(APIView):
    """Student-specific dashboard view"""
    permission_classes = [IsStudentUser]
    
    def get(self, request):
        from learning.models import UserProgress, Submission, UserBadge, UserPoints, UserStreak
        from django.db.models import Count, Avg, Sum, Q
        from datetime import datetime, timedelta
        
        user = request.user
        
        # Get learning statistics
        total_submissions = Submission.objects.filter(user=user).count()
        correct_submissions = Submission.objects.filter(user=user, is_correct=True).count()
        average_score = Submission.objects.filter(user=user).aggregate(
            avg_score=Avg('score')
        )['avg_score'] or 0
        
        # Get progress data
        progress_data = UserProgress.objects.filter(user=user).aggregate(
            total_lessons=Count('lesson', distinct=True),
            completed_lessons=Count('lesson', filter=Q(completed=True), distinct=True)
        )
        
        # Get points and streak
        try:
            user_points = UserPoints.objects.get(user=user)
            total_points = user_points.total_points
        except UserPoints.DoesNotExist:
            total_points = 0
            
        try:
            user_streak = UserStreak.objects.get(user=user)
            current_streak = user_streak.current_streak
        except UserStreak.DoesNotExist:
            current_streak = 0
            
        # Get badges
        badges_count = UserBadge.objects.filter(user=user).count()
        
        # Calculate overall progress percentage
        total_lessons = progress_data['total_lessons'] or 1
        completed_lessons = progress_data['completed_lessons'] or 0
        overall_progress = min(int((completed_lessons / total_lessons) * 100), 100)
        
        # Get recent activity (last 7 days)
        week_ago = datetime.now() - timedelta(days=7)
        recent_submissions = Submission.objects.filter(
            user=user,
            submitted_at__gte=week_ago
        ).select_related('exercise', 'exercise__lesson').order_by('-submitted_at')[:10]
        
        # Calculate study time (estimate based on submissions)
        study_time = total_submissions * 3  # Assume 3 minutes per submission
        
        # Determine current level
        if overall_progress < 25:
            current_level = 'Beginner'
        elif overall_progress < 50:
            current_level = 'Elementary'
        elif overall_progress < 75:
            current_level = 'Intermediate'
        else:
            current_level = 'Advanced'
            
        statistics = {
            'lessons_completed': completed_lessons,
            'total_lessons': total_lessons,
            'quizzes_taken': total_submissions,
            'correct_answers': correct_submissions,
            'average_score': round(average_score, 1) if average_score else 0,
            'total_points': total_points,
            'current_streak': current_streak,
            'badges_earned': badges_count,
            'overall_progress': overall_progress,
            'study_time': study_time,
            'current_level': current_level
        }
        
        # Serialize recent activity
        recent_activity = []
        for submission in recent_submissions:
            recent_activity.append({
                'id': submission.id,
                'exercise_title': submission.exercise.title if submission.exercise else 'Quiz',
                'lesson_title': submission.exercise.lesson.title if submission.exercise and submission.exercise.lesson else 'Practice',
                'score': submission.score,
                'is_correct': submission.is_correct,
                'created_at': submission.created_at,
                'time_taken': submission.time_taken
            })
        
        return Response({
            'student': UserSerializer(user).data,
            'statistics': statistics,
            'recent_activity': recent_activity,
            'message': 'Student dashboard data loaded successfully'
        })

class AdminDashboardView(APIView):
    """Admin-specific dashboard view"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        total_users = CustomUser.objects.count()
        total_students = CustomUser.objects.filter(role='student').count()
        total_teachers = CustomUser.objects.filter(role='teacher').count()
        total_admins = CustomUser.objects.filter(role='admin').count()
        
        return Response({
            'admin': UserSerializer(request.user).data,
            'statistics': {
                'total_users': total_users,
                'total_students': total_students,
                'total_teachers': total_teachers,
                'total_admins': total_admins
            },
            'message': 'Admin dashboard data'
        })
