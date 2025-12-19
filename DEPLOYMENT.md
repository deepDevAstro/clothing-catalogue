# Deployment Guide

## Production Build

```bash
npm run build
npm start
```

## Vercel (Recommended - Free)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy via Vercel Dashboard

- Go to https://vercel.com
- Click "New Project"
- Import from Git
- Select your repository
- Set Environment Variables:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  NEXT_PUBLIC_FIREBASE_PROJECT_ID
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  NEXT_PUBLIC_FIREBASE_APP_ID
  NEXT_PUBLIC_ADMIN_EMAIL
  NEXT_PUBLIC_WHATSAPP_PHONE
  ```
- Click Deploy

### 3. Via CLI

```bash
npm install -g vercel
vercel
# Follow prompts
```

## Firebase Hosting

### 1. Setup

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

### 2. Build & Deploy

```bash
npm run build
firebase deploy
```

## Environment Variables (Production)

Set these in your hosting platform:

| Variable                                 | Example                 |
| ---------------------------------------- | ----------------------- |
| NEXT_PUBLIC_FIREBASE_API_KEY             | AIzaSyB...              |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         | project.firebaseapp.com |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID          | project-id              |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      | project.appspot.com     |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | 123456789               |
| NEXT_PUBLIC_FIREBASE_APP_ID              | 1:123:web:abc           |
| NEXT_PUBLIC_ADMIN_EMAIL                  | admin@example.com       |
| NEXT_PUBLIC_WHATSAPP_PHONE               | +919814869063           |

## Monitoring

- Vercel: https://vercel.com/dashboard
- Firebase: https://console.firebase.google.com
- Analytics: Built-in via Next.js

## Rollback

### Vercel

- Click "Deployments" tab
- Select previous deployment
- Click "Promote to Production"

### Firebase

```bash
firebase hosting:channel:deploy preview
```

## Troubleshooting

**Build fails**: Check environment variables are set
**API errors**: Verify Firebase rules are published
**Slow loads**: Check Firebase quota usage
