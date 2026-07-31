#!/bin/bash
# scripts/bootstrap_databases.sh
# Relational Database Bootstrapper and Schema Upgrade script

set -e # Exit immediately if any command returns a non-zero status

echo "Starting SentinelOS database bootstrap pipeline..."

# Ensure we are in the project root
cd "$(dirname "$0")/.."

# 1. Export database environment configurations (adjust if you changed .env)
export PGPASSWORD=${PGPASSWORD}

# 2. Wait for PostgreSQL service port to accept connections (skips if pg_isready not installed locally)
if command -v pg_isready &> /dev/null; then
    echo "Waiting for PostgreSQL service port at 5433..."
    until pg_isready -h "localhost" -p 5433 -U "sentinel_user"; do
      sleep 1
    done
    echo "PostgreSQL database engine is online."
else
    echo "pg_isready not found on host, waiting a few seconds for DB to be ready..."
    sleep 3
fi

# Activate virtual environment so `alembic` is available
source venv/bin/activate

# Ensure Python can resolve 'backend' as a package when inside the backend folder
export PYTHONPATH="$(pwd)"

# 3. Change directory to API codebase target folder
cd backend

# 4. Generate the initial database migration script
echo "Checking and generating database migration revisions..."
alembic revision --autogenerate -m "Bootstrap initial schemas" || echo "No schema changes detected."

# 5. Apply migrations to upgrade the database schema
echo "Applying database schema upgrades..."
alembic upgrade head

echo "Relational database bootstrap pipeline complete."
