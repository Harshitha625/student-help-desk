from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Q
from django.contrib.auth import get_user_model

from complaints.models import Complaint
from outpass.models import Outpass

from accounts.permissions import IsAdminUserRole
from accounts.serializers import UserSerializer
from complaints.serializers import ComplaintSerializer
from outpass.serializers import OutpassSerializer


User = get_user_model()


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        total_students = User.objects.filter(role='STUDENT').count()
        total_wardens = User.objects.filter(role='WARDEN').count()

        total_complaints = Complaint.objects.count()

        active_complaints = Complaint.objects.filter(
            status__in=['Pending', 'Assigned', 'In Progress']
        ).count()

        resolved_complaints = Complaint.objects.filter(
            status='Resolved'
        ).count()

        urgent_complaints = Complaint.objects.filter(
            priority='Urgent',
            status__in=['Pending', 'Assigned', 'In Progress']
        ).count()

        total_outpasses = Outpass.objects.count()

        pending_outpasses = Outpass.objects.filter(
            status__in=[
                'Pending',
                'Parent Verification',
                'Warden Review'
            ]
        ).count()

        approved_outpasses = Outpass.objects.filter(
            status='Approved'
        ).count()

        # Complaint category counts
        categories = (
            Complaint.objects
            .values('category')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Complaint status counts
        statuses = (
            Complaint.objects
            .values('status')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Complaint priority counts
        priorities = (
            Complaint.objects
            .values('priority')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Outpass status counts
        outpass_statuses = (
            Outpass.objects
            .values('status')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Recent complaints
        recent_complaints = (
            Complaint.objects
            .select_related(
                'student',
                'student__student_profile'
            )
            .order_by('-created_at')[:6]
        )

        # Recent outpasses
        recent_outpasses = (
            Outpass.objects
            .select_related(
                'student',
                'student__student_profile',
                'reviewed_by'
            )
            .order_by('-created_at')[:6]
        )

        resolution_rate = 0

        if total_complaints > 0:
            resolution_rate = round(
                (resolved_complaints / total_complaints) * 100,
                1
            )

        return Response({
            'overview': {
                'total_students': total_students,
                'total_wardens': total_wardens,
                'total_complaints': total_complaints,
                'active_complaints': active_complaints,
                'resolved_complaints': resolved_complaints,
                'urgent_complaints': urgent_complaints,
                'total_outpasses': total_outpasses,
                'pending_outpasses': pending_outpasses,
                'approved_outpasses': approved_outpasses,
                'resolution_rate': resolution_rate,
            },

            'categories': list(categories),
            'statuses': list(statuses),
            'priorities': list(priorities),
            'outpass_statuses': list(outpass_statuses),

            'recent_complaints': ComplaintSerializer(
                recent_complaints,
                many=True,
                context={'request': request}
            ).data,

            'recent_outpasses': OutpassSerializer(
                recent_outpasses,
                many=True,
                context={'request': request}
            ).data,
        })


class AdminReportsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        category_breakdown = (
            Complaint.objects
            .values('category')
            .annotate(
                total=Count('id'),
                resolved=Count(
                    'id',
                    filter=Q(status='Resolved')
                ),
                pending=Count(
                    'id',
                    filter=Q(
                        status__in=[
                            'Pending',
                            'Assigned',
                            'In Progress'
                        ]
                    )
                )
            )
            .order_by('-total')
        )

        hostel_complaints = (
            Complaint.objects
            .filter(
                student__student_profile__hostel__gt=''
            )
            .values(
                'student__student_profile__hostel'
            )
            .annotate(
                count=Count('id')
            )
            .order_by('-count')[:8]
        )

        return Response({
            'category_breakdown': list(category_breakdown),

            'hostel_breakdown': [
                {
                    'hostel': (
                        item['student__student_profile__hostel']
                        or 'Unassigned'
                    ),
                    'count': item['count']
                }
                for item in hostel_complaints
            ]
        })


class AdminStudentsView(APIView):
    """
    Returns the student registry for the Admin frontend.
    """

    permission_classes = [
        permissions.IsAuthenticated,
        IsAdminUserRole
    ]

    def get(self, request):
        search = request.query_params.get(
            'search',
            ''
        ).strip()

        students = (
            User.objects
            .filter(role='STUDENT')
            .select_related('student_profile')
            .order_by('-date_joined')
        )

        if search:
            students = students.filter(
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(
                    student_profile__roll_number__icontains=search
                ) |
                Q(
                    student_profile__department__icontains=search
                ) |
                Q(
                    student_profile__hostel__icontains=search
                ) |
                Q(
                    student_profile__room_number__icontains=search
                )
            )

        serializer = UserSerializer(
            students,
            many=True
        )

        return Response(serializer.data)