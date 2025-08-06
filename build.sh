#!/bin/bash

# Navigate into the frontend directory
cd frontend

# Install frontend dependencies and build the app
npm install
npm run build

# Navigate back to the root
cd ..

# Install Python dependencies from requirements.txt
pip3 install -r requirements.txt
