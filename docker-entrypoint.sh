#!/bin/sh
set -e

# Run database migrations if database doesn't exist
if [ ! -f "/app/data/dev.db" ]; then
  echo "Database not found. Running initial migration..."
  export DATABASE_URL="file:./data/dev.db"
  cd /app
  npx prisma migrate deploy || npx prisma migrate dev --name init || true
fi

# Start the application
exec "$@"

