# stage 1, sveltekit frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend .
RUN npm run build

# stage 2, python flask backend
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend source
COPY backend .

# bring in the compiled frontend
COPY --from=frontend-builder /app/frontend/build ./frontend_build
ENV STATIC_DIR=/app/frontend_build

ENV PORT 8080
EXPOSE 8080

CMD ["sh", "-c", "gunicorn app:app --workers 4 --threads 2 --bind 0.0.0.0:${PORT}"]