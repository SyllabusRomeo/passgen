# 🔐 Secure Password Manager

A modern, intelligent password generator and manager with user authentication, proactive breach detection, password expiration tracking, and email notifications.

## ✨ Features

### 🔒 Authentication & Security
- **User Authentication**: Secure login/signup system with session-based authentication
- **Password Security**: Bcrypt password hashing with HTTP-only cookies
- **Password Expiration**: Automatic password expiration tracking (90-day industry standard)
- **Password Change**: User-friendly password change functionality in settings

### 🔑 Password Management
- **Secure Password Generation**: Generate complex, customizable passwords with options for length, character types, and exclusions
- **Password Storage**: Store and organize passwords with service names, usernames, URLs, and notes
- **Password Age Tracking**: Automatic tracking of how long each password has been in use
- **Expiration Warnings**: Visual indicators for passwords expiring soon or expired

### 🛡️ Breach Detection & Monitoring
- **Automatic Breach Detection**: Integration with Have I Been Pwned API to check passwords against known data breaches
- **Real-time Monitoring**: Background service to periodically check all stored passwords for breaches
- **Email Notifications**: Receive email alerts when passwords are found in breaches
- **Breach Dashboard**: Comprehensive breach tracking with HIBP-style table and statistics
- **Resolution Tracking**: Mark breaches as resolved after changing passwords

### 🎨 User Interface
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Navigation**: Easy navigation between Dashboard, Breach Monitor, and Settings
- **Status Indicators**: Visual indicators for password health (Safe, Expiring, Expired, Breached)

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM with PostgreSQL
- **PostgreSQL** - Robust relational database
- **Docker** - Containerized deployment
- **Tailwind CSS** - Modern styling
- **bcryptjs** - Password hashing
- **Have I Been Pwned API** - Breach detection
- **Nodemailer** - Email notifications

## 🚀 Quick Start

### Option 1: Docker (Recommended)

**Prerequisites:**
- Docker Desktop installed

**Steps:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SyllabusRomeo/passgen.git
   cd passgen
   ```

2. **Set up environment variables (optional):**
   
   Create a `.env` file in the root directory:
   ```env
   # Database (PostgreSQL - defaults provided in docker-compose.yml)
   POSTGRES_USER=passwordmanager
   POSTGRES_PASSWORD=passwordmanager
   POSTGRES_DB=passwordmanager
   POSTGRES_PORT=5433
   
   # Email notifications (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   NOTIFICATION_EMAIL=your-email@gmail.com
   
   # Have I Been Pwned API (optional, but recommended)
   HIBP_API_KEY=your-api-key
   ```

3. **Build and start:**
   ```bash
   docker compose up -d --build
   ```

4. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Create a new account using the signup form

**Docker Commands:**
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

### Option 2: Local Development

**Prerequisites:**
- Node.js 20+ installed
- PostgreSQL installed and running
- npm or yarn

**Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
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

3. **Set up database:**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # (Optional) Seed database
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Create a new account using the signup form

## 📖 Usage Guide

### Creating an Account

1. Navigate to http://localhost:3000
2. Click on the "Sign Up" tab
3. Enter your email address
4. Enter a strong password (minimum 8 characters)
5. Optionally add your name
6. Click "Sign Up"

### Managing Passwords

1. **Generate a Password:**
   - Use the password generator on the dashboard
   - Customize options (length, character types, exclusions)
   - Click "Generate Password" and copy the result

2. **Save a Password:**
   - Click "Add Password" in the password list
   - Fill in service name, username, password, URL, and notes
   - The system automatically checks for breaches when saving

3. **View Passwords:**
   - All your passwords are listed on the dashboard
   - Status indicators show password health:
     - 🟢 Safe: Password is secure and not expired
     - 🟡 Expiring Soon: Password expires within 7 days
     - 🟠 Expiring: Password expires within 30 days
     - 🔴 Expired: Password is over 90 days old
     - 🔴 Breached: Password found in data breaches

### Breach Monitoring

1. **Breach Dashboard:**
   - Navigate to the "Breach Monitor" tab
   - View comprehensive statistics and breach details
   - See all passwords with their breach status

2. **Manual Breach Check:**
   - Click "Check Breach" on any password entry
   - Or click "Run Check Now" to check all passwords

3. **Resolve Breaches:**
   - After changing a breached password, click "Mark Resolved"
   - The breach status will be updated

### Settings

- **Change Password:**
  - Navigate to the "Settings" tab
  - Enter your current password and new password
  - Click "Change Password"

- **View Account Info:**
  - See your email and account details in Settings

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Log in user
- `POST /api/auth/logout` - Log out user
- `GET /api/auth/session` - Get current session/user info
- `POST /api/auth/change-password` - Change user password (requires authentication)

### Password Management
- `GET /api/passwords` - Get all user's password entries
- `POST /api/passwords` - Create a new password entry
- `GET /api/passwords/[id]` - Get a specific password entry
- `PUT /api/passwords/[id]` - Update a password entry
- `DELETE /api/passwords/[id]` - Delete a password entry
- `POST /api/passwords/[id]/check` - Manually check a password for breaches

### Monitoring
- `GET /api/monitor` - Get breach monitoring statistics
- `POST /api/monitor` - Run breach check on all passwords
- `POST /api/generate` - Generate a new password

All password endpoints require authentication (except signup/login).

## 🔐 Security Features

### Password Policy
Following industry best practices:
- **Minimum Length**: 8 characters
- **Complexity**: Mix of uppercase, lowercase, numbers, and special characters recommended
- **Rotation**: Automatic expiration after 90 days
- **Breach Detection**: Continuous monitoring against known breaches
- **Uniqueness**: Track where passwords are used to prevent reuse

### Security Measures
- ✅ Bcrypt password hashing (10 rounds)
- ✅ HTTP-only session cookies
- ✅ User data isolation (each user only sees their own passwords)
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection (Next.js built-in)
- ✅ CSRF protection (Next.js built-in)

### Security Notes

⚠️ **Important Security Considerations:**

1. **Password Storage**: This application uses base64 encoding for demonstration. In production, use proper encryption (AES-256) with a secure key management system.

2. **Database**: PostgreSQL is used with proper connection security. Ensure your database is properly secured in production.

3. **Environment Variables**: Never commit `.env` or `.env.local` to version control. Keep all secrets secure.

4. **HTTPS**: Always use HTTPS in production to protect data in transit.

5. **Session Management**: Sessions expire after 7 days of inactivity. Implement proper session management for production.

## 📊 Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User accounts with authentication info
- **Session**: Active user sessions
- **PasswordEntry**: Stored passwords with metadata
- **BreachAlert**: Breach detection records

See `prisma/schema.prisma` for the complete schema.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with sample data
npm run monitor      # Run breach monitoring script
```

### Project Structure

```
passgen/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── passwords/     # Password management endpoints
│   │   └── monitor/       # Monitoring endpoints
│   ├── components/        # React components
│   └── page.tsx          # Main page
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Prisma client
│   └── ...               # Other utilities
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile.dev         # Development Dockerfile
└── package.json          # Dependencies and scripts
```

## 🤖 Automated Monitoring

To set up automated breach monitoring:

1. **Use a cron job** (Linux/Mac):
   ```bash
   # Run every day at 2 AM
   0 2 * * * curl -X POST http://localhost:3000/api/monitor
   ```

2. **Use a scheduled task** (Windows):
   - Create a scheduled task that runs a script calling the API

3. **Use a cloud service**:
   - Services like Vercel Cron, GitHub Actions, or AWS Lambda can call the endpoint periodically

## 📚 Documentation

All documentation is available in the [docs](docs/) folder and can also be accessed from within the application via the "📚 Docs" navigation link.

- [Quick Start Guide](docs/QUICKSTART.md) - Get up and running in minutes
- [Docker Setup Guide](docs/DOCKER.md) - Complete Docker setup and deployment
- [Login Instructions](docs/LOGIN_INSTRUCTIONS.md) - Login and authentication guide
- [Default Credentials & Features](docs/DEFAULT_CREDENTIALS.md) - Features overview and API endpoints
- [Prisma Client Setup](docs/FIX_PRISMA.md) - Prisma configuration and troubleshooting

## 🐛 Troubleshooting

### Common Issues

**Prisma Client errors:**
```bash
npm run db:generate
rm -rf .next
npm run dev
```

**Database connection errors:**
- Check PostgreSQL is running
- Verify DATABASE_URL in environment variables
- Check database credentials

**Docker issues:**
```bash
docker compose down -v
docker compose up -d --build
```

See [DOCKER.md](DOCKER.md) for more Docker troubleshooting.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:
- Check the documentation files
- Review error logs in the terminal/console
- Open an issue on GitHub
