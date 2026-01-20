# Wishlist Travel - Production Deployment Guide

This guide walks you through deploying the Wishlist Travel application to production.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │────▶│     Railway     │────▶│    Supabase     │
│   (Frontend)    │     │    (Backend)    │     │   (Database)    │
│   Angular 17    │     │    NestJS       │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Prerequisites

- GitHub account (to connect repositories)
- Accounts on: [Supabase](https://supabase.com), [Railway](https://railway.app), [Vercel](https://vercel.com)

---

## Step 1: Set Up Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **"New Project"**
3. Fill in:
   - **Name:** `wishlist-travel`
   - **Database Password:** Generate a strong password (SAVE THIS!)
   - **Region:** Choose closest to your users
4. Wait for the project to be created
5. Go to **Settings → Database**
6. Copy the connection details:
   - Host: `db.xxxxxxxxxxxx.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: (the one you created)

### Alternative: Neon (Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Create a project
3. Copy the connection string

---

## Step 2: Deploy Backend (Railway)

### 2.1 Push Code to GitHub

```bash
# In the project root directory
cd /Users/rohitlama/Desktop/Proj/Wishlist_Travel

# Initialize git if not already done
git init
git add .
git commit -m "Prepare for production deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/wishlist-travel.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `wishlist-travel` repository
4. Railway will auto-detect the Dockerfile in `/backend`
5. Set the **Root Directory** to `backend`

### 2.3 Configure Environment Variables

In Railway, go to your project → **Variables** tab and add:

```
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres
DB_SSL=true
JWT_SECRET=generate-a-64-character-random-string-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Generate JWT Secret:**
```bash
openssl rand -base64 64
```

### 2.4 Get Your Backend URL

After deployment, Railway gives you a URL like:
`https://wishlist-travel-production.up.railway.app`

**Save this URL!** You'll need it for the frontend.

---

## Step 3: Seed the Production Database

After the backend is deployed, you need to seed the database with countries and cities.

### Option A: Run seed from your local machine

```bash
cd backend

# Create a temporary .env with production values
cat > .env.prod << EOF
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres
DB_SSL=true
NODE_ENV=production
EOF

# Run seed with production env
NODE_ENV=production npx ts-node src/database/seed.ts
```

### Option B: Use Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run the seed command
railway run npm run seed
```

---

## Step 4: Deploy Frontend (Vercel)

### 4.1 Update the API URL

Edit `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-RAILWAY-URL.railway.app/api'  // Replace with your Railway URL
};
```

Commit and push this change:
```bash
git add .
git commit -m "Update production API URL"
git push
```

### 4.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `wishlist-travel` repository
4. Configure:
   - **Framework Preset:** Angular
   - **Root Directory:** `frontend`
   - **Build Command:** `ng build --configuration=production`
   - **Output Directory:** `dist/frontend/browser`
5. Click **Deploy**

### 4.3 Get Your Frontend URL

Vercel gives you a URL like:
`https://wishlist-travel.vercel.app`

---

## Step 5: Update CORS (Important!)

Go back to Railway and update the `FRONTEND_URL` environment variable:

```
FRONTEND_URL=https://wishlist-travel.vercel.app
```

Railway will automatically redeploy.

---

## Step 6: Set Up Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to your project → **Settings → Domains**
2. Add your domain (e.g., `wishlisttravel.com`)
3. Update DNS records as instructed

### For Railway (Backend):
1. Go to your project → **Settings → Networking**
2. Add custom domain (e.g., `api.wishlisttravel.com`)
3. Update DNS records as instructed

Then update:
- Frontend `environment.prod.ts`: `apiUrl: 'https://api.wishlisttravel.com/api'`
- Backend `FRONTEND_URL`: `https://wishlisttravel.com`

---

## Deployment Checklist

- [ ] Database created on Supabase/Neon
- [ ] Backend deployed to Railway
- [ ] Environment variables configured in Railway
- [ ] Database seeded with countries/cities
- [ ] Frontend deployed to Vercel
- [ ] API URL updated in frontend
- [ ] CORS configured with frontend URL
- [ ] Test login/register functionality
- [ ] Test creating destinations
- [ ] (Optional) Custom domain configured

---

## Troubleshooting

### "CORS error" in browser
- Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Make sure there's no trailing slash

### "Database connection failed"
- Check `DB_SSL=true` is set
- Verify database credentials are correct
- Check if database allows external connections

### "502 Bad Gateway" on Railway
- Check Railway logs for errors
- Ensure `PORT` is not set (Railway sets it automatically)
- Verify the build completed successfully

### Frontend shows blank page
- Check browser console for errors
- Verify `apiUrl` in environment.prod.ts is correct
- Make sure the build output directory is correct

---

## Cost Estimate (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Supabase | 500MB DB, 1GB bandwidth | $25/mo |
| Railway | $5 credit/month | ~$5-10/mo |
| Vercel | 100GB bandwidth | $20/mo |

**Total for small-medium traffic: $0-35/month**

---

## Security Reminders

1. Never commit `.env` files to git
2. Use strong, unique passwords
3. Rotate JWT secret periodically
4. Enable 2FA on all platforms
5. Set up database backups (Supabase does this automatically)
