from rest_framework import serializers
from .models import Complaint, ComplaintComment


class ComplaintCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = ComplaintComment
        fields = [
            'id',
            'complaint',
            'user',
            'user_name',
            'user_role',
            'comment',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class ComplaintSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_roll = serializers.SerializerMethodField()
    comments = ComplaintCommentSerializer(many=True, read_only=True)
    comments_count = serializers.IntegerField(
        source='comments.count',
        read_only=True
    )

    class Meta:
        model = Complaint
        fields = [
            'id',
            'student',
            'student_name',
            'student_roll',
            'title',
            'category',
            'description',
            'priority',
            'status',
            'attachment',
            'anonymous',
            'location',
            'assigned_to',
            'admin_response',
            'created_at',
            'updated_at',
            'resolved_at',
            'comments',
            'comments_count'
        ]

        read_only_fields = [
            'id',
            'student',
            'status',
            'admin_response',
            'assigned_to',
            'created_at',
            'updated_at',
            'resolved_at',
            'comments',
            'comments_count'
        ]

    def get_student_name(self, obj):
        request = self.context.get('request')

        if obj.anonymous:
            if request and request.user == obj.student:
                return obj.student.get_full_name() or obj.student.username
            return "Anonymous Student"

        return obj.student.get_full_name() or obj.student.username

    def get_student_roll(self, obj):
        if obj.anonymous:
            request = self.context.get('request')

            if not request or request.user != obj.student:
                return "Hidden"

        if hasattr(obj.student, 'student_profile'):
            return obj.student.student_profile.roll_number

        return ""


class ComplaintCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            'title',
            'category',
            'description',
            'priority',
            'attachment',
            'anonymous',
            'location'
        ]


class ComplaintStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            'status',
            'assigned_to',
            'admin_response'
        ]