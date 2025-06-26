set dotenv-load

target := if env("MODE") == "prod" { "docker-compose.prod.yaml" } else { "docker-compose.dev.yaml" }
docker_flags  := if env("MODE") == "prod" { "-d" } else { "--watch" }

venv := if os_family() == "windows" { ".venv/Scripts" } else { ".venv/bin" }
python := if os_family() == "windows" { "/python.exe" } else { "/python3" }

backend_venv := "backend" / venv
backend_python := backend_venv + python

@_default:
    just --list

docker-up:
    docker compose -f {{ target }} up {{ docker_flags }} --build

docker-stop:
    docker compose -f {{ target }} stop

docker-down:
    docker compose -f {{ target }} down -v

backend-deps:
    cd backend && uv sync

pre-commit-backend: backend-deps
    {{ backend_venv }}/pre-commit run --all-files

backend-dev: backend-deps
    {{ backend_venv }}/fastapi dev backend/earlycareers/main.py
