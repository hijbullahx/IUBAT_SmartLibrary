"""
Quick script to run the Django WSGI application using wsgiref for LAN testing.
Run: python serve_wsgiref.py
"""
import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_automation.settings')

def run():
    import django
    django.setup()
    from django.core.wsgi import get_wsgi_application
    from wsgiref.simple_server import make_server

    application = get_wsgi_application()
    host = '0.0.0.0'
    port = 8000
    print(f'Serving Django via wsgiref on http://{host}:{port}/')
    server = make_server(host, port, application)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('Shutting down')

if __name__ == '__main__':
    run()
