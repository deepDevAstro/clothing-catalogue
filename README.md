# Clothing Catalogue Application

Production-ready full-stack clothing management system with public browsing and secure admin panel.

## ✨ Features

### Public Side
- Browse clothing items in responsive grid
- Filter by category (Men, Women, Kids, Accessories)
- Search by name or item code
- WhatsApp integration for inquiries
- Item availability status
- Mobile-optimized UI

### Admin Panel
- Secure email/password authentication
- Create, read, update, delete items
- Image upload with validation
- Mark items as sold
- Real-time database sync

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Next.js 14 |
| Styling | Tailwind CSS + Lucide Icons |
| Backend | Next.js API Routes |
| Database | Firebase Firestore |
| Storage | Firebase Cloud Storage |
| Auth | Firebase Authentication |
| Deployment | Vercel / Netlify |

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Public catalogue
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── items/
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   └── api/
│       ├── auth/login/route.ts
│       └── items/
│           ├── route.ts
│           ├── [id]/route.ts
│           └── upload/route.ts
├── components/
│   ├── AdminForm.tsx
│   ├── ItemCard.tsx
│   ├── ItemGrid.tsx
│   └── ConfirmDialog.tsx
├── lib/
│   ├── firebase.ts
│   ├── auth.ts
│   ├── items.ts
│   └── helpers.ts
└── types/
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase account (free tier works)
- Git

### Installation

1. **Clone & Install**
```bash
git clone <repository-url>
cd clothing-catalogue
npm install
```

2. **Firebase Setup**
   - Go to https://console.firebase.google.com
   - Create new project
   - Enable **Firestore Database** (Start in Test Mode)
   - Enable **Cloud Storage**
   - Enable **Authentication** → Email/Password provider
   - Copy Firebase config

3. **Environment Configuration**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_WHATSAPP_PHONE=+919814869063
```

4. **Apply Firebase Security Rules**

**Firestore Rules** (Database → Rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{document=**} {
      allow read, write: if request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
  }
}
```

**Storage Rules** (Storage → Rules):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /items/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

Click **Publish** for both.

5. **Run Development Server**
```bash
npm run dev
```
Open http://localhost:3001

## 🔐 Admin Account

1. Navigate to http://localhost:3001/admin/login
2. Sign up with email: `admin@example.com` (or your configured NEXT_PUBLIC_ADMIN_EMAIL)
3. Create password
4. You're logged in!

## 📡 API Endpoints

### Items
- `GET /api/items` - List all items
- `POST /api/items` - Create item (auth required)
- `PUT /api/items/[id]` - Update item (auth required)
- `DELETE /api/items/[id]` - Delete item (auth required)

### Upload
- `POST /api/items/upload` - Upload image (auth required)
  - Max 5MB
  - Format: JPEG, PNG, WebP
  - Returns signed download URL

### Auth
- `POST /api/auth/login` - Login endpoint

## 🏗️ Build & Deployment

### Build
```bash
npm run build
```

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

### Docker
```bash
docker build -t clothing-catalogue .
docker run -p 3001:3001 clothing-catalogue
```

## 📝 Development Commands

```bash
npm run dev       # Start dev server (port 3001)
npm run build     # Production build
npm start         # Start production server
npm run lint      # Run ESLint
```

## 🐛 Troubleshooting

### Permission Denied
```
"Missing or insufficient permissions"
```
**Solution**: Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R) after applying rules

### Upload Fails (404)
```
"Firebase upload error: 404"
```
**Solution**: Ensure auth token is included. Check user is logged in as admin.

### Firestore Connection Error
```
"undefined is not an object (evaluating 'app.container.getProvider')"
```
**Solution**: Verify `.env.local` has all Firebase credentials

### Port 3000 Already in Use
Dev server automatically uses port 3001

## 🔒 Security

- ✅ Auth token required for all admin operations
- ✅ Firestore rules restrict write access to authenticated users
- ✅ Storage rules enforce file type and size limits
- ✅ Email/password authentication
- ✅ Server-side image upload validation

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tested on iOS & Android
- ✅ Tablet optimized
- ✅ Touch-friendly UI

## 🚀 Performance

- Next.js 14 with App Router
- Image optimization
- Firestore real-time sync
- Server-side rendering
- Automatic code splitting

## 📄 License

MIT

## 📞 Support

For issues or questions, check the troubleshooting section above.
