from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'is_read', 'reference_id', 'reference_url', 'created_at']
        read_only_fields = ['id', 'created_at']


class BroadcastNotificationSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    message = serializers.CharField()
    target_role = serializers.ChoiceField(choices=[('ALL', 'All Users'), ('STUDENT', 'All Students'), ('WARDEN', 'All Wardens')], default='ALL')
