# Login Instructions

Complete guide for accessing and using the Secure Password Manager.

## Quick Start

1. **Start the application:**
   ```bash
   docker compose up -d --build
   ```

2. **Open your browser:** http://localhost:3000

3. **Create your account** (first time only):
   - Click on the "Sign Up" tab
   - Enter your email (e.g., `admin@passwordmanager.com`)
   - Enter a strong password (minimum 8 characters, e.g., `Admin@123!`)
   - Optionally add your name
   - Click "Sign Up"

4. **Log in** (subsequent visits):
   - Use the "Log In" tab
   - Enter your email and password
   - Click "Log In"

## Creating Your Account

### Sign Up Process

1. Navigate to http://localhost:3000
2. You'll see the login/signup page
3. Click on the **"Sign Up"** tab
4. Fill in the form:
   - **Email**: Your email address (required)
   - **Password**: Minimum 8 characters (required)
   - **Name**: Your full name (optional)
5. Click **"Sign Up"** button
6. You'll be automatically logged in and redirected to the dashboard

### Password Requirements

- **Minimum length**: 8 characters
- **Recommended**: Mix of uppercase, lowercase, numbers, and special characters
- **Example**: `Admin@123!` or `MySecure!Pass2024`

## Logging In

### Login Process

1. Navigate to http://localhost:3000
2. If you're not logged in, you'll see the login page
3. Enter your credentials:
   - **Email**: The email you used to sign up
   - **Password**: Your account password
4. Click **"Log In"** button
5. You'll be redirected to the dashboard

### Session Management

- Sessions are stored in HTTP-only cookies
- Sessions expire after 7 days of inactivity
- You'll be automatically logged out if your session expires
- You can manually log out using the logout button

## After Login

Once logged in, you'll have access to:

### Dashboard Tab
- **Password Generator**: Create secure, customizable passwords
- **Password List**: View and manage all your saved passwords
- **Add Password**: Save new passwords with service details
- **Status Indicators**: See password health at a glance

### Breach Monitor Tab
- **Statistics**: Total passwords, breached, expired, expiring soon
- **Breach Table**: Detailed view of all passwords with breach status
- **Manual Check**: Run breach check on all passwords
- **Resolution**: Mark breaches as resolved after password changes

### Settings Tab
- **Account Info**: View your email and account details
- **Change Password**: Update your account password
- **Password Requirements**: See current password policy

## Troubleshooting

### Can't Sign Up

**Error: "User with this email already exists"**
- This email is already registered
- Try logging in instead, or use a different email

**Error: "Password must be at least 8 characters long"**
- Your password is too short
- Use at least 8 characters

**Error: "Invalid email format"**
- Check your email format
- Use a valid email address (e.g., `user@example.com`)

**Error: "Failed to create account"**
- Check Docker logs: `docker compose logs passwordgenerator`
- Verify database is running: `docker compose ps`
- Check for Prisma errors in logs

### Can't Log In

**Error: "Invalid email or password"**
- Double-check your email and password
- Make sure you're using the correct credentials
- Try resetting your password (if feature available)

**Error: "Error occurred"**
- Check browser console (F12) for errors
- Check Docker logs: `docker compose logs passwordgenerator --tail 50`
- Try clearing browser cache and cookies
- Try incognito/private mode

**Session not persisting**
- Check if cookies are enabled in your browser
- Make sure you're not blocking third-party cookies
- Try a different browser

### Application Not Loading

**Page shows "Error occurred"**
- Check if containers are running: `docker compose ps`
- Check application logs: `docker compose logs passwordgenerator`
- Restart containers: `docker compose restart`

**Database connection errors**
- Verify PostgreSQL is running: `docker compose ps postgres`
- Check database logs: `docker compose logs postgres`
- Restart database: `docker compose restart postgres`

## Security Best Practices

### Password Security
- ✅ Use a strong, unique password for your account
- ✅ Don't reuse passwords from other services
- ✅ Change your password regularly (every 90 days)
- ✅ Use the password generator for strong passwords

### Account Security
- ✅ Never share your account credentials
- ✅ Log out when using shared computers
- ✅ Use HTTPS in production (not applicable for localhost)
- ✅ Enable email notifications for breach alerts

### Session Security
- ✅ Don't leave your session open on public computers
- ✅ Log out when finished
- ✅ Clear browser cache if using a shared device

## Changing Your Password

1. Log in to your account
2. Navigate to the **Settings** tab
3. Scroll to "Change Password" section
4. Enter your current password
5. Enter your new password (minimum 8 characters)
6. Confirm your new password
7. Click **"Change Password"**

**Note:** After changing your password, you'll need to log in again with your new password.

## Logging Out

1. Click the **"Logout"** button in the navigation menu
2. You'll be redirected to the login page
3. Your session will be cleared

## Database Information

### Accessing the Database

If you need to access the database directly:

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U passwordmanager -d passwordmanager

# Or from your host machine (if you have psql installed)
psql -h localhost -p 5433 -U passwordmanager -d passwordmanager
```

### Default Database Credentials

- **Host**: `localhost:5433` (external) / `postgres:5432` (internal)
- **Database**: `passwordmanager`
- **User**: `passwordmanager`
- **Password**: `passwordmanager`

**⚠️ Change these in production!**

## Support

If you continue to experience issues:

1. **Check the logs:**
   ```bash
   docker compose logs passwordgenerator --tail 100
   ```

2. **Verify containers are running:**
   ```bash
   docker compose ps
   ```

3. **Check browser console:**
   - Press F12 to open developer tools
   - Check the Console tab for errors

4. **Try a clean restart:**
   ```bash
   docker compose down
   docker compose up -d --build
   ```

5. **Review documentation:**
   - [README.md](README.md) - Main documentation
   - [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
   - [DOCKER.md](DOCKER.md) - Docker-specific help

## Features Overview

After logging in, you can:

- ✅ Generate secure passwords
- ✅ Store passwords with service details
- ✅ Track password age and expiration
- ✅ Monitor for data breaches
- ✅ Receive email alerts (if configured)
- ✅ Manage account settings
- ✅ Change your password

## Next Steps

1. **Generate your first password** using the password generator
2. **Save a password** by clicking "Add Password"
3. **Check for breaches** in the Breach Monitor tab
4. **Explore the dashboard** to see all features

Enjoy secure password management! 🔐
