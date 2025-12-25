# 🚀 START HERE - Get Running in 20 Minutes

Welcome! This is your quickest path to running the app locally.

## ⚡ Prerequisites (1 minute)

Verify you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ npm 9+ (`npm --version`)
- ✅ Git (`git --version`)

## 📥 Install (2 minutes)

```bash
# Clone repo (if not done yet)
git clone <your-repo-url>
cd project-clothing-catalogue

# Install dependencies
npm install

# Verify it works
npm run build  # Should say "Compiled successfully"
```

## 🔐 Firebase Setup (5 minutes)

1. Go to: https://console.firebase.google.com
2. Create new project (or use existing)
3. Click **Settings ⚙️** → **Project Settings**
4. Scroll down, find your **Web App Config**
5. Copy your API keys

6. Create `.env.local` in project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

7. Enable in Firebase:
   - **Build** → **Firestore Database** → Create (test mode)
   - **Build** → **Authentication** → Enable Email/Password
   - Create a test user in Authentication tab

## ☁️ Cloudinary Setup (5 minutes)

1. Go to: https://cloudinary.com → Sign up (free)
2. Copy your **Cloud Name**
3. Go to **Settings** → **Upload** → Add Upload Preset
   - Name: `clothing-catalogue`
   - Signing Mode: `Unsigned`
   - Save

4. Add to `.env.local`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=clothing-catalogue
```

## ▶️ Run It! (1 minute)

```bash
npm run dev
# Opens: http://localhost:3000
```

## ✅ Test It Works (5 minutes)

1. **Public page**: http://localhost:3000
   - Should show empty catalogue
   
2. **Admin login**: http://localhost:3000/admin/login
   - Use your Firebase test user credentials
   - Should log in successfully

3. **Create item**: Dashboard → Add Item
   - Select image → should upload
   - Fill form → click Add Item
   - Should see success message

## 🎯 Next Steps

- Read [DOCS.md](./DOCS.md) for what file to read when
- Explore the code in `src/` directory
- See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for feature testing
- See [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to go live

## 🆘 Stuck?

Check these in order:
1. [SETUP.md - Troubleshooting](./SETUP.md#troubleshooting)
2. [CLOUDINARY_QUICK_START.md - Quick Fixes](./CLOUDINARY_QUICK_START.md#quick-fixes)
3. Browser console (F12 → Console tab)
4. Firebase Console → Firestore → Data

---

**You're done! 🎉 Start coding!**

**Full documentation**: [DOCS.md](./DOCS.md)
