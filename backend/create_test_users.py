#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/Users/sheharzad/English-Learning-App/backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

def create_test_users():
    print("Creating test users...")
    
    # Test users as mentioned in README
    test_users = [
        {
            'email': 'admin@example.com',
            'username': 'admin',
            'password': 'admin123',
            'role': 'admin',
            'first_name': 'Admin',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True
        },
        {
            'email': 'teacher@example.com',
            'username': 'teacher',
            'password': 'teacher123',
            'role': 'teacher',
            'first_name': 'Teacher',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': False
        },
        {
            'email': 'student@example.com',
            'username': 'student',
            'password': 'student123',
            'role': 'student',
            'first_name': 'Student',
            'last_name': 'User',
            'is_staff': False,
            'is_superuser': False
        }
    ]
    
    for user_data in test_users:
        try:
            # Check if user already exists
            if User.objects.filter(email=user_data['email']).exists():
                print(f"User with email {user_data['email']} already exists")
                continue
                
            # Create user
            user = User.objects.create_user(
                email=user_data['email'],
                username=user_data['username'],
                password=user_data['password'],
                role=user_data['role'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                is_staff=user_data['is_staff'],
                is_superuser=user_data['is_superuser']
            )
            print(f"Created user: {user.email} ({user.role})")
            
        except IntegrityError as e:
            print(f"Error creating user {user_data['email']}: {e}")
        except Exception as e:
            print(f"Unexpected error creating user {user_data['email']}: {e}")
    
    print("\nTest user creation completed!")
    print(f"Total users in database: {User.objects.count()}")
    print("\nTest Users Created:")
    print("- Admin: admin@example.com / admin123")
    print("- Teacher: teacher@example.com / teacher123")
    print("- Student: student@example.com / student123")

if __name__ == '__main__':
    create_test_users()