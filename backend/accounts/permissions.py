from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    """
    Allows access only to users whose application role is ADMIN.
    """

    def has_permission(self, request, view):
        return (
            bool(request.user and request.user.is_authenticated)
            and getattr(request.user, "role", None) == "ADMIN"
        )


class IsWarden(BasePermission):
    """
    Allows access only to users whose application role is WARDEN.
    """

    def has_permission(self, request, view):
        return (
            bool(request.user and request.user.is_authenticated)
            and getattr(request.user, "role", None) == "WARDEN"
        )


class IsStudentUserRole(BasePermission):
    """
    Allows access only to users whose application role is STUDENT.
    """

    def has_permission(self, request, view):
        return (
            bool(request.user and request.user.is_authenticated)
            and getattr(request.user, "role", None) == "STUDENT"
        )


class IsAdminOrWarden(BasePermission):
    """
    Allows access to ADMIN or WARDEN users.
    """

    def has_permission(self, request, view):
        return (
            bool(request.user and request.user.is_authenticated)
            and getattr(request.user, "role", None) in ["ADMIN", "WARDEN"]
        )