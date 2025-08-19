from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

User = get_user_model()

# --- User Serializer ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role']
        read_only_fields = ['id']

# --- Profile Update Serializer ---
class ProfileUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'full_name', 'password']
        extra_kwargs = {
            'password': {'required': False}
        }

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        if value:
            try:
                validate_password(value)
            except ValidationError as e:
                raise serializers.ValidationError(list(e.messages))
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user

# --- Register Serializer ---
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True, max_length=150)
    full_name = serializers.CharField(required=False, max_length=100, default='')
    role = serializers.ChoiceField(
        choices=[('admin', 'Admin'), ('student', 'Student'), ('teacher', 'Teacher')],
        default='student'
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'full_name', 'password', 'role')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'role': {'required': False}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def create(self, validated_data):
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except Exception as e:
            raise serializers.ValidationError(f"Error creating user: {str(e)}")

# --- Custom JWT Token Serializer ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'  # Accept username field from frontend
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['role'] = user.role
        return token

    def validate(self, attrs):
        # Use our custom authentication backend
        from django.contrib.auth import authenticate
        
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(request=self.context.get('request'),
                              username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            
            # Set the user for token generation
            self.user = user
            
            # Generate tokens
            refresh = self.get_token(user)
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'role': user.role
                }
            }
            
            return data
        else:
            raise serializers.ValidationError('Must include username and password')
