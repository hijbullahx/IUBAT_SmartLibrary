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
            # Serve the React index.html file
            index_path = os.path.join(settings.STATIC_ROOT, 'index.html')
            if os.path.exists(index_path):
                with open(index_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return HttpResponse(content, content_type='text/html')
            else:
                # Fallback to API root if React build not found
                return api_root(request)
        except Exception as e:
            print(f"Error serving React app: {e}")
            return api_root(request)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')),
    path('api-info/', api_root, name='api_root'),  # API info moved to /api-info/
    
    # React App - catch all other routes except API and admin
    re_path(r'^(?!api/|admin/).*$', ReactAppView.as_view(), name='react_app'),
]

# Serve static files
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
