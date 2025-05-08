# stage 1, svelteKit frontend
FROM node:20-slim AS svelte-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY frontend .
RUN pnpm run build 

# stage 2, Flask + static files
FROM python:3.11-slim

# python safety flags
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend source
COPY . .

# bring in the compiled frontend
COPY --from=svelte-builder /app/frontend/build ./frontend_build
ENV STATIC_DIR=/app/frontend_build

# Koyeb sets $PORT automatically (falls back to 8080 locally) :contentReference[oaicite:0]{index=0}
ENV PORT 8080
EXPOSE 8080

CMD ["sh", "-c", "gunicorn app:app --workers 4 --threads 2 --bind 0.0.0.0:${PORT}"]
