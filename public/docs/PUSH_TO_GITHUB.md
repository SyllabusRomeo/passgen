# Pushing to GitHub

## Authentication Required

The code has been committed locally but needs authentication to push to GitHub.

## Option 1: Use Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name (e.g., "passgen-repo")
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push using the token:**
   ```bash
   git push -u origin main
   ```
   - When prompted for username: enter your GitHub username
   - When prompted for password: paste your personal access token

## Option 2: Use SSH (More Secure)

1. **Switch to SSH remote:**
   ```bash
   git remote set-url origin git@github.com:SyllabusRomeo/passgen.git
   ```

2. **Set up SSH key** (if not already done):
   ```bash
   # Check if you have an SSH key
   ls -la ~/.ssh/id_*.pub
   
   # If not, generate one:
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Add to SSH agent
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   
   # Copy public key
   cat ~/.ssh/id_ed25519.pub
   ```

3. **Add SSH key to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key
   - Click "Add SSH key"

4. **Push:**
   ```bash
   git push -u origin main
   ```

## Option 3: Use GitHub CLI

1. **Install GitHub CLI** (if not installed):
   ```bash
   brew install gh
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   ```

3. **Push:**
   ```bash
   git push -u origin main
   ```

## Quick Push Command

After setting up authentication, run:
```bash
git push -u origin main
```

## What Was Committed

✅ All application code
✅ Docker configuration
✅ Documentation (README, QUICKSTART, DOCKER.md)
✅ API routes and components
✅ Database schema and migrations
✅ Configuration files

❌ NOT committed (protected by .gitignore):
- `.env*` files (sensitive credentials)
- `node_modules/` (dependencies)
- `.next/` (build cache)
- Database files (`*.db`)
- Generated Prisma client

