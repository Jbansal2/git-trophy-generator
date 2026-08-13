# Deployment Guide

This is a **Deno application** and requires a Deno-compatible runtime.

## ✅ Recommended: Deno Deploy (Official & Free)

Deno Deploy is the official hosting platform for Deno applications.

### Steps:

1. **Sign up**: Go to https://deno.com/deploy
2. **Connect GitHub**: Link your GitHub account
3. **Create Project**: 
   - Click "New Project"
   - Select repository: `git-trophy-generator`
   - Entry point: `server.ts`
   - Click "Deploy"

4. **Add Environment Variable**:
   - Go to Project Settings
   - Add `GITHUB_TOKEN` with your token value

5. **Done!** Your app will be live at: `https://your-project.deno.dev`

### Automatic Deployments

The GitHub Actions workflow `.github/workflows/deploy-deno.yml` is already configured for automatic deployments on push to `main`.

To enable it:
1. Go to https://dash.deno.com/projects/your-project/settings
2. Copy your project name
3. Update the workflow file with your project name
4. Push to main branch

---

## 🐳 Docker Deployment

### Option 1: Docker Hub / GitHub Container Registry

Already configured! Just push your Docker image:

```bash
docker build -t your-username/git-trophy-generator .
docker push your-username/git-trophy-generator
```

### Option 2: Any VPS (AWS, DigitalOcean, etc.)

```bash
# Clone repo
git clone https://github.com/Jbansal2/git-trophy-generator.git
cd git-trophy-generator

# Setup environment
cp .env.example .env
# Edit .env with your GITHUB_TOKEN

# Run with Docker Compose
docker-compose up -d
```

---

## 🚀 Alternative Platforms

### Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `git-trophy-generator`
4. Add environment variable: `GITHUB_TOKEN`
5. Deploy!

### Render

1. Go to https://render.com
2. Create "New Web Service"
3. Connect repository
4. **Important**: Select "Docker" as environment (not Node.js!)
5. Add environment variable: `GITHUB_TOKEN`
6. Deploy

### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Create app
flyctl launch

# Set environment variable
flyctl secrets set GITHUB_TOKEN=your_token_here

# Deploy
flyctl deploy
```

---

## ❌ NOT Compatible

These platforms **do NOT support Deno**:

- ❌ **Vercel** - Node.js only (Deno imports won't work)
- ❌ **Netlify** - Node.js only
- ❌ **Heroku** - Requires buildpack (complex setup)

---

## 🎯 Recommended: Deno Deploy

**Why Deno Deploy?**
- ✅ Free tier available
- ✅ Native Deno support (no configuration needed)
- ✅ Global edge network
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Environment variables support
- ✅ Zero cold starts

**Pricing**: Free for hobby projects, $10/month for pro features.

---

## 🔧 Post-Deployment

After deploying, update your README.md with your production URL:

```markdown
![GitHub Trophy](https://your-app.deno.dev/trophy?username=torvalds)
```

**Test your deployment**:
```
https://your-app.deno.dev/health
https://your-app.deno.dev/trophy?username=torvalds
```
