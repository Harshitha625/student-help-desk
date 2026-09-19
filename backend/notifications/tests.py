from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Notification

User = get_user_model()

class NotificationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='notifyuser', password='password123', role='STUDENT')
        self.client.force_authenticate(user=self.user)

    def test_notification_workflow(self):
        n1 = Notification.objects.create(recipient=self.user, title='Test Alert 1', message='Message 1')
        n2 = Notification.objects.create(recipient=self.user, title='Test Alert 2', message='Message 2')

        # List
        res = self.client.get('/api/notifications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['unread_count'], 2)

        # Mark 1 read
        res_read = self.client.post(f'/api/notifications/{n1.id}/read/')
        self.assertEqual(res_read.status_code, status.HTTP_200_OK)

        # Mark all read
        res_all = self.client.post('/api/notifications/read-all/')
        self.assertEqual(res_all.status_code, status.HTTP_200_OK)

        res_check = self.client.get('/api/notifications/')
        self.assertEqual(res_check.data['unread_count'], 0)
