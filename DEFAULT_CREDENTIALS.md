# Default Administrator Credentials

## Initial Setup

When you first access the Password Manager, create an account using the signup form.

For testing or initial setup, you can use these suggested credentials:

**Email:** `admin@passwordmanager.com`  
**Password:** `Admin@123!`

⚠️ **IMPORTANT SECURITY NOTICE:**
- Change this password immediately after your first login
- Go to Settings > Change Password
- Passwords expire every 90 days following industry best practices

## Features

### 1. Authentication & Security
- Secure login/signup system
- Session-based authentication with HTTP-only cookies
- Password strength requirements (minimum 8 characters)
- Automatic password expiration (90 days)
- Password change functionality

### 2. Password Management
- Generate strong, customizable passwords
- Store passwords with service details (name, username, URL, notes)
- Automatic password age tracking
- Password expiration warnings and notifications

### 3. Breach Monitoring
- Automatic integration with Have I Been Pwned API
- Real-time breach detection for all stored passwords
- Email notifications for detected breaches
- Manual breach checking on demand
- Resolution tracking for breached passwords

### 4. Navigation
- **Dashboard:** Main password generation and management
- **Breach Monitor:** Comprehensive breach tracking and statistics
- **Settings:** Account management and password change

### 5. Password Lifecycle Management
- **Password Age Tracking:** Monitors how long each password has been in use
- **Expiration Management:** Passwords expire after 90 days
- **Status Indicators:**
  - 🟢 Safe: Password is secure and not expired
  - 🟡 Expiring Soon: Password expires within 7 days
  - 🟠 Expiring: Password expires within 30 days
  - 🔴 Expired: Password is over 90 days old
  - 🔴 Breached: Password found in data breaches

### 6. Breach Dashboard
- Real-time statistics (total, breached, expired, expiring soon)
- HIBP-style breach table with detailed information
- Call-to-action buttons for urgent password updates
- Sortable and filterable password list

### 7. Security Best Practices
- Passwords automatically expire after 90 days (industry standard)
- Breach detection on password creation and updates
- Encrypted password storage (base64 encoding for demo)
- User isolation (each user only sees their own passwords)

## Database

The application uses PostgreSQL for data storage:
- Host: `postgres` (Docker internal) / `localhost:5433` (external)
- Database: `passwordmanager`
- User: `passwordmanager`
- Password: `passwordmanager`

You can customize these using environment variables.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Log in
- `POST /api/auth/logout` - Log out
- `GET /api/auth/session` - Check current session
- `POST /api/auth/change-password` - Change password (requires authentication)

### Password Management
- `GET /api/passwords` - Get all user's passwords
- `POST /api/passwords` - Create new password entry
- `GET /api/passwords/[id]` - Get specific password
- `PUT /api/passwords/[id]` - Update password
- `DELETE /api/passwords/[id]` - Delete password
- `POST /api/passwords/[id]/check` - Check password for breaches

### Monitoring
- `GET /api/monitor` - Get breach statistics
- `POST /api/monitor` - Run breach check on all passwords
- `POST /api/generate` - Generate new password

## Password Policy

Following industry best practices:

1. **Length:** Minimum 8 characters
2. **Complexity:** Mix of uppercase, lowercase, numbers, and special characters recommended
3. **Rotation:** Every 90 days (automatic expiration)
4. **Breach Detection:** Continuous monitoring against known breaches
5. **Uniqueness:** Don't reuse passwords across services

## Support

For issues or questions, refer to the main README.md file.

