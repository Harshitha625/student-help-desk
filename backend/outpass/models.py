from django.db import models
from django.conf import settings

class Outpass(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Application Submitted'),
        ('Parent Verification', 'Parent Verification'),
        ('Warden Review', 'Warden Review'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Completed', 'Completed'),
    ]

    VERIFICATION_CHOICES = [
        ('Pending', 'Pending Verification'),
        ('Verified', 'Parent Verified'),
        ('Failed', 'Verification Failed'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='outpasses'
    )
    destination = models.CharField(max_length=255)
    reason = models.TextField()
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()

    parent_name = models.CharField(max_length=150)
    parent_contact = models.CharField(max_length=20)
    emergency_contact = models.CharField(max_length=20)
    notes = models.TextField(blank=True, default='')

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    verification_status = models.CharField(max_length=30, choices=VERIFICATION_CHOICES, default='Pending')
    verification_notes = models.TextField(blank=True, default='')

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='reviewed_outpasses'
    )
    reviewer_remarks = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Outpass #{self.id} for {self.student.get_full_name() or self.student.username} to {self.destination} ({self.status})"
