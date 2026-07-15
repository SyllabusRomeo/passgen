# Deploying to Vercel + Supabase

Complete step-by-step guide for deploying the Secure Password Manager to **Vercel** (app hosting) with **Supabase** (managed PostgreSQL database).

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step 1: Create a Supabase Project](#step-1-create-a-supabase-project)
- [Step 2: Get Your Database Connection Strings](#step-2-get-your-database-connection-strings)
- [Step 3: Push Your Code to GitHub](#step-3-push-your-code-to-github)
- [Step 4: Deploy to Vercel](#step-4-deploy-to-vercel)
- [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
- [Step 6: Deploy and Verify](#step-6-deploy-and-verify)
- [Optional: Configure HIBP and Email](#optional-configure-hibp-and-email)
- [Running Migrations Manually](#running-migrations-manually)
- [Custom Domain Setup](#custom-domain-setup)
- [Monitoring and Logs](#monitoring-and-logs)
- [Troubleshooting](#troubleshooting)
- [Cost Breakdown](#cost-breakdown)

---

## Overview

This deployment uses two services:

| Service   | Role                    | Free Tier Available |
|-----------|-------------------------|---------------------|
| **Vercel**   | Hosts the Next.js app (frontend + API routes) | Yes |
| **Supabase** | Managed PostgreSQL database                   | Yes (500 MB, 2 projects) |

**How it works:**
- Vercel detects your Next.js project and builds it automatically.
- During the build, Prisma generates its client and runs pending database migrations against your Supabase PostgreSQL instance.
- At runtime, the app connects to Supabase via a pooled connection (PgBouncer) for optimal performance in a serverless environment.

---

## Prerequisites

Before starting, make sure you have:

- [ ] A **GitHub** account (Vercel deploys from Git repos)
- [ ] Your project pushed to a GitHub repository
- [ ] A **Vercel** account — sign up free at [vercel.com](https://vercel.com)
- [ ] A **Supabase** account — sign up free at [supabase.com](https://supabase.com)
- [ ] (Optional) An **HIBP API key** from [haveibeenpwned.com/API/Key](https://haveibeenpwned.com/API/Key)

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and sign in.

2. Click **"New Project"**.

3. Fill in the project details:
   - **Name**: `passgen` (or any name you prefer)
   - **Database Password**: Choose a strong password — **save this, you'll need it for the connection strings**
   - **Region**: Pick the region closest to your users (ideally the same region as your Vercel deployment)
   - **Plan**: Free tier is fine to start

4. Click **"Create new project"** and wait for provisioning to complete (usually 1-2 minutes).

---

## Step 2: Get Your Database Connection Strings

You need **two** connection strings from Supabase: a **pooled** one for the app and a **direct** one for migrations.

1. In your Supabase project dashboard, go to **Settings** (gear icon) > **Database**.

2. Scroll down to **Connection string**.

3. Select the **URI** tab.

4. Copy the **Transaction** (pooler) connection string. It looks like:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   This will be your `DATABASE_URL`.

5. Copy the **Session** (direct) connection string. It looks like:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```
   This will be your `DIRECT_URL`.

> **Important:** Replace `[YOUR-PASSWORD]` with the database password you set in Step 1. Supabase shows the placeholder — you must substitute your actual password.

---

## Step 3: Push Your Code to GitHub

If your code is not already on GitHub:

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel + Supabase deployment"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/passgen.git

# Push
git push -u origin main
```

> Make sure `.env` files are **not** committed. The `.gitignore` already excludes them.

---

## Step 4: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in.

2. Click **"Import Git Repository"**.

3. Select your `passgen` repository from the list.
   - If you don't see it, click "Adjust GitHub App Permissions" to grant Vercel access.

4. Vercel will auto-detect the framework as **Next.js**. Leave the defaults:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave blank unless your code is in a subdirectory)
   - **Build Command**: Vercel will use the `vercel-build` script from `package.json` automatically via `vercel.json`

5. **Do NOT deploy yet** — first configure the environment variables (next step).

---

## Step 5: Configure Environment Variables

On the Vercel project configuration page (before first deploy) or in **Settings > Environment Variables**:

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[pass]@...pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase pooled connection (from Step 2) |
| `DIRECT_URL` | `postgresql://postgres.[ref]:[pass]@...pooler.supabase.com:5432/postgres` | Supabase direct connection (from Step 2) |
| `ENCRYPTION_KEY` | *(generate one — see below)* | Key for encrypting stored passwords |

**Generate an encryption key** by running this in your terminal:

```bash
# macOS/Linux
openssl rand -hex 32

# PowerShell (Windows)
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as the `ENCRYPTION_KEY` value.

### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `HIBP_API_KEY` | Your API key | Enable breach detection via Have I Been Pwned |
| `SMTP_HOST` | e.g. `smtp.gmail.com` | SMTP server for email alerts |
| `SMTP_PORT` | e.g. `587` | SMTP port |
| `SMTP_USER` | Your email | SMTP username |
| `SMTP_PASS` | App password | SMTP password (use app-specific passwords for Gmail) |
| `SMTP_FROM` | Sender email | "From" address on alert emails |
| `NOTIFICATION_EMAIL` | Recipient email | Where breach alerts are sent |

> **Tip:** Set environment variables for all environments (Production, Preview, Development) unless you want different values per environment.

---

## Step 6: Deploy and Verify

1. Click **"Deploy"** in Vercel.

2. Vercel will:
   - Install dependencies (`npm install`)
   - Run the build command: `prisma generate && prisma migrate deploy && next build`
   - This generates the Prisma client, applies all database migrations to your Supabase database, and builds the Next.js app

3. Wait for the build to complete (typically 1-3 minutes).

4. Once deployed, Vercel will give you a URL like `https://passgen-xxxx.vercel.app`.

5. **Verify the deployment:**
   - Open the URL in your browser
   - You should see the login/signup page
   - Create a new account to verify database connectivity
   - Try generating and saving a password

---

## Optional: Configure HIBP and Email

### Have I Been Pwned API

To enable breach detection:

1. Purchase an API key at [haveibeenpwned.com/API/Key](https://haveibeenpwned.com/API/Key) (small one-time fee).
2. Add `HIBP_API_KEY` to your Vercel environment variables.
3. Redeploy for the change to take effect.

### Email Notifications (Gmail Example)

To receive email alerts when breaches are detected:

1. **Enable 2-Step Verification** on your Google account.

2. **Generate an App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Add these environment variables in Vercel:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=your-email@gmail.com
   NOTIFICATION_EMAIL=your-email@gmail.com
   ```

4. **Redeploy** for changes to take effect.

---

## Running Migrations Manually

Migrations run automatically during every Vercel build. If you need to run them manually (e.g., to troubleshoot):

```bash
# Set the environment variables locally
export DATABASE_URL="your-pooled-connection-string"
export DIRECT_URL="your-direct-connection-string"

# Run migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Open Prisma Studio to inspect data
npx prisma studio
```

On Windows (PowerShell):

```powershell
$env:DATABASE_URL = "your-pooled-connection-string"
$env:DIRECT_URL = "your-direct-connection-string"

npx prisma migrate deploy
```

---

## Custom Domain Setup

1. In Vercel, go to your project **Settings > Domains**.

2. Add your custom domain (e.g., `passwords.yourdomain.com`).

3. Vercel will provide DNS records to configure:
   - **CNAME** record pointing to `cname.vercel-dns.com` (for subdomains)
   - **A** record pointing to `76.76.21.21` (for apex domains)

4. Add the DNS records at your domain registrar.

5. Vercel automatically provisions and renews SSL/TLS certificates.

---

## Monitoring and Logs

### Vercel Logs

- Go to your project in Vercel > **Logs** tab
- Filter by function, status code, or time range
- Serverless function logs appear here (API route errors, etc.)

### Supabase Dashboard

- Go to your Supabase project > **Table Editor** to view data
- Go to **Logs** > **Postgres** to see database query logs
- Go to **Database** > **Replication** to monitor database health

### Automated Breach Monitoring

Since Vercel is serverless, there's no persistent process to run periodic breach checks. Options:

1. **Vercel Cron Jobs** (recommended):
   Add to `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/monitor",
       "schedule": "0 2 * * *"
     }]
   }
   ```
   This calls the monitoring endpoint daily at 2 AM UTC.

2. **GitHub Actions** (alternative):
   Create `.github/workflows/monitor.yml`:
   ```yaml
   name: Breach Monitor
   on:
     schedule:
       - cron: '0 2 * * *'
   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - run: curl -X POST https://your-app.vercel.app/api/monitor
   ```

3. **External cron service**: Use services like [cron-job.org](https://cron-job.org) to hit the endpoint on a schedule.

---

## Troubleshooting

### Build fails: "prisma generate" error

**Symptom:** Build fails with Prisma client generation errors.

**Fix:** Make sure `prisma` is in your production `dependencies` (not `devDependencies`) in `package.json`. It already is in this project.

---

### Build fails: "Cannot find module '@prisma/client'"

**Symptom:** The build succeeds but the app crashes at runtime.

**Fix:** Clear the Vercel build cache:
1. Go to **Settings > General** in your Vercel project
2. Scroll to **Build & Development Settings**
3. Click **Override** next to "Install Command" and set it to `npm install && npx prisma generate`

---

### Database connection errors

**Symptom:** `Error: Can't reach database server at ...`

**Fixes:**
- Verify your `DATABASE_URL` and `DIRECT_URL` are correct in Vercel environment variables
- Make sure the password in the connection string is URL-encoded if it contains special characters (e.g., `@` becomes `%40`)
- Check that your Supabase project is not paused (free tier pauses after 1 week of inactivity)

To unpause a Supabase project:
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select the paused project
3. Click **"Restore project"**

---

### Migration errors during build

**Symptom:** `prisma migrate deploy` fails during the Vercel build.

**Fixes:**
- Check that `DIRECT_URL` is set (migrations need the direct connection, not the pooled one)
- Run `npx prisma migrate status` locally to check for drift
- If the database is out of sync, run `npx prisma migrate resolve` locally

---

### "Prepared statement already exists" or pooling errors

**Symptom:** Random database errors in production.

**Fix:** Make sure your `DATABASE_URL` includes `?pgbouncer=true` at the end. This tells Prisma to use compatible query mode with PgBouncer (Supabase's connection pooler).

---

### Environment variables not working

**Symptom:** The app can't find env vars at runtime.

**Fixes:**
- Verify the variables are set for the correct environment (Production, Preview, or Development)
- After adding/changing variables, **redeploy** — Vercel does not hot-reload env vars
- Check for typos in variable names

---

### App works locally but not on Vercel

**Symptom:** Everything works in `npm run dev` but fails after deployment.

**Fixes:**
- Make sure all required env vars are set in Vercel (they're not copied from your local `.env`)
- Check Vercel function logs for specific error messages
- Ensure you're not using any Node.js APIs that aren't available in Vercel's Edge/Serverless runtime

---

## Cost Breakdown

### Free Tier

Both Vercel and Supabase offer generous free tiers:

| Service | Free Tier Includes |
|---------|--------------------|
| **Vercel** | 100 GB bandwidth/month, serverless function executions, automatic SSL |
| **Supabase** | 500 MB database, 2 projects, 50,000 monthly active users, 1 GB file storage |

This is more than enough for personal use or small teams.

### Paid Tier (if you outgrow free)

| Service | Starting Price |
|---------|---------------|
| **Vercel Pro** | $20/month per member |
| **Supabase Pro** | $25/month per project |

---

## Redeploying After Code Changes

Once connected, Vercel automatically redeploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push origin main
# Vercel redeploys automatically
```

For preview deployments, push to any other branch or open a pull request — Vercel creates a unique preview URL for each.

---

## Next Steps

- Set up a [custom domain](#custom-domain-setup) for a professional URL
- Configure [automated breach monitoring](#automated-breach-monitoring) with Vercel Cron
- Enable [HIBP and email notifications](#optional-configure-hibp-and-email) for full breach detection
- Review the [Security Notes](../README.md#-security-features) for production hardening tips
