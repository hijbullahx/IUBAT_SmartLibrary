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

# Import static view function
def serve_react_static(request, path):
    """Serve React static files directly"""
    from django.http import HttpResponse, Http404
    import os
    import mimetypes
    
    try:
        # Build the full path to the React static file
        static_file_path = os.path.join(
            settings.BASE_DIR, 
            '..', 
            'frontend', 
            'build', 
            'static',
            path
        )
        
        # Normalize the path
        static_file_path = os.path.normpath(static_file_path)
        
        # Check if file exists
        if not os.path.exists(static_file_path):
            raise Http404("Static file not found")
            
        # Determine content type
        content_type, _ = mimetypes.guess_type(static_file_path)
        if not content_type:
            content_type = 'application/octet-stream'
            
        # Read and return the file
        with open(static_file_path, 'rb') as f:
            content = f.read()
            
        response = HttpResponse(content, content_type=content_type)
        
        # Add caching headers
        response['Cache-Control'] = 'public, max-age=31536000'  # 1 year
        
        return response
        
    except Exception as e:
        raise Http404(f"Static file error: {str(e)}")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')),
    # Direct React static file serving
    re_path(r'^static/(?P<path>.*)$', serve_react_static, name='react_static'),
    # Serve manifest.json at root level
    path('manifest.json', TemplateView.as_view(template_name='manifest.json', content_type='application/json'), name='manifest'),
    path('robots.txt', TemplateView.as_view(template_name='robots.txt', content_type='text/plain'), name='robots'),
]

# Add static files handling
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # Force static file serving in production (for Render deployment)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Catch specific routes only (not static files or API routes) and serve React app - this must be LAST
urlpatterns += [
    re_path(r'^(?!static/|api/|admin/).*$', TemplateView.as_view(template_name='index.html'), name='frontend'),
]
