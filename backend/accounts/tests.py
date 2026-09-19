from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AccountsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_student_registration(self):
        data = {
            'username': 'newstudent',
            'email': 'newstudent@campus.edu',
            'password': 'password123',
            'confirm_password': 'password123',
            'first_name': 'New',
            'last_name': 'Student',
            'phone': '+91 9988776655',
            'roll_number': '23CS101',
            'department': 'Computer Science',
            'hostel': 'Block A',
            'room_number': '101'
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['role'], 'STUDENT')
        self.assertEqual(response.data['user']['student_profile']['roll_number'], '23CS101')

    def test_login_success_and_failure(self):
        User.objects.create_user(username='tester', password='secretpassword', role='STUDENT')
        
        # Valid login
        res_ok = self.client.post('/api/auth/login/', {'username': 'tester', 'password': 'secretpassword'})
        self.assertEqual(res_ok.status_code, status.HTTP_200_OK)
        self.assertIn('token', res_ok.data)

        # Invalid login
        res_err = self.client.post('/api/auth/login/', {'username': 'tester', 'password': 'wrongpassword'})
        self.assertEqual(res_err.status_code, status.HTTP_400_BAD_REQUEST)
