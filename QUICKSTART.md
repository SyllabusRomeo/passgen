# Quick Start Guide

## Option 1: Run Locally (Without Docker)

### Prerequisites
- Node.js 20+ installed
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   
   Create a `.env.local` file:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   NOTIFICATION_EMAIL=your-email@gmail.com
   ```

3. **Set Up Database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Run migrations (creates database if it doesn't exist)
   npm run db:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to: http://localhost:3000

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run db:migrate

# Generate Prisma Client
npm run db:generate

# Open Prisma Studio (database GUI)
npm run db:studio

# Run monitoring script
npm run monitor
```

---

## Option 2: Run with Docker

### Prerequisites
- Docker Desktop installed

### Steps

1. **Set Up Environment Variables**
   
   Create a `.env` file:
   ```env
   DATABASE_URL="file:./data/dev.db"
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   NOTIFICATION_EMAIL=your-email@gmail.com
   ```

2. **Build and Start**
   ```bash
   docker compose up -d --build
   ```

3. **View Logs**
   ```bash
   docker compose logs -f
   ```

4. **Access Application**
   - Navigate to: http://localhost:3000

### Docker Commands

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f passwordgenerator

# Rebuild after changes
docker compose up -d --build
```

---

## Troubleshooting

### Local Development Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

**Database errors:**
```bash
# Reset database
rm prisma/dev.db
npm run db:migrate
```

**Prisma Client not found:**
```bash
npm run db:generate
```

### Docker Issues

**Container won't start:**
```bash
# Check logs
docker compose logs passwordgenerator

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

**Database not persisting:**
- Database is stored in Docker volume `password_data`
- To reset: `docker compose down -v`

---

## First Time Setup Checklist

- [ ] Install Node.js 20+ (for local) OR Docker Desktop (for Docker)
- [ ] Clone/download the project
- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` (local) or `.env` (Docker) file
- [ ] Configure SMTP settings (for email notifications)
- [ ] Run database migrations: `npm run db:migrate`
- [ ] Start the application
- [ ] Open http://localhost:3000

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database path | Yes |
| `SMTP_HOST` | SMTP server hostname | Yes (for emails) |
| `SMTP_PORT` | SMTP server port | Yes (for emails) |
| `SMTP_USER` | SMTP username | Yes (for emails) |
| `SMTP_PASS` | SMTP password/app password | Yes (for emails) |
| `SMTP_FROM` | Email sender address | Yes (for emails) |
| `NOTIFICATION_EMAIL` | Email to receive breach alerts | Yes (for emails) |
| `HIBP_API_KEY` | Have I Been Pwned API key | No (optional) |

---

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Check [DOCKER.md](DOCKER.md) for Docker-specific help
- Review error logs in the terminal/console

