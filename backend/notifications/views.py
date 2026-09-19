from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Notification
from .serializers import NotificationSerializer, BroadcastNotificationSerializer
from accounts.permissions import IsAdminUserRole

User = get_user_model()


class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user)
        unread_count = notifications.filter(is_read=False).count()

        only_unread = request.query_params.get('unread')

        if only_unread == 'true':
            notifications = notifications.filter(is_read=False)

        serializer = NotificationSerializer(
            notifications[:50],
            many=True
        )

        return Response({
            'unread_count': unread_count,
            'notifications': serializer.data
        })


class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        notification = get_object_or_404(
            Notification,
            pk=pk,
            recipient=request.user
        )

        notification.is_read = True
        notification.save()

        return Response({
            'message': 'Notification marked as read.',
            'id': notification.id
        })


class MarkAllNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated_count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({
            'message': f'{updated_count} notifications marked as read.'
        })


class DeleteNotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        notification = get_object_or_404(
            Notification,
            pk=pk,
            recipient=request.user
        )

        notification.delete()

        return Response(
            {
                'message': 'Notification deleted successfully.',
                'id': pk
            },
            status=status.HTTP_200_OK
        )


class BroadcastNotificationView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsAdminUserRole
    ]

    def post(self, request):
        serializer = BroadcastNotificationSerializer(
            data=request.data
        )

        if serializer.is_valid():
            title = serializer.validated_data['title']
            message = serializer.validated_data['message']
            target_role = serializer.validated_data['target_role']

            users = User.objects.filter(is_active=True)

            if target_role == 'STUDENT':
                users = users.filter(role='STUDENT')

            elif target_role == 'WARDEN':
                users = users.filter(role='WARDEN')

            notifications = [
                Notification(
                    recipient=user,
                    title=title,
                    message=message,
                    notification_type='BROADCAST',
                    reference_url='/notifications'
                )
                for user in users
            ]

            Notification.objects.bulk_create(notifications)

            return Response(
                {
                    'message': (
                        f'Broadcast sent successfully to '
                        f'{len(notifications)} users.'
                    )
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )