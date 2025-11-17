# 🔐 Secure Password Manager

A modern, intelligent password generator and manager with proactive breach detection and email notifications.

## Features

- **Secure Password Generation**: Generate complex, customizable passwords with options for length, character types, and exclusions
- **Password Tracking**: Store and organize passwords with service names, usernames, URLs, and notes
- **Breach Detection**: Automatic integration with Have I Been Pwned API to check passwords against known data breaches
- **Email Notifications**: Receive email alerts when passwords are found in breaches
- **Proactive Monitoring**: Background service to periodically check all stored passwords for breaches
- **Resolution Tracking**: Mark breaches as resolved after changing passwords
- **Modern UI**: Beautiful, responsive interface with dark mode support

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM with SQLite
- **Tailwind CSS** - Modern styling
- **Have I Been Pwned API** - Breach detection
- **Nodemailer** - Email notifications

## Setup Instructions

You can run this application in two ways:
1. **Local Development** (without Docker) - Best for development and quick setup
2. **Docker** - Best for production and consistent environments

### Option 1: Local Development (Quick Start)

See the [Local Development Setup](#local-development-setup) section below for detailed instructions.

**Quick Start:**
```bash
# Install dependencies
npm install

# Set up database
npm run db:generate
npm run db:migrate

# Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Docker

See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

**Quick Docker Start:**
```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

---

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="file:./prisma/dev.db"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
NOTIFICATION_EMAIL=your-email@gmail.com
```

**For Gmail:**
- You'll need to generate an "App Password" in your Google Account settings
- Go to: Google Account → Security → 2-Step Verification → App passwords
- Use this app password for `SMTP_PASS`

**Optional:**
- `HIBP_API_KEY` - API key for Have I Been Pwned (optional, but recommended for higher rate limits)

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations (creates database if it doesn't exist)
npm run db:migrate
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio (database GUI)
npm run monitor      # Run breach monitoring script
```

## Usage

### Generating Passwords

1. Use the password generator to create secure passwords
2. Customize options:
   - Length (8-64 characters)
   - Include/exclude uppercase, lowercase, numbers, symbols
   - Exclude similar characters (i, l, 1, L, o, 0, O)
3. Click "Generate Password" and copy the result

### Saving Passwords

1. Click "Add Password" in the password list
2. Fill in:
   - Service/Website Name (required)
   - Username/Email (optional)
   - Password (required) - can generate from modal
   - URL (optional)
   - Notes (optional)
3. The system automatically checks for breaches when saving

### Monitoring

- The monitoring status shows total, safe, and breached passwords
- Click "Run Check Now" to manually trigger a breach check for all passwords
- Set up a cron job or scheduled task to call `/api/monitor` (POST) periodically

### Breach Alerts

- When a breach is detected, you'll receive an email notification
- Breached passwords are highlighted with a red border
- Click "Check Breach" on any password to manually verify
- After changing a breached password, click "Mark Resolved"

## API Endpoints

- `GET /api/passwords` - Get all password entries
- `POST /api/passwords` - Create a new password entry
- `GET /api/passwords/[id]` - Get a specific password entry
- `PUT /api/passwords/[id]` - Update a password entry
- `DELETE /api/passwords/[id]` - Delete a password entry
- `POST /api/passwords/[id]/check` - Manually check a password for breaches
- `POST /api/generate` - Generate a new password
- `GET /api/monitor` - Get monitoring statistics
- `POST /api/monitor` - Run breach check on all passwords

## Security Notes

⚠️ **Important Security Considerations:**

1. **Password Storage**: This application uses simple base64 encoding for demonstration. In production, use proper encryption (AES-256) with a secure key management system.

2. **Database**: SQLite is used for simplicity. For production, use a more robust database (PostgreSQL, MySQL) with proper security measures.

3. **Environment Variables**: Never commit `.env.local` to version control. Keep all secrets secure.

4. **HTTPS**: Always use HTTPS in production to protect data in transit.

5. **Authentication**: This application doesn't include user authentication. Add proper authentication/authorization for production use.

## Automated Monitoring

To set up automated monitoring, you can:

1. **Use a cron job** (Linux/Mac):
   ```bash
   # Run every day at 2 AM
   0 2 * * * curl -X POST http://localhost:3000/api/monitor
   ```

2. **Use a scheduled task** (Windows):
   - Create a scheduled task that runs a script calling the API

3. **Use a cloud service**:
   - Services like Vercel Cron, GitHub Actions, or AWS Lambda can call the endpoint periodically

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
