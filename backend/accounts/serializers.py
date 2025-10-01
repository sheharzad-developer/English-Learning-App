# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from allauth.socialaccount.models import SocialAccount

class UserSerializer(serializers.ModelSerializer):
    social_accounts = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'full_name', 'first_name', 'last_name',
            'role', 'profile_picture', 'phone_number', 'date_of_birth', 'bio',
            'is_active', 'is_email_verified', 'date_joined', 'social_accounts'
        ]
        read_only_fields = ['id', 'date_joined', 'social_accounts']
    
    def get_social_accounts(self, obj):
        social_accounts = SocialAccount.objects.filter(user=obj)
        return [{
            'provider': account.provider,
            'uid': account.uid,
            'extra_data': account.extra_data
        } for account in social_accounts]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'email', 'password', 'password_confirm', 'full_name', 
            'first_name', 'last_name', 'role', 'phone_number'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'full_name': {'required': False, 'allow_blank': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'phone_number': {'required': False, 'allow_blank': True},
            'role': {'required': False}
        }
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm from validated_data
        validated_data.pop('password_confirm', None)
        
        # Set default role if not provided
        if 'role' not in validated_data or not validated_data['role']:
            validated_data['role'] = 'student'
        
        # Generate username from email if not provided
        if not validated_data.get('username'):
            base_username = validated_data['email'].split('@')[0]
            username = base_username
            counter = 1
            
            # Ensure username is unique
            while CustomUser.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            validated_data['username'] = username
        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data.get('username', ''),
            full_name=validated_data.get('full_name', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data['role'],
            phone_number=validated_data.get('phone_number', '')
        )
        return user

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'full_name', 'first_name', 'last_name', 'profile_picture',
            'phone_number', 'date_of_birth', 'bio'
        ]
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
