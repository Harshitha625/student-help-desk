from django.contrib import admin
from .models import Outpass

@admin.register(Outpass)
class OutpassAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'student', 'destination', 'from_date', 'to_date',
        'parent_name', 'status', 'verification_status', 'reviewed_by', 'created_at'
    )
    list_filter = ('status', 'verification_status', 'created_at', 'from_date')
    search_fields = (
        'destination', 'reason', 'student__username', 'student__first_name',
        'student__last_name', 'parent_name', 'parent_contact'
    )
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
