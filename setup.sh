#!/bin/bash
# This script sets up the development environment for the project.

cd backend
python -m venv venv
pip install -r requirements.txt

cd ../frontend
nvm install 22
nvm use 22
npx sv create
npm install -D tailwindcss postcss autoprefixer flowbite-svelte
# npx tailwindcss init
