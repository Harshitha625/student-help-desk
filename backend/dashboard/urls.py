from django.urls import path
from .views import (
    AdminStatsView,
    AdminReportsView,
    AdminStudentsView,
)

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('reports/', AdminReportsView.as_view(), name='admin_reports'),
    path('students/', AdminStudentsView.as_view(), name='admin_students'),
]