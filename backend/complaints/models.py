from django.db import models
from django.conf import settings

class Complaint(models.Model):
    CATEGORY_CHOICES = [
        ('Hostel Maintenance', 'Hostel Maintenance'),
        ('Mess/Food', 'Mess/Food'),
        ('Electrical', 'Electrical'),
        ('Plumbing', 'Plumbing'),
        ('Internet/Wi-Fi', 'Internet/Wi-Fi'),
        ('Room/Furniture', 'Room/Furniture'),
        ('Academic', 'Academic'),
        ('Infrastructure', 'Infrastructure'),
        ('Other', 'Other'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Assigned', 'Assigned'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
        ('Rejected', 'Rejected'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='complaints'
    )
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    attachment = models.FileField(upload_to='complaints/%Y/%m/', blank=True, null=True)
    anonymous = models.BooleanField(default=False)
    location = models.CharField(max_length=200, help_text="e.g. Block B, Room 304 or Library 2nd Floor")
    assigned_to = models.CharField(max_length=150, blank=True, default='', help_text="Technician or Department Assigned")
    admin_response = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        prefix = "Anonymous" if self.anonymous else self.student.username
        return f"#{self.id} [{self.category}] {self.title} ({self.status}) - {prefix}"


class ComplaintComment(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment on #{self.complaint_id} by {self.user.username}"
