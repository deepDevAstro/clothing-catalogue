# Project Setup Guide - One-Time Configuration

This guide covers all one-time setup required for developers to run the clothing catalogue app locally or deploy to production.

## Prerequisites

- **Node.js** 18+ (check: `node --version`)
- **npm** 9+ (check: `npm --version`)
- **Git** (for cloning repository)
- **Firebase Account** (free tier: console.firebase.google.com)
- **Cloudinary Account** (free tier: cloudinary.com)

## 1️⃣ Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd project-clothing-catalogue

# Install dependencies
npm install

# Verify installation
npm run build  # Should complete with 0 errors
```

## 2️⃣ Firebase Setup (Database & Auth)

### Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing
3. Go to **Settings** → **Project Settings**
4. Scroll to "Your apps" → Click **Web app icon**
5. Copy the config object:

```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### Add to Environment File

Create `.env.local` in project root:

```bash
# Firebase Config (copy from step above)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Admin credentials (create a test user in Firebase Auth)
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=secure-password-here
```

### Enable Services in Firebase

1. **Firestore Database**

   - Go to **Build** → **Firestore Database**
   - Click **Create Database**
   - Choose **Start in test mode** (for development)
   - Location: Choose closest to you
   - Click **Create**

2. **Authentication**

   - Go to **Build** → **Authentication**
   - Click **Get Started**
   - Enable **Email/Password** provider
   - Click **Save**

3. **Create Admin User**
   - In Authentication tab, click **Add user**
   - Email: (your admin email)
   - Password: (secure password)
   - Click **Add user**

## 3️⃣ Cloudinary Setup (Image Storage & Optimization)

### Create Account & Get Credentials

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for **Free Plan**
3. Go to **Dashboard**
4. Copy your **Cloud Name** (e.g., `djkxyz123`)

### Create Upload Preset

1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets** → Click **Add upload preset**
3. Enter preset name: `clothing-catalogue`
4. Set **Signing Mode** to `Unsigned` ⚠️ (important for client-side uploads)
5. Click **Save**

### Add to Environment File

Add these to `.env.local`:

```bash
# Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=clothing-catalogue

# Optional: For image deletion (backend only)
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Where to find API Key/Secret:**

- Settings → **API Keys** section
- Copy **API Key** and **API Secret**

## 4️⃣ Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### First-Time Testing

1. **Public Catalogue**: http://localhost:3000

   - Should show empty catalogue
   - Try WhatsApp button (opens WhatsApp)

2. **Admin Login**: http://localhost:3000/admin/login

   - Email: (your admin email)
   - Password: (your admin password)
   - Should log in successfully

3. **Add Item**: Dashboard → **Add Item**

   - Select primary image → Should upload to Cloudinary
   - Add additional images → Should upload automatically
   - Fill form details
   - Click **Add Item**
   - Should see success message

4. **Verify in Firestore**
   - Go to Firebase Console
   - Firestore Database → **items** collection
   - Should see new item with Cloudinary URLs (starting with `https://res.cloudinary.com/...`)

## 5️⃣ Optional: Add Admin Credentials

To avoid hardcoding credentials, create a `.env.local` entry for admin credentials (used in tests):

```bash
# Admin test user
ADMIN_EMAIL=test@example.com
ADMIN_PASSWORD=Test@123456
```

These are used for automated testing but not required for local development.

## 📋 Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned and `npm install` completed
- [ ] Firebase project created
- [ ] Firebase config added to `.env.local`
- [ ] Firestore Database enabled
- [ ] Authentication enabled with Email/Password
- [ ] Admin user created in Firebase Auth
- [ ] Cloudinary free account created
- [ ] Cloud Name added to `.env.local`
- [ ] Upload preset "clothing-catalogue" created and configured
- [ ] `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` added to `.env.local`
- [ ] `.env.local` file created with all variables
- [ ] `npm run dev` starts successfully
- [ ] Can log into admin panel
- [ ] Can upload image successfully
- [ ] Item appears in Firestore with Cloudinary URLs

## 🚀 Next Steps

1. **Read Documentation**

   - [CLOUDINARY_README.md](./CLOUDINARY_README.md) - Cloudinary overview
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to production
   - [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Feature testing

2. **Customize**

   - Edit site title in `src/app/layout.tsx`
   - Update business info in `src/components/Footer.tsx`
   - Customize colors in `src/styles/globals.css`

3. **Deploy**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel setup
   - Add same `.env.local` variables to deployment platform

## ⚠️ Important Notes

### Security

- **Never** commit `.env.local` to git (already in `.gitignore`)
- **Never** share API keys or secrets
- Use Firebase Security Rules in production (not test mode)
- Restrict Cloudinary API secret to backend only

### Firebase Firestore Rules (Production)

Before deploying, set up proper security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access
    match /items/{document=**} {
      allow read: if true;
      allow write: if false;  // Disallow direct client writes
    }

    // API routes can write (if using service account)
    match /admin/{document=**} {
      allow read, write: if false;  // Only server-side access
    }
  }
}
```

### Free Tier Limits

| Service    | Limit      | Your Usage   | Cost |
| ---------- | ---------- | ------------ | ---- |
| Firebase   | 50K reads  | ~1K/month    | FREE |
| Firestore  | 1GB        | ~100MB/month | FREE |
| Cloudinary | 25GB/month | ~200MB/month | FREE |

## 🆘 Troubleshooting

| Issue                             | Solution                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| "Firebase API Key not configured" | Check `.env.local` has `NEXT_PUBLIC_FIREBASE_API_KEY`                                 |
| "Cannot login to admin"           | Verify user exists in Firebase Auth, password is correct                              |
| "Image upload fails"              | Check Cloudinary Cloud Name and Upload Preset in `.env.local`                         |
| "No images appear"                | Verify Cloudinary URLs in Firestore (should start with `https://res.cloudinary.com/`) |
| `npm run dev` fails               | Delete `node_modules`, run `npm install` again                                        |

## 📞 Support

- **Firebase Issues**: https://firebase.google.com/docs
- **Cloudinary Issues**: https://cloudinary.com/documentation
- **Next.js Issues**: https://nextjs.org/docs

---

**Status**: ✅ Production Ready | Version: 1.0
