from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from .models import CustomUser
from .serializers import UserSerializer
import requests

class GoogleLogin(SocialLoginView):
    """Google OAuth2 login view"""
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/auth/google/callback/"
    client_class = OAuth2Client

class FacebookLogin(SocialLoginView):
    """Facebook OAuth2 login view"""
    adapter_class = FacebookOAuth2Adapter
    callback_url = "http://localhost:3000/auth/facebook/callback/"
    client_class = OAuth2Client

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """Handle Google authentication with access token"""
    access_token = request.data.get('access_token')
    
    if not access_token:
        return Response({
            'error': 'Access token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify the token with Google
        google_response = requests.get(
            f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}'
        )
        
        if google_response.status_code != 200:
            return Response({
                'error': 'Invalid access token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        google_data = google_response.json()
        email = google_data.get('email')
        first_name = google_data.get('given_name', '')
        last_name = google_data.get('family_name', '')
        full_name = google_data.get('name', f'{first_name} {last_name}'.strip())
        picture = google_data.get('picture', '')
        google_id = google_data.get('id')
        
        if not email:
            return Response({
                'error': 'Email not provided by Google'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            # Create new user
            user = CustomUser.objects.create_user(
                email=email,
                first_name=first_name,
                last_name=last_name,
                full_name=full_name,
                profile_picture=picture,
                is_email_verified=True,
                role='student'  # Default role
            )
        
        # Create or get social account
        social_account, created = SocialAccount.objects.get_or_create(
            user=user,
            provider='google',
            uid=google_id,
            defaults={
                'extra_data': google_data
            }
        )
        
        # Generate token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Google authentication successful'
        })
        
    except Exception as e:
        return Response({
            'error': f'Authentication failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def facebook_auth(request):
    """Handle Facebook authentication with access token"""
    access_token = request.data.get('access_token')
    
    if not access_token:
        return Response({
            'error': 'Access token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify the token with Facebook
        facebook_response = requests.get(
            f'https://graph.facebook.com/me?fields=id,email,first_name,last_name,name,picture&access_token={access_token}'
        )
        
        if facebook_response.status_code != 200:
            return Response({
                'error': 'Invalid access token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        facebook_data = facebook_response.json()
        email = facebook_data.get('email')
        first_name = facebook_data.get('first_name', '')
        last_name = facebook_data.get('last_name', '')
        full_name = facebook_data.get('name', f'{first_name} {last_name}'.strip())
        picture = facebook_data.get('picture', {}).get('data', {}).get('url', '')
        facebook_id = facebook_data.get('id')
        
        if not email:
            return Response({
                'error': 'Email not provided by Facebook'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            # Create new user
            user = CustomUser.objects.create_user(
                email=email,
                first_name=first_name,
                last_name=last_name,
                full_name=full_name,
                profile_picture=picture,
                is_email_verified=True,
                role='student'  # Default role
            )
        
        # Create or get social account
        social_account, created = SocialAccount.objects.get_or_create(
            user=user,
            provider='facebook',
            uid=facebook_id,
            defaults={
                'extra_data': facebook_data
            }
        )
        
        # Generate token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Facebook authentication successful'
        })
        
    except Exception as e:
        return Response({
            'error': f'Authentication failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)