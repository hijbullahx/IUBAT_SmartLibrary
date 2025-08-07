import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_automation.settings')

# Import the WSGI application
from library_automation.wsgi import application

# Vercel expects the WSGI app to be named 'app'
app = application
