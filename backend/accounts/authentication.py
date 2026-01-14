from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in using either
    their email address or username.
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        
        if username is None or password is None:
            return None
        
        try:
            # Try to find user by email or username
            # Build query: always check email, and check username only if it's not None and not empty
            query = Q(email__iexact=username)
            # Only check username if the provided username is not None/empty
            # and the database username field is not None/empty
            if username:
                query |= (Q(username__iexact=username) & ~Q(username__isnull=True) & ~Q(username=''))
            
            user = User.objects.get(query)
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user
            User().set_password(password)
            return None
        
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        
        return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None