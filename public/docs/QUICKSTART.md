# Quick Start Guide

Get up and running with the Secure Password Manager in minutes!

## Option 1: Docker (Recommended - Easiest)

### Prerequisites
- Docker Desktop installed

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SyllabusRomeo/passgen.git
   cd passgen
   ```

2. **Build and start:**
   ```bash
   docker compose up -d --build
   ```

3. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Create a new account using the signup form

That's it! The application is ready to use.

**Optional:** Set up email notifications by creating a `.env` file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
NOTIFICATION_EMAIL=your-email@gmail.com
HIBP_API_KEY=your-api-key
```

### Docker Commands

```bash
# View logs
docker compose logs -f passwordgenerator

# Stop containers
docker compose down

# Rebuild after changes
docker compose up -d --build

# Access container shell
docker compose exec passwordgenerator sh
```

---

## Option 2: Local Development

### Prerequisites
- Node.js 20+ installed
- PostgreSQL installed and running
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   
   Create a `.env.local` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/passwordmanager?schema=public"
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   NOTIFICATION_EMAIL=your-email@gmail.com
   HIBP_API_KEY=your-api-key
   ```

3. **Set Up Database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Run migrations (creates database tables)
   npm run db:migrate
   
   # (Optional) Seed database with sample data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to: http://localhost:3000
   - Create a new account using the signup form

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

# Seed database
npm run db:seed

# Run monitoring script
npm run monitor
```

---

## First Steps After Setup

1. **Create Your Account:**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Enter your email and password (minimum 8 characters)
   - Click "Sign Up"

2. **Generate Your First Password:**
   - Use the password generator on the dashboard
   - Customize length and character types
   - Click "Generate Password"

3. **Save a Password:**
   - Click "Add Password"
   - Fill in service name, username, password, URL, and notes
   - Click "Save"

4. **Check for Breaches:**
   - Navigate to "Breach Monitor" tab
   - View statistics and breach status
   - Click "Run Check Now" to check all passwords

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

**Database connection errors:**
```bash
# Verify PostgreSQL is running
# Check DATABASE_URL in .env.local
# Ensure database exists
createdb passwordmanager  # PostgreSQL command
```

**Prisma Client not found:**
```bash
npm run db:generate
rm -rf .next
npm run dev
```

**Database migration errors:**
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or run migrations manually
npm run db:migrate
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
- Database is stored in Docker volume `postgres_data`
- To reset: `docker compose down -v` (⚠️ deletes all data)

**Port conflicts:**
- PostgreSQL uses port 5433 externally (configurable via POSTGRES_PORT)
- Application uses port 3000
- Change ports in `docker-compose.yml` if needed

---

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | Auto (Docker) |
| `POSTGRES_USER` | PostgreSQL username | No | `passwordmanager` |
| `POSTGRES_PASSWORD` | PostgreSQL password | No | `passwordmanager` |
| `POSTGRES_DB` | PostgreSQL database name | No | `passwordmanager` |
| `POSTGRES_PORT` | PostgreSQL external port | No | `5433` |
| `SMTP_HOST` | SMTP server hostname | No | - |
| `SMTP_PORT` | SMTP server port | No | `587` |
| `SMTP_USER` | SMTP username | No | - |
| `SMTP_PASS` | SMTP password/app password | No | - |
| `SMTP_FROM` | Email sender address | No | - |
| `NOTIFICATION_EMAIL` | Email to receive breach alerts | No | - |
| `HIBP_API_KEY` | Have I Been Pwned API key | No | - |

---

## First Time Setup Checklist

- [ ] Install Node.js 20+ (for local) OR Docker Desktop (for Docker)
- [ ] Clone/download the project
- [ ] Install dependencies: `npm install` (local only)
- [ ] Create `.env.local` (local) or `.env` (Docker) file
- [ ] Configure SMTP settings (optional, for email notifications)
- [ ] Run database migrations: `npm run db:migrate` (local only)
- [ ] Start the application
- [ ] Open http://localhost:3000
- [ ] Create your account

---

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Check [DOCKER.md](DOCKER.md) for Docker-specific help
- Check [LOGIN_INSTRUCTIONS.md](LOGIN_INSTRUCTIONS.md) for authentication help
- Review error logs in the terminal/console
- Open an issue on GitHub

---

## Next Steps

After setup, explore:
- **Dashboard**: Generate and manage passwords
- **Breach Monitor**: Track password breaches and expiration
- **Settings**: Change your password and manage account

Enjoy your secure password management! 🔐
