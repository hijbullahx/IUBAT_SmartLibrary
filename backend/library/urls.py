from django.urls import path
from . import views

urlpatterns = [
    path('entry/library/', views.library_entry_exit, name='library_entry_exit'),
    path('entry/elibrary/checkin/', views.elibrary_checkin, name='elibrary_checkin'),
    path('entry/elibrary/checkout/', views.elibrary_checkout, name='elibrary_checkout'),
    path('elibrary/pc_status/', views.pc_status, name='pc_status'),
    path('elibrary/check_current_pc/<str:student_id>/', views.check_current_pc, name='check_current_pc'),
    path('admin/export-data/', views.export_data, name='export_data'),
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/logout/', views.admin_logout, name='admin_logout'),
    path('admin/reports/time-based/', views.time_based_report, name='time_based_report'),
    path('admin/reports/student-based/', views.student_based_report, name='student_based_report'),
    path('admin/reports/weekly/', views.weekly_report, name='weekly_report'),
    path('admin/reports/monthly/', views.monthly_report, name='monthly_report'),
    path('admin/reports/yearly/', views.yearly_report, name='yearly_report'),
    path('admin/reports/department-stats/', views.department_statistics, name='department_statistics'),
    path('admin/stats/live/', views.live_admin_stats, name='live_admin_stats'),
    path('admin/analytics/pc/', views.get_pc_analytics, name='get_pc_analytics'),
    path('admin/pc/toggle/', views.admin_toggle_pc_status, name='admin_toggle_pc_status'),
    path('status/', views.api_status, name='api_status'),
    path('students/<str:student_id>/', views.student_lookup, name='student_lookup'),
]