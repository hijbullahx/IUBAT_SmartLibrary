from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    """Root API endpoint"""
    return JsonResponse({
        'message': 'IUBAT Smart Library API',
        'status': 'running',
        'documentation': '/api/status/',
        'admin': '/admin/',
        'version': '1.0.0'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')),
    # Serve manifest.json at root level
    path('manifest.json', TemplateView.as_view(template_name='manifest.json', content_type='application/json'), name='manifest'),
    path('robots.txt', TemplateView.as_view(template_name='robots.txt', content_type='text/plain'), name='robots'),
]

# Add static files handling for ALL environments (development and production)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Catch specific routes only (not static files or API routes) and serve React app - this must be LAST
urlpatterns += [
    re_path(r'^(?!static/|api/|admin/).*$', TemplateView.as_view(template_name='index.html'), name='frontend'),
]
