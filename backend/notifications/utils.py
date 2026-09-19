from .models import Notification

def create_notification(recipient, title, message, notification_type='SYSTEM', reference_id=None, reference_url=''):
    """Utility to create a notification for a user."""
    if not recipient:
        return None
    return Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        notification_type=notification_type,
        reference_id=reference_id,
        reference_url=reference_url
    )
