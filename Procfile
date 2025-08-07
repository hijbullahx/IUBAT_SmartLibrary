web: cd backend && gunicorn library_automation.wsgi:application --bind 0.0.0.0:$PORT
release: cd backend && python manage.py migrate --noinput && python manage.py collectstatic --noinput
