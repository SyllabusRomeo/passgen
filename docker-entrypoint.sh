#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1 || npx prisma migrate status > /dev/null 2>&1; then
    echo "PostgreSQL is ready!"
    break
  fi
  attempt=$((attempt + 1))
  echo "PostgreSQL is unavailable - sleeping (attempt $attempt/$max_attempts)"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "Warning: Could not verify PostgreSQL connection, proceeding anyway..."
fi

# Run database migrations
cd /app
echo "Running database migrations..."
npx prisma migrate deploy || echo "Migration deploy failed, this is normal on first run"

# Start the application
exec "$@"

