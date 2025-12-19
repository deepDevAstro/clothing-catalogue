# Quick Start Guide

## 1️⃣ Setup (5 minutes)

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Firebase credentials
```

## 2️⃣ Firebase Configuration (2 minutes)

1. Go to https://console.firebase.google.com
2. Create new project
3. Enable Firestore Database
4. Enable Cloud Storage
5. Enable Authentication → Email/Password
6. Copy config to `.env.local`

## 3️⃣ Apply Security Rules (1 minute)

**Firestore Rules** (Database → Rules tab):
Copy content from `firestore.rules` file → Publish

**Storage Rules** (Storage → Rules tab):
Copy content from `storage.rules` file → Publish

## 4️⃣ Run Locally (1 minute)

```bash
npm run dev
```

Open http://localhost:3001

## 5️⃣ Create Admin Account (1 minute)

1. Go to http://localhost:3001/admin/login
2. Sign up with your email
3. That's it! You're admin.

## 6️⃣ Test Features (2 minutes)

- **Public**: Browse items at http://localhost:3001
- **Admin**: Add item at http://localhost:3001/admin/dashboard
- **Upload**: Test image upload
- **Search**: Search by name or code
- **Filter**: Filter by category

## 7️⃣ Deploy (varies)

### Vercel

```bash
vercel
```

### Firebase

```bash
firebase deploy
```

---

**Total time: ~15 minutes from zero to running**

See README.md for detailed setup and DEPLOYMENT.md for deployment options.
