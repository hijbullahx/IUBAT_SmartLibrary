# library_automation/urls.py
from django.contrib import admin
from django.urls import path, include # <-- Add 'include' here

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')), # <-- Add this line
]