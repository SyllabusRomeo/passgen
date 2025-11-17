# Docker Setup Guide

Complete guide for running the Secure Password Manager with Docker.

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

### 1. Set Up Environment Variables (Optional)

Create a `.env` file in the root directory for email notifications and API keys:

```env
# Email notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
NOTIFICATION_EMAIL=your-email@gmail.com

# Have I Been Pwned API (optional, but recommended)
HIBP_API_KEY=your-api-key

# Database configuration (optional - defaults provided)
POSTGRES_USER=passwordmanager
POSTGRES_PASSWORD=passwordmanager
POSTGRES_DB=passwordmanager
POSTGRES_PORT=5433
```

**Note:** Database credentials have defaults in `docker-compose.yml`. You only need to set them if you want to customize.

**For Gmail SMTP:**
- You'll need to generate an "App Password" in your Google Account settings
- Go to: Google Account → Security → 2-Step Verification → App passwords
- Use this app password for `SMTP_PASS`

### 2. Build and Run

```bash
# Build the Docker image and start containers
docker compose up -d --build

# View logs
docker compose logs -f passwordgenerator

# The application will be available at http://localhost:3000
```

### 3. Access the Application

1. Open http://localhost:3000 in your browser
2. Create a new account using the signup form
3. Start managing your passwords!

## Docker Services

The `docker-compose.yml` file defines two services:

1. **postgres**: PostgreSQL database
   - Port: 5433 (external) → 5432 (internal)
   - Volume: `postgres_data` (persistent storage)
   - Health check enabled

2. **passwordgenerator**: Next.js application
   - Port: 3000
   - Depends on postgres service
   - Auto-generates Prisma Client on startup

## Docker Commands Reference

```bash
# Build the image
docker compose build

# Start containers in detached mode
docker compose up -d

# Start and view logs
docker compose up

# View logs (follow mode)
docker compose logs -f passwordgenerator

# View logs (last 50 lines)
docker compose logs --tail 50 passwordgenerator

# Stop containers
docker compose down

# Stop and remove volumes (⚠️ deletes database)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build

# Restart containers
docker compose restart

# Access container shell
docker compose exec passwordgenerator sh

# Access database container
docker compose exec postgres psql -U passwordmanager -d passwordmanager

# Check container status
docker compose ps

# View container resource usage
docker stats passwordgenerator

# View container logs for specific service
docker compose logs postgres
docker compose logs passwordgenerator
```

## Database Persistence

The database is stored in a Docker volume named `postgres_data`. This ensures your data persists even if you stop and remove the container.

### Backup Database

```bash
# Create a backup
docker compose exec postgres pg_dump -U passwordmanager passwordmanager > backup.sql

# Or using Docker volume
docker run --rm -v passgen_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

### Restore Database

```bash
# Restore from SQL dump
docker compose exec -T postgres psql -U passwordmanager passwordmanager < backup.sql

# Or from volume backup
docker run --rm -v passgen_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

## Development Mode

The application runs in development mode by default using `Dockerfile.dev`, which includes:

- Hot-reload support
- Development tools
- Source code mounting
- Automatic Prisma Client generation

For production, you would use a production Dockerfile with optimized builds.

## Troubleshooting

### Container won't start

```bash
# Check logs for errors
docker compose logs passwordgenerator

# Check if ports are available
netstat -an | grep 3000
netstat -an | grep 5433

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

# Or reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Port already in use

If port 3000 or 5433 is already in use, change them in `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - "5434:5432"  # Change external port
  
  passwordgenerator:
    ports:
      - "3001:3000"  # Change external port
```

### Environment variables not loading

1. Make sure your `.env` file is in the root directory
2. Check that variable names match exactly (case-sensitive)
3. Restart containers after changing `.env`:
   ```bash
   docker compose down
   docker compose up -d
   ```

### Prisma Client errors

```bash
# Regenerate Prisma Client
docker compose exec passwordgenerator npx prisma generate

# Clear Next.js cache
docker compose exec passwordgenerator rm -rf .next

# Restart container
docker compose restart passwordgenerator
```

### Database connection errors

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Test database connection
docker compose exec passwordgenerator npx prisma db execute --stdin <<< "SELECT 1"
```

### Container keeps restarting

```bash
# Check logs for the error
docker compose logs passwordgenerator --tail 100

# Check health status
docker compose ps

# Restart with fresh build
docker compose down
docker compose up -d --build
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use secrets management (Docker secrets, Kubernetes secrets, etc.)
2. **Database**: Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
3. **SSL/TLS**: Set up proper SSL certificates
4. **Backup Strategy**: Implement automated database backups
5. **Monitoring**: Set up logging and monitoring (Prometheus, Grafana, etc.)
6. **Scaling**: Use Docker Swarm or Kubernetes for horizontal scaling
7. **Security**: 
   - Use strong database passwords
   - Enable firewall rules
   - Use HTTPS only
   - Implement rate limiting

### Production Dockerfile

The repository includes a production Dockerfile. To use it:

1. Update `docker-compose.yml` to use the production Dockerfile
2. Set `NODE_ENV=production`
3. Use production database connection strings
4. Configure proper secrets management

## Volume Management

### List volumes
```bash
docker volume ls
```

### Inspect volume
```bash
docker volume inspect passgen_postgres_data
```

### Remove volume (⚠️ deletes database)
```bash
docker compose down -v
# Or
docker volume rm passgen_postgres_data
```

## Network Configuration

The containers communicate via Docker's internal network. The application connects to PostgreSQL using the service name `postgres` on port `5432`.

To connect from your host machine:
- Application: http://localhost:3000
- PostgreSQL: localhost:5433 (external port)

## Health Checks

Both services include health checks:

- **PostgreSQL**: Checks if database is ready to accept connections
- **Application**: Checks if HTTP server is responding

View health status:
```bash
docker compose ps
```

## Logs Management

### View all logs
```bash
docker compose logs
```

### View specific service logs
```bash
docker compose logs passwordgenerator
docker compose logs postgres
```

### Follow logs (real-time)
```bash
docker compose logs -f
```

### View last N lines
```bash
docker compose logs --tail 100 passwordgenerator
```

### Save logs to file
```bash
docker compose logs > logs.txt
```

## Performance Tuning

### Resource Limits

Add resource limits in `docker-compose.yml`:

```yaml
services:
  passwordgenerator:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Database Optimization

For production, configure PostgreSQL settings in `docker-compose.yml`:

```yaml
services:
  postgres:
    command:
      - "postgres"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "max_connections=200"
```

## Support

For more help:
- Check [README.md](README.md) for general documentation
- Check [QUICKSTART.md](QUICKSTART.md) for quick setup
- Review Docker logs for specific errors
- Open an issue on GitHub
