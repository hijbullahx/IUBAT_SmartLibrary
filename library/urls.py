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
]