from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users with different roles
        self.admin_user = User.objects.create_user(
            username='admin_test',
            email='admin@test.com',
            password='testpass123',
            role='admin'
        )
        
        self.teacher_user = User.objects.create_user(
            username='teacher_test',
            email='teacher@test.com',
            password='testpass123',
            role='teacher'
        )
        
        self.student_user = User.objects.create_user(
            username='student_test',
            email='student@test.com',
            password='testpass123',
            role='student'
        )
        
        # Create JWT tokens for authentication
        self.admin_refresh = RefreshToken.for_user(self.admin_user)
        self.admin_token = str(self.admin_refresh.access_token)
        
        self.teacher_refresh = RefreshToken.for_user(self.teacher_user)
        self.teacher_token = str(self.teacher_refresh.access_token)
        
        self.student_refresh = RefreshToken.for_user(self.student_user)
        self.student_token = str(self.student_refresh.access_token)

    def test_user_registration(self):
        """Test user registration endpoint"""
        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': 'newpass123',
            'password2': 'newpass123',
            'full_name': 'New User',
            'first_name': 'New',
            'last_name': 'User',
            'role': 'student'
        }
        response = self.client.post(url, data, format='json')
        if response.status_code != status.HTTP_201_CREATED:
            print(f"Registration failed with status {response.status_code}")
            print(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_user_login(self):
        """Test user login endpoint"""
        url = reverse('login')
        data = {
            'email': 'admin@test.com',
            'password': 'testpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)

    def test_user_list_admin_only(self):
        """Test user list endpoint is admin-only"""
        url = reverse('admin-user-list')
        
        # Test admin access
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test teacher access (should be forbidden)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Test student access (should be forbidden)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_dashboard_access(self):
        """Test teacher dashboard access with different user roles"""
        url = reverse('teacher-dashboard')
        
        # Test teacher access
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test admin access (should be allowed)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test student access (should be forbidden)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_dashboard_access(self):
        """Test student dashboard access with different user roles"""
        url = reverse('student-dashboard')
        
        # Test student access
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test admin access (should be allowed)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test teacher access (should be forbidden)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_list_admin_only(self):
        """Test user list endpoint is admin-only"""
        url = reverse('user-list')
        
        # Test admin access
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test teacher access (should be forbidden)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Test student access (should be forbidden)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_profile_access(self):
        """Test user profile access for authenticated users"""
        url = reverse('user-profile')
        
        # Test authenticated access
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'student_test')
        
        # Test unauthenticated access
        self.client.credentials()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_role_based_user_methods(self):
        """Test custom user model methods for role checking"""
        self.assertTrue(self.admin_user.is_admin)
        self.assertFalse(self.admin_user.is_teacher)
        self.assertFalse(self.admin_user.is_student)
        
        self.assertFalse(self.teacher_user.is_admin)
        self.assertTrue(self.teacher_user.is_teacher)
        self.assertFalse(self.teacher_user.is_student)
        
        self.assertFalse(self.student_user.is_admin)
        self.assertFalse(self.student_user.is_teacher)
        self.assertTrue(self.student_user.is_student)