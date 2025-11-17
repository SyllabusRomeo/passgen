#!/bin/sh
set -e

# Ensure Prisma Client is generated
echo "Generating Prisma Client..."
npx prisma generate

# Start the application
exec "$@"

