from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from django.views.generic import TemplateView
from django.urls import include
from library import views as library_views
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
import os

def api_root(request):
    """Root API endpoint"""
    return JsonResponse({
        'message': 'IUBAT Smart Library API',
        'status': 'running',
        'documentation': '/api/status/',
        'admin': '/admin/',
        'version': '1.0.0'
    })

# We now serve a server-rendered MVT frontend (Bootstrap) instead of React.

def debug_info(request):
    """Debug endpoint to check system state"""
    import os
    return JsonResponse({
        'message': 'Debug Info',
        'base_dir': settings.BASE_DIR,
        'static_root': settings.STATIC_ROOT,
        'static_url': settings.STATIC_URL,
        'debug': settings.DEBUG,
        'files_in_static_root': os.listdir(settings.STATIC_ROOT) if os.path.exists(settings.STATIC_ROOT) else 'Not found',
        'files_in_static_js': os.listdir(os.path.join(settings.STATIC_ROOT, 'static', 'js')) if os.path.exists(os.path.join(settings.STATIC_ROOT, 'static', 'js')) else 'Not found',
        'index_html_exists': os.path.exists(os.path.join(settings.STATIC_ROOT, 'index.html')),
        'index_html_size': os.path.getsize(os.path.join(settings.STATIC_ROOT, 'index.html')) if os.path.exists(os.path.join(settings.STATIC_ROOT, 'index.html')) else 'Not found',
    })

urlpatterns = [
    # Make the site root point to the library entry monitor (served at /library/)
    path('', RedirectView.as_view(url='/library/', permanent=False), name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')),
    # MVT-based Bootstrap frontend for migration/testing
    path('library/', TemplateView.as_view(template_name='library/index.html'), name='library_home'),
    path('library/mvt/', TemplateView.as_view(template_name='library/index.html'), name='library_mvt'),
    path('library/admin/', library_views.admin_dashboard_page, name='library_admin'),
    path('api-info/', api_root, name='api_root'),  # API info moved to /api-info/
    path('debug-info/', debug_info, name='debug_info'),  # Debug endpoint
]

# Serve static files FIRST - this is critical (STATIC_URL now points to /library/static/)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
