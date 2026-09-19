from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('STUDENT', 'Student'),
        ('WARDEN', 'Warden'),
        ('ADMIN', 'Administrator'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    phone = models.CharField(max_length=20, blank=True, default='')

    def is_student(self):
        return self.role == 'STUDENT'

    def is_warden(self):
        return self.role == 'WARDEN'

    def is_admin_user(self):
        return self.role == 'ADMIN' or self.is_superuser or self.is_staff

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    roll_number = models.CharField(max_length=50, blank=True, default='')
    department = models.CharField(max_length=100, blank=True, default='')
    hostel = models.CharField(max_length=100, blank=True, default='')
    room_number = models.CharField(max_length=50, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    guardian_name = models.CharField(max_length=100, blank=True, default='')
    guardian_phone = models.CharField(max_length=20, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.roll_number or 'No Roll No'}"
