from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Outpass
from .serializers import (
    OutpassSerializer,
    OutpassCreateSerializer,
    OutpassVerifyParentSerializer,
    OutpassReviewSerializer
)
from accounts.permissions import IsWarden
from notifications.utils import create_notification

User = get_user_model()

class OutpassViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return OutpassCreateSerializer
        return OutpassSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role in ['ADMIN', 'WARDEN']:
            queryset = Outpass.objects.all().select_related('student', 'student__student_profile', 'reviewed_by')
        else:
            queryset = Outpass.objects.filter(student=user).select_related('student', 'student__student_profile', 'reviewed_by')

        # Filters
        outpass_status = self.request.query_params.get('status')
        verification_status = self.request.query_params.get('verification_status')
        search = self.request.query_params.get('search')

        if outpass_status and outpass_status != 'All':
            queryset = queryset.filter(status=outpass_status)
        if verification_status and verification_status != 'All':
            queryset = queryset.filter(verification_status=verification_status)
        if search:
            queryset = queryset.filter(
                Q(destination__icontains=search) |
                Q(reason__icontains=search) |
                Q(student__username__icontains=search) |
                Q(student__first_name__icontains=search) |
                Q(student__last_name__icontains=search) |
                Q(parent_name__icontains=search)
            )

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        full_serializer = OutpassSerializer(serializer.instance, context={'request': request})
        return Response(full_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        outpass = serializer.save(student=self.request.user, status='Parent Verification')

        # Notify student
        create_notification(
            recipient=self.request.user,
            title=f"Outpass Application #{outpass.id} Submitted",
            message=f"Your outpass application to {outpass.destination} has been submitted. Next step: Parent Verification.",
            notification_type='OUTPASS',
            reference_id=outpass.id,
            reference_url=f"/outpasses/{outpass.id}"
        )

        # Notify active wardens
        wardens = User.objects.filter(role='WARDEN', is_active=True)
        for warden in wardens:
            create_notification(
                recipient=warden,
                title=f"New Outpass Request #{outpass.id}",
                message=f"Student {self.request.user.get_full_name() or self.request.user.username} requested outpass to {outpass.destination}. Parent verification required.",
                notification_type='OUTPASS',
                reference_id=outpass.id,
                reference_url=f"/warden/outpasses"
            )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsWarden])
    def verify_parent(self, request, pk=None):
        outpass = self.get_object()
        serializer = OutpassVerifyParentSerializer(data=request.data)
        if serializer.is_valid():
            v_status = serializer.validated_data['verification_status']
            v_notes = serializer.validated_data.get('verification_notes', '')

            outpass.verification_status = v_status
            outpass.verification_notes = v_notes

            if v_status == 'Verified':
                outpass.status = 'Warden Review'
            elif v_status == 'Failed':
                outpass.status = 'Rejected'
                outpass.reviewer_remarks = f"Parent verification failed: {v_notes}"
                outpass.reviewed_by = request.user

            outpass.save()

            # Trigger notification to student
            create_notification(
                recipient=outpass.student,
                title=f"Outpass #{outpass.id} Parent Verification: {v_status}",
                message=f"Parent verification status for outpass to {outpass.destination} is now '{v_status}'. {v_notes}",
                notification_type='VERIFICATION',
                reference_id=outpass.id,
                reference_url=f"/outpasses/{outpass.id}"
            )

            return Response(OutpassSerializer(outpass).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsWarden])
    def review(self, request, pk=None):
        outpass = self.get_object()
        serializer = OutpassReviewSerializer(data=request.data)
        if serializer.is_valid():
            decision = serializer.validated_data['status']
            remarks = serializer.validated_data.get('reviewer_remarks', '')

            outpass.status = decision
            outpass.reviewed_by = request.user
            outpass.reviewer_remarks = remarks
            outpass.save()

            # Trigger notification to student
            create_notification(
                recipient=outpass.student,
                title=f"Outpass #{outpass.id} {decision}",
                message=f"Your outpass to {outpass.destination} was {decision.lower()} by {request.user.get_full_name() or 'Warden'}. Remarks: {remarks or 'None'}",
                notification_type='OUTPASS',
                reference_id=outpass.id,
                reference_url=f"/outpasses/{outpass.id}"
            )

            return Response(OutpassSerializer(outpass).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsWarden])
    def complete(self, request, pk=None):
        outpass = self.get_object()
        outpass.status = 'Completed'
        outpass.save()

        create_notification(
            recipient=outpass.student,
            title=f"Outpass #{outpass.id} Marked Completed",
            message=f"Your return to campus has been logged. Outpass #{outpass.id} is now Completed.",
            notification_type='OUTPASS',
            reference_id=outpass.id,
            reference_url=f"/outpasses/{outpass.id}"
        )
        return Response(OutpassSerializer(outpass).data)
