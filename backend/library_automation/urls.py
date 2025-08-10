from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse
from django.views.generic import TemplateView
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

class ReactAppView(TemplateView):
    def get(self, request, *args, **kwargs):
        try:
            print(f"🔍 ReactAppView called for path: {request.path}")
            print(f"🔍 BASE_DIR: {settings.BASE_DIR}")
            print(f"🔍 STATIC_ROOT: {settings.STATIC_ROOT}")
            
            # Try multiple possible locations for index.html
            possible_paths = [
                os.path.join(settings.STATIC_ROOT, 'index.html'),  # After collectstatic
                os.path.join(settings.BASE_DIR, 'static', 'index.html'),  # Direct location
                os.path.join(settings.BASE_DIR, 'staticfiles', 'index.html'),  # Collectstatic output
            ]
            
            for index_path in possible_paths:
                print(f"🔍 Checking path: {index_path} (exists: {os.path.exists(index_path)})")
                if os.path.exists(index_path):
                    with open(index_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    print(f"✅ Serving React app from: {index_path}")
                    print(f"🔍 Content length: {len(content)} characters")
                    print(f"🔍 Content preview: {content[:200]}...")
                    return HttpResponse(content, content_type='text/html')
            
            # Debug: Print what paths were checked and directory contents
            print(f"❌ React index.html not found. Checked paths:")
            for path in possible_paths:
                print(f"  - {path} (exists: {os.path.exists(path)})")
                
                # Try to list directory contents if the parent directory exists
                parent_dir = os.path.dirname(path)
                if os.path.exists(parent_dir):
                    try:
                        files = os.listdir(parent_dir)
                        print(f"    Parent directory contents: {files[:10]}...")  # Show first 10 files
                    except Exception as e:
                        print(f"    Error listing directory: {e}")
            
            # Fallback to API root if React build not found
            return api_root(request)
        except Exception as e:
            print(f"❌ Error serving React app: {e}")
            import traceback
            traceback.print_exc()
            return api_root(request)

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
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')),
    path('api-info/', api_root, name='api_root'),  # API info moved to /api-info/
    path('debug-info/', debug_info, name='debug_info'),  # Debug endpoint
    path('test-react/', ReactAppView.as_view(), name='test_react'),  # Test endpoint
    
    # React App - catch all other routes except API and admin
    re_path(r'^(?!api/|admin/|debug-info/).*$', ReactAppView.as_view(), name='react_app'),
]

# Serve static files
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
