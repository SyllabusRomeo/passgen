# Docker Setup Guide

## Prerequisites

1. **Install Docker Desktop** (if not already installed):
   - macOS: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
   - Linux: Follow distribution-specific instructions
   - Windows: Download Docker Desktop for Windows

2. **Verify Docker Installation**:
   ```bash
   docker --version
   docker compose version
   ```

## Quick Start

### 1. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./data/dev.db"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
NOTIFICATION_EMAIL=your-email@gmail.com
HIBP_API_KEY=
```

### 2. Build and Run

```bash
# Build the Docker image
docker compose build

# Start the container in detached mode
docker compose up -d

# View logs
docker compose logs -f

# The application will be available at http://localhost:3000
```

### 3. Stop the Container

```bash
docker compose down
```

## Docker Commands Reference

```bash
# Build the image
docker compose build

# Start containers
docker compose up -d

# Start and view logs
docker compose up

# View logs
docker compose logs -f passwordgenerator

# Stop containers
docker compose down

# Stop and remove volumes (⚠️ deletes database)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build

# Access container shell
docker compose exec passwordgenerator sh

# Check container status
docker compose ps

# View container resource usage
docker stats passwordgenerator
```

## Database Persistence

The database is stored in a Docker volume named `password_data`. This ensures your data persists even if you stop and remove the container.

To backup the database:
```bash
docker compose exec passwordgenerator sh -c "cp /app/data/dev.db /app/data/dev.db.backup"
```

To restore:
```bash
docker compose exec passwordgenerator sh -c "cp /app/data/dev.db.backup /app/data/dev.db"
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker compose logs passwordgenerator

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Database migration issues
```bash
# Access container
docker compose exec passwordgenerator sh

# Run migrations manually
npx prisma migrate deploy
npx prisma generate
```

### Port already in use
If port 3000 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### Environment variables not loading
Make sure your `.env` file is in the root directory and contains all required variables.

## Development Mode

For development with hot-reload, use the development Dockerfile:

```bash
docker compose -f docker-compose.dev.yml up
```

(Note: You'll need to create `docker-compose.dev.yml` if you want a separate dev configuration)

## Production Deployment

For production, consider:
1. Using environment variables from your hosting platform
2. Using a managed database (PostgreSQL) instead of SQLite
3. Setting up proper SSL/TLS certificates
4. Implementing authentication
5. Using secrets management for sensitive data

