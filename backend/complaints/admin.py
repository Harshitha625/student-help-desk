from django.contrib import admin
from .models import Complaint, ComplaintComment

class ComplaintCommentInline(admin.TabularInline):
    model = ComplaintComment
    extra = 1
    readonly_fields = ('created_at',)

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'student', 'category', 'priority', 'status', 'location', 'assigned_to', 'created_at', 'resolved_at')
    list_filter = ('status', 'priority', 'category', 'anonymous', 'created_at')
    search_fields = ('title', 'description', 'location', 'student__username', 'student__first_name', 'student__last_name', 'assigned_to')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ComplaintCommentInline]


@admin.register(ComplaintComment)
class ComplaintCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'complaint', 'user', 'comment', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('comment', 'user__username', 'complaint__title')
    ordering = ('-created_at',)
