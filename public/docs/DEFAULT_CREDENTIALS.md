# Default Credentials and Features

## Initial Setup

When you first access the Password Manager, **create an account** using the signup form. There are no default credentials - you must create your own account.

### Suggested Test Credentials

For testing or initial setup, you can use these suggested credentials:

**Email:** `admin@passwordmanager.com`  
**Password:** `Admin@123!`

⚠️ **IMPORTANT SECURITY NOTICE:**
- These are just suggestions - create your own account with a strong password
- Change your password regularly
- Go to Settings > Change Password to update your password
- Passwords expire every 90 days following industry best practices

## Features Overview

### 1. Authentication & Security
- ✅ Secure login/signup system
- ✅ Session-based authentication with HTTP-only cookies
- ✅ Password strength requirements (minimum 8 characters)
- ✅ Automatic password expiration (90 days)
- ✅ Password change functionality
- ✅ Bcrypt password hashing (10 rounds)

### 2. Password Management
- ✅ Generate strong, customizable passwords
- ✅ Store passwords with service details (name, username, URL, notes)
- ✅ Automatic password age tracking
- ✅ Password expiration warnings and notifications
- ✅ Visual status indicators (Safe, Expiring, Expired, Breached)

### 3. Breach Monitoring
- ✅ Automatic integration with Have I Been Pwned API
- ✅ Real-time breach detection for all stored passwords
- ✅ Email notifications for detected breaches (if configured)
- ✅ Manual breach checking on demand
- ✅ Resolution tracking for breached passwords
- ✅ Comprehensive breach dashboard with statistics

### 4. Navigation
- **Dashboard:** Main password generation and management
- **Breach Monitor:** Comprehensive breach tracking and statistics
- **Settings:** Account management and password change

### 5. Password Lifecycle Management
- **Password Age Tracking:** Monitors how long each password has been in use
- **Expiration Management:** Passwords expire after 90 days (industry standard)
- **Status Indicators:**
  - 🟢 **Safe**: Password is secure and not expired
  - 🟡 **Expiring Soon**: Password expires within 7 days
  - 🟠 **Expiring**: Password expires within 30 days
  - 🔴 **Expired**: Password is over 90 days old
  - 🔴 **Breached**: Password found in data breaches

### 6. Breach Dashboard
- Real-time statistics (total, breached, expired, expiring soon)
- HIBP-style breach table with detailed information
- Call-to-action buttons for urgent password updates
- Sortable and filterable password list
- Manual breach checking for all passwords

### 7. Security Best Practices
- Passwords automatically expire after 90 days (industry standard)
- Breach detection on password creation and updates
- Encrypted password storage (base64 encoding for demo - use AES-256 in production)
- User isolation (each user only sees their own passwords)
- Session expiration after 7 days of inactivity

## Database Configuration

The application uses **PostgreSQL** for data storage:

### Docker (Default)
- **Host:** `postgres` (internal) / `localhost:5433` (external)
- **Database:** `passwordmanager`
- **User:** `passwordmanager`
- **Password:** `passwordmanager`
- **Port:** `5433` (external) / `5432` (internal)

### Customization

You can customize these using environment variables in `.env`:

```env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
POSTGRES_PORT=5434
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
  - Body: `{ email, password, name? }`
  - Returns: `{ user: { id, email, name } }`

- `POST /api/auth/login` - Log in
  - Body: `{ email, password }`
  - Returns: `{ user: { id, email, name } }`
  - Sets HTTP-only session cookie

- `POST /api/auth/logout` - Log out
  - Clears session cookie

- `GET /api/auth/session` - Check current session
  - Returns: `{ user: { id, email, name } }` or `{ user: null }`

- `POST /api/auth/change-password` - Change password (requires authentication)
  - Body: `{ currentPassword, newPassword }`
  - Returns: `{ success: true }`

### Password Management
- `GET /api/passwords` - Get all user's passwords
  - Returns: Array of password entries

- `POST /api/passwords` - Create new password entry
  - Body: `{ serviceName, username?, password, url?, notes? }`
  - Returns: Created password entry

- `GET /api/passwords/[id]` - Get specific password
  - Returns: Password entry with decrypted password

- `PUT /api/passwords/[id]` - Update password
  - Body: `{ serviceName?, username?, password?, url?, notes? }`
  - Returns: Updated password entry

- `DELETE /api/passwords/[id]` - Delete password
  - Returns: `{ success: true }`

- `POST /api/passwords/[id]/check` - Check password for breaches
  - Returns: `{ isBreached, breachDetails? }`

### Monitoring
- `GET /api/monitor` - Get breach statistics
  - Returns: `{ total, safe, breached, expired, expiringSoon }`

- `POST /api/monitor` - Run breach check on all passwords
  - Returns: Monitoring results

- `POST /api/generate` - Generate new password
  - Body: `{ length?, includeUppercase?, includeLowercase?, includeNumbers?, includeSymbols?, excludeSimilar? }`
  - Returns: `{ password }`

**Note:** All password endpoints require authentication (except signup/login).

## Password Policy

Following industry best practices:

1. **Length:** Minimum 8 characters
2. **Complexity:** Mix of uppercase, lowercase, numbers, and special characters recommended
3. **Rotation:** Every 90 days (automatic expiration)
4. **Breach Detection:** Continuous monitoring against known breaches
5. **Uniqueness:** Don't reuse passwords across services
6. **Storage:** Encrypted storage (use AES-256 in production)

## Getting Started

1. **Start the application:**
   ```bash
   docker compose up -d --build
   ```

2. **Access the application:**
   - Open http://localhost:3000

3. **Create your account:**
   - Click "Sign Up"
   - Enter your email and password
   - Click "Sign Up"

4. **Start managing passwords:**
   - Generate passwords using the password generator
   - Save passwords with service details
   - Monitor for breaches in the Breach Monitor tab

## Support

For issues or questions:
- Check [README.md](README.md) for detailed documentation
- Check [QUICKSTART.md](QUICKSTART.md) for setup instructions
- Check [LOGIN_INSTRUCTIONS.md](LOGIN_INSTRUCTIONS.md) for authentication help
- Review Docker logs: `docker compose logs passwordgenerator`

## Security Reminders

⚠️ **Important:**
- Use strong, unique passwords
- Change passwords regularly (every 90 days)
- Enable email notifications for breach alerts
- Never share your account credentials
- Use HTTPS in production
- Keep your database secure
