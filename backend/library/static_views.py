from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
import os
import mimetypes
from django.conf import settings

@csrf_exempt  
def serve_react_static(request, path):
    """Serve React static files directly"""
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
