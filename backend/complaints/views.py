from django.db.models import Q
from django.utils import timezone

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Complaint, ComplaintComment
from .serializers import (
    ComplaintSerializer,
    ComplaintCreateSerializer,
    ComplaintStatusUpdateSerializer,
    ComplaintCommentSerializer
)

from accounts.permissions import IsWarden
from notifications.utils import create_notification


class ComplaintViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ComplaintCreateSerializer

        return ComplaintSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or user.role in ['ADMIN', 'WARDEN']:
            queryset = (
                Complaint.objects
                .all()
                .select_related(
                    'student',
                    'student__student_profile'
                )
                .prefetch_related('comments')
            )
        else:
            queryset = (
                Complaint.objects
                .filter(student=user)
                .select_related(
                    'student',
                    'student__student_profile'
                )
                .prefetch_related('comments')
            )

        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        complaint_status = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if category and category != 'All':
            queryset = queryset.filter(category=category)

        if priority and priority != 'All':
            queryset = queryset.filter(priority=priority)

        if complaint_status and complaint_status != 'All':
            queryset = queryset.filter(status=complaint_status)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(location__icontains=search)
                | Q(id__icontains=search)
            )

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)

        full_serializer = ComplaintSerializer(
            serializer.instance,
            context={'request': request}
        )

        return Response(
            full_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def perform_create(self, serializer):
        complaint = serializer.save(student=self.request.user)

        create_notification(
            recipient=self.request.user,
            title=f"Complaint #{complaint.id} Registered",
            message=(
                f"Your complaint '{complaint.title}' "
                f"({complaint.category}) has been submitted successfully "
                f"and is queued for review."
            ),
            notification_type='COMPLAINT',
            reference_id=complaint.id,
            reference_url=f"/complaints/{complaint.id}"
        )

    def update(self, request, *args, **kwargs):
        if request.user.role not in ['ADMIN', 'WARDEN']:
            return Response(
                {
                    'detail': (
                        'Students cannot directly update complaints.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.role not in ['ADMIN', 'WARDEN']:
            return Response(
                {
                    'detail': (
                        'Students cannot directly update complaints.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ['ADMIN', 'WARDEN']:
            return Response(
                {
                    'detail': (
                        'Students cannot delete complaints.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        return super().destroy(request, *args, **kwargs)

    @action(
        detail=True,
        methods=['post', 'patch'],
        permission_classes=[
            permissions.IsAuthenticated,
            IsWarden
        ]
    )
    def update_status(self, request, pk=None):
        complaint = self.get_object()

        serializer = ComplaintStatusUpdateSerializer(
            complaint,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            old_status = complaint.status
            new_status = serializer.validated_data.get(
                'status',
                old_status
            )

            if new_status == 'Resolved' and old_status != 'Resolved':
                complaint.resolved_at = timezone.now()

            serializer.save()

            admin_resp = serializer.validated_data.get(
                'admin_response',
                ''
            )

            notes_text = (
                f" Staff remarks: {admin_resp}"
                if admin_resp
                else ""
            )

            create_notification(
                recipient=complaint.student,
                title=f"Complaint #{complaint.id} Status: {new_status}",
                message=(
                    f"Your complaint '{complaint.title}' "
                    f"has been updated to '{new_status}'."
                    f"{notes_text}"
                ),
                notification_type='COMPLAINT',
                reference_id=complaint.id,
                reference_url=f"/complaints/{complaint.id}"
            )

            return Response(
                ComplaintSerializer(
                    complaint,
                    context={'request': request}
                ).data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(
        detail=True,
        methods=['get', 'post'],
        permission_classes=[permissions.IsAuthenticated]
    )
    def comments(self, request, pk=None):
        complaint = self.get_object()

        if request.method == 'GET':
            comments = (
                complaint.comments
                .all()
                .select_related('user')
            )

            serializer = ComplaintCommentSerializer(
                comments,
                many=True
            )

            return Response(serializer.data)

        comment_text = request.data.get(
            'comment',
            ''
        ).strip()

        if not comment_text:
            return Response(
                {
                    'comment': [
                        'Comment cannot be empty.'
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        comment = ComplaintComment.objects.create(
            complaint=complaint,
            user=request.user,
            comment=comment_text
        )

        if request.user != complaint.student:
            create_notification(
                recipient=complaint.student,
                title=f"New Remark on Complaint #{complaint.id}",
                message=(
                    f"{request.user.get_full_name() or request.user.username} "
                    f"({request.user.get_role_display()}) commented: "
                    f"'{comment_text[:80]}...'"
                ),
                notification_type='COMPLAINT',
                reference_id=complaint.id,
                reference_url=f"/complaints/{complaint.id}"
            )

        return Response(
            ComplaintCommentSerializer(comment).data,
            status=status.HTTP_201_CREATED
        )