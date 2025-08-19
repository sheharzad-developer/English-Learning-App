from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object to edit it."""
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user


class IsTeacherOrAdmin(permissions.BasePermission):
    """Custom permission to only allow teachers and admins."""
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role in ['teacher', 'admin']
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow admins to edit, but allow read access to authenticated users."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'admin'


class IsStudentOrTeacherOrAdmin(permissions.BasePermission):
    """Custom permission for authenticated users with valid roles."""
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role in ['student', 'teacher', 'admin']
        )