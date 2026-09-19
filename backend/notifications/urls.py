from django.urls import path

from .views import (
    NotificationListView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
    DeleteNotificationView,
    BroadcastNotificationView,
)


urlpatterns = [
    path(
        '',
        NotificationListView.as_view(),
        name='notification_list'
    ),

    path(
        '<int:pk>/read/',
        MarkNotificationReadView.as_view(),
        name='mark_notification_read'
    ),

    path(
        'read-all/',
        MarkAllNotificationsReadView.as_view(),
        name='mark_all_notifications_read'
    ),

    path(
        '<int:pk>/delete/',
        DeleteNotificationView.as_view(),
        name='delete_notification'
    ),

    path(
        'broadcast/',
        BroadcastNotificationView.as_view(),
        name='broadcast_notification'
    ),
]