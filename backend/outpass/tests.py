from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from rest_framework import status
from .models import Outpass

User = get_user_model()

class OutpassAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(username='stu2', password='password123', role='STUDENT')
        self.warden = User.objects.create_user(username='war2', password='password123', role='WARDEN')
        self.client.force_authenticate(user=self.student)

    def test_create_and_verify_outpass(self):
        now = timezone.now()
        data = {
            'destination': 'Hometown',
            'reason': 'Family visit',
            'from_date': (now + timedelta(days=1)).isoformat(),
            'to_date': (now + timedelta(days=3)).isoformat(),
            'parent_name': 'Parent Name',
            'parent_contact': '9876543210',
            'emergency_contact': '9876543210'
        }
        res = self.client.post('/api/outpasses/', data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        outpass_id = res.data['id']

        # Warden verifies parent
        self.client.force_authenticate(user=self.warden)
        res_verify = self.client.post(f'/api/outpasses/{outpass_id}/verify_parent/', {
            'verification_status': 'Verified',
            'verification_notes': 'Verified via telephone call.'
        })
        self.assertEqual(res_verify.status_code, status.HTTP_200_OK)

        # Warden approves
        res_review = self.client.post(f'/api/outpasses/{outpass_id}/review/', {
            'status': 'Approved',
            'reviewer_remarks': 'Approved by warden'
        })
        self.assertEqual(res_review.status_code, status.HTTP_200_OK)
        self.assertEqual(res_review.data['status'], 'Approved')
