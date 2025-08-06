#!/bin/bash

# Navigate into the frontend directory
cd frontend

# Install frontend dependencies and build the app
npm install
npm run build

# Navigate back to the root
cd ..

# Run Django's collectstatic command
python manage.py collectstatic --noinput
