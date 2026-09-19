from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Complaint

User = get_user_model()

class ComplaintsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(username='stu1', password='password123', role='STUDENT')
        self.warden = User.objects.create_user(username='war1', password='password123', role='WARDEN')
        self.client.force_authenticate(user=self.student)

    def test_create_complaint(self):
        data = {
            'title': 'Leaking Tap',
            'category': 'Plumbing',
            'description': 'Continuous dripping in bathroom',
            'priority': 'Medium',
            'location': 'Block B, 201'
        }
        response = self.client.post('/api/complaints/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Leaking Tap')
        self.assertEqual(response.data['status'], 'Pending')

    def test_warden_status_update(self):
        complaint = Complaint.objects.create(
            student=self.student,
            title='Fan noisy',
            category='Electrical',
            description='Motor squeaking',
            priority='Low',
            location='Block B, 201'
        )
        self.client.force_authenticate(user=self.warden)
        res = self.client.post(f'/api/complaints/{complaint.id}/update_status/', {
            'status': 'In Progress',
            'assigned_to': 'Electrician Sam',
            'admin_response': 'Inspection scheduled'
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        complaint.refresh_from_db()
        self.assertEqual(complaint.status, 'In Progress')
        self.assertEqual(complaint.assigned_to, 'Electrician Sam')
