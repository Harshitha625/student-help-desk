import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from accounts.models import StudentProfile
from complaints.models import Complaint, ComplaintComment
from outpass.models import Outpass
from notifications.models import Notification

User = get_user_model()

def run():
    print("Seeding database with realistic campus data...")

    # 1. Admin User
    admin_user, created = User.objects.get_or_create(username='admin', defaults={
        'email': 'admin@helpdesk.campus.edu',
        'first_name': 'Chief',
        'last_name': 'Administrator',
        'role': 'ADMIN',
        'phone': '+91 94400 11223',
        'is_staff': True,
        'is_superuser': True,
    })
    admin_user.set_password('admin123')
    admin_user.role = 'ADMIN'
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    Token.objects.get_or_create(user=admin_user)
    print("Admin user created: admin / admin123")

    # 2. Warden User
    warden_user, created = User.objects.get_or_create(username='warden_kumar', defaults={
        'email': 'warden.kumar@campus.edu',
        'first_name': 'Dr. Suresh',
        'last_name': 'Kumar',
        'role': 'WARDEN',
        'phone': '+91 98800 33445',
        'is_staff': True,
    })
    warden_user.set_password('warden123')
    warden_user.role = 'WARDEN'
    warden_user.is_staff = True
    warden_user.save()
    Token.objects.get_or_create(user=warden_user)
    print("Warden user created: warden_kumar / warden123")

    # 3. Student 1: Harshitha
    s1, _ = User.objects.get_or_create(username='harshitha', defaults={
        'email': 'harshitha@student.campus.edu',
        'first_name': 'Harshitha',
        'last_name': 'Rao',
        'role': 'STUDENT',
        'phone': '+91 98765 43210',
    })
    s1.set_password('student123')
    s1.role = 'STUDENT'
    s1.save()
    Token.objects.get_or_create(user=s1)

    p1, _ = StudentProfile.objects.get_or_create(user=s1)
    p1.roll_number = '21CS042'
    p1.department = 'Computer Science & Engineering'
    p1.hostel = 'Cauvery Hostel (Block B)'
    p1.room_number = 'B-304'
    p1.phone = '+91 98765 43210'
    p1.guardian_name = 'K. Ramesh Rao'
    p1.guardian_phone = '+91 94488 77665'
    p1.save()
    print("Student user created: harshitha / student123")

    # 4. Student 2: Arjun Reddy
    s2, _ = User.objects.get_or_create(username='arjun_reddy', defaults={
        'email': 'arjun.reddy@student.campus.edu',
        'first_name': 'Arjun',
        'last_name': 'Reddy',
        'role': 'STUDENT',
        'phone': '+91 97711 22334',
    })
    s2.set_password('student123')
    s2.role = 'STUDENT'
    s2.save()
    Token.objects.get_or_create(user=s2)

    p2, _ = StudentProfile.objects.get_or_create(user=s2)
    p2.roll_number = '21EC015'
    p2.department = 'Electronics & Communication'
    p2.hostel = 'Krishna Hostel (Block A)'
    p2.room_number = 'A-112'
    p2.phone = '+91 97711 22334'
    p2.guardian_name = 'V. Pratap Reddy'
    p2.guardian_phone = '+91 94455 66778'
    p2.save()

    # 5. Student 3: Priya Sharma
    s3, _ = User.objects.get_or_create(username='priya_sharma', defaults={
        'email': 'priya.sharma@student.campus.edu',
        'first_name': 'Priya',
        'last_name': 'Sharma',
        'role': 'STUDENT',
        'phone': '+91 96622 33445',
    })
    s3.set_password('student123')
    s3.role = 'STUDENT'
    s3.save()
    Token.objects.get_or_create(user=s3)

    p3, _ = StudentProfile.objects.get_or_create(user=s3)
    p3.roll_number = '22ME088'
    p3.department = 'Mechanical Engineering'
    p3.hostel = 'Ganga Hostel (Block C)'
    p3.room_number = 'C-205'
    p3.phone = '+91 96622 33445'
    p3.guardian_name = 'Sunil Sharma'
    p3.guardian_phone = '+91 93311 22334'
    p3.save()

    # Complaints
    c1, _ = Complaint.objects.get_or_create(
        student=s1,
        title='Water pipe leakage in Room B-304 washroom',
        defaults={
            'category': 'Plumbing',
            'description': 'The pipe under the washbasin in room B-304 has developed a persistent leak. Water pools on the tile floor continuously, creating a slipping hazard.',
            'priority': 'High',
            'status': 'In Progress',
            'location': 'Block B, 3rd Floor, Room B-304',
            'assigned_to': 'Plumber Ramesh (Campus Maintenance)',
            'admin_response': 'Work order issued. Plumber will visit today afternoon at 3:00 PM with replacement washer joints.',
            'anonymous': False
        }
    )
    ComplaintComment.objects.get_or_create(
        complaint=c1,
        user=s1,
        comment="Please ensure maintenance comes before 5 PM as we have lab classes later."
    )
    ComplaintComment.objects.get_or_create(
        complaint=c1,
        user=warden_user,
        comment="Technician Ramesh has been notified to attend to this by 3:30 PM."
    )

    c2, _ = Complaint.objects.get_or_create(
        student=s1,
        title='Wi-Fi access point intermittently dropping connections',
        defaults={
            'category': 'Internet/Wi-Fi',
            'description': 'The Cisco Wi-Fi router on Block B 3rd floor hallway drops signals every 10 minutes, disconnecting during online quizzes and lectures.',
            'priority': 'Urgent',
            'status': 'Assigned',
            'location': 'Cauvery Hostel Block B, 3rd Floor Corridor',
            'assigned_to': 'Network Operations Team',
            'admin_response': 'Firmware patch scheduled for reboot window at 6:00 PM.',
            'anonymous': False
        }
    )

    c3, _ = Complaint.objects.get_or_create(
        student=s1,
        title='Mess dinner quality inspection request',
        defaults={
            'category': 'Mess/Food',
            'description': 'The chapati and dal served on Tuesday night were undercooked and cold. Multiple students felt unwell.',
            'priority': 'Medium',
            'status': 'Resolved',
            'location': 'Central Dining Hall 2',
            'assigned_to': 'Mess Warden Committee',
            'admin_response': 'Mess committee conducted an on-site audit of the kitchen. Replaced the flour vendor batch and warned the head cook. Quality checks will be performed daily.',
            'resolved_at': timezone.now() - timedelta(days=1),
            'anonymous': True
        }
    )

    c4, _ = Complaint.objects.get_or_create(
        student=s2,
        title='Room ceiling fan regulator jammed on high speed',
        defaults={
            'category': 'Electrical',
            'description': 'The speed regulator switch is broken and cannot be turned down from maximum.',
            'priority': 'Low',
            'status': 'Pending',
            'location': 'Krishna Hostel Block A, Room 112',
            'assigned_to': '',
            'anonymous': False
        }
    )

    c5, _ = Complaint.objects.get_or_create(
        student=s3,
        title='Library 2nd Floor reading room air conditioning failure',
        defaults={
            'category': 'Infrastructure',
            'description': 'Central AC compressor in the north wing reading room stopped functioning during exam preparation hours.',
            'priority': 'Medium',
            'status': 'Resolved',
            'location': 'Central Library, 2nd Floor North Wing',
            'assigned_to': 'HVAC Engineering Division',
            'admin_response': 'Coolant refilled and compressor motor fan repaired.',
            'resolved_at': timezone.now() - timedelta(days=3),
            'anonymous': False
        }
    )

    # Outpasses
    now = timezone.now()
    o1, _ = Outpass.objects.get_or_create(
        student=s1,
        destination='Bangalore (Home)',
        defaults={
            'reason': "Attending my elder sister's wedding ceremony and related family functions over the long weekend.",
            'from_date': now + timedelta(days=1),
            'to_date': now + timedelta(days=4),
            'parent_name': 'K. Ramesh Rao',
            'parent_contact': '+91 94488 77665',
            'emergency_contact': '+91 98765 43210',
            'notes': 'Traveling via KSRTC Airavat Club Class bus. Ticket attached in records.',
            'status': 'Parent Verification',
            'verification_status': 'Pending',
            'verification_notes': 'Pending call with father Mr. Ramesh Rao.',
        }
    )

    o2, _ = Outpass.objects.get_or_create(
        student=s1,
        destination='Mysore (NIE Campus)',
        defaults={
            'reason': 'Representing college at the State Inter-Collegiate Hackathon at National Institute of Engineering, Mysore.',
            'from_date': now - timedelta(days=5),
            'to_date': now - timedelta(days=3),
            'parent_name': 'K. Ramesh Rao',
            'parent_contact': '+91 94488 77665',
            'emergency_contact': '+91 98765 43210',
            'notes': 'Faculty coordinator Dr. Sharma has forwarded permission letter.',
            'status': 'Approved',
            'verification_status': 'Verified',
            'verification_notes': 'Spoke with father Mr. Ramesh Rao at 10:15 AM. Verified hackathon details.',
            'reviewed_by': warden_user,
            'reviewer_remarks': 'Approved. Best wishes for the hackathon competition. Return by Sunday 8 PM.',
        }
    )

    o3, _ = Outpass.objects.get_or_create(
        student=s2,
        destination='Hyderabad',
        defaults={
            'reason': 'Specialist dental appointment and orthodontic checkup at Apollo Hospital.',
            'from_date': now + timedelta(days=2),
            'to_date': now + timedelta(days=5),
            'parent_name': 'V. Pratap Reddy',
            'parent_contact': '+91 94455 66778',
            'emergency_contact': '+91 97711 22334',
            'notes': 'Hospital appointment confirmation slip shown.',
            'status': 'Warden Review',
            'verification_status': 'Verified',
            'verification_notes': 'Verified through parent phone call on 18th Sept.',
        }
    )

    # Notifications
    Notification.objects.get_or_create(
        recipient=s1,
        title='Welcome to Student HelpDesk',
        defaults={
            'message': 'Your campus service profile is active. You can now lodge complaints, track requests, and apply for hostel outpasses seamlessly.',
            'notification_type': 'BROADCAST',
            'reference_url': '/student',
            'is_read': True
        }
    )
    Notification.objects.get_or_create(
        recipient=s1,
        title='Complaint #1 Status: In Progress',
        defaults={
            'message': "Technician Ramesh has been assigned to attend to 'Water pipe leakage in Room B-304 washroom'.",
            'notification_type': 'COMPLAINT',
            'reference_id': c1.id,
            'reference_url': f'/complaints/{c1.id}',
            'is_read': False
        }
    )
    Notification.objects.get_or_create(
        recipient=s1,
        title='Outpass #2 Approved',
        defaults={
            'message': "Your outpass request to Mysore has been officially approved by Warden Dr. Suresh Kumar.",
            'notification_type': 'OUTPASS',
            'reference_id': o2.id,
            'reference_url': f'/outpasses/{o2.id}',
            'is_read': True
        }
    )
    Notification.objects.get_or_create(
        recipient=warden_user,
        title='Outpass Request Pending Verification',
        defaults={
            'message': "Harshitha Rao has submitted an outpass request to Bangalore (Home). Please perform parent verification.",
            'notification_type': 'OUTPASS',
            'reference_id': o1.id,
            'reference_url': '/warden/outpasses',
            'is_read': False
        }
    )

    print("Demo data seeded successfully!")

if __name__ == '__main__':
    run()
