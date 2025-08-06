# library/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Main Library
    path('entry/library/', views.library_entry_exit, name='library_entry_exit'),
    # E-Library
    path('entry/elibrary/checkin/', views.elibrary_checkin, name='elibrary_checkin'),
    path('entry/elibrary/checkout/', views.elibrary_checkout, name='elibrary_checkout'),
    path('elibrary/pc_status/', views.pc_status, name='pc_status'),
    path('admin/export-data/', views.export_data, name='export_data'),
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/logout/', views.admin_logout, name='admin_logout'),
    path('admin/reports/time-based/', views.time_based_report, name='time_based_report'),
    path('admin/reports/student-based/', views.student_based_report, name='student_based_report'),
    # API Status
    path('status/', views.api_status, name='api_status'),
]
