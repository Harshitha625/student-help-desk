from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import User, StudentProfile
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UserProfileUpdateSerializer,
    ChangePasswordSerializer
)
from .permissions import IsAdminUserRole, IsWarden

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({
                'token': token.key,
                'user': user_data,
                'message': 'Student registration successful.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({
                'token': token.key,
                'user': user_data,
                'message': f'Welcome back, {user.first_name or user.username}!'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Profile updated successfully.'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': ['Incorrect current password.']}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsWarden]

    def get(self, request):
        query = request.query_params.get('search', '').strip()
        students = User.objects.filter(role='STUDENT').select_related('student_profile').order_by('-date_joined')

        if query:
            students = students.filter(
                Q(username__icontains=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(email__icontains=query) |
                Q(student_profile__roll_number__icontains=query) |
                Q(student_profile__hostel__icontains=query) |
                Q(student_profile__department__icontains=query)
            )

        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)


class UserToggleActiveView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUserRole]

    def post(self, request, pk):
        target_user = get_object_or_404(User, pk=pk)
        if target_user.is_superuser:
            return Response({'error': 'Cannot disable superuser.'}, status=status.HTTP_400_BAD_REQUEST)
        target_user.is_active = not target_user.is_active
        target_user.save()
        return Response({
            'id': target_user.id,
            'is_active': target_user.is_active,
            'message': f"User account {'activated' if target_user.is_active else 'deactivated'}."
        })
