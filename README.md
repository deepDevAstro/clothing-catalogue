# Clothing Catalogue Application

Production-ready full-stack clothing management system with public browsing and secure admin panel.

**✅ Status:** Production Ready | **Version:** 1.0 | **License:** MIT

## 📖 Documentation

Start here based on your needs:

| Document                      | Purpose                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| **CLOUDINARY_README.md**      | 🔥 **MUST READ FIRST** - Configure Cloudinary image storage |
| **CLOUDINARY_SETUP.md**       | Detailed Cloudinary setup with step-by-step guide           |
| **CLOUDINARY_AUTO_DELETE.md** | Auto-deletion of images when items are deleted              |
| **CLOUDINARY_QUICK_START.md** | Quick reference for Cloudinary setup and troubleshooting    |
| **DEPLOYMENT.md**             | Production deployment (Vercel, Firebase, environment setup) |
| **TESTING_GUIDE.md**          | Testing features locally and in production                  |

## ✨ Features

### Public Side

- Browse clothing items in responsive grid
- Filter by category (Men, Women, Kids, Accessories)
- Search by name or item code
- WhatsApp integration for inquiries
- Item availability status
- Mobile-optimized UI
- Real-time cart management

### Admin Panel

- Secure email/password authentication
- Create, read, update, delete items
- Image upload with auto-compression (70-80% reduction)
- Edit items (add/remove images safely)
- Mark items as sold/available
- Real-time database sync
- Inventory dashboard

## 🛠️ Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Frontend   | React 18 + TypeScript + Next.js 14               |
| Styling    | Tailwind CSS + Lucide Icons                      |
| Backend    | Next.js API Routes                               |
| Database   | Firebase Firestore (free tier)                   |
| Storage    | **Cloudinary** (25GB/month free, auto-optimized) |
| Auth       | Firebase Authentication                          |
| Deployment | Vercel (recommended)                             |

## 🚀 Quick Start

### ⚠️ IMPORTANT: Configure Cloudinary First!

Before running the app, you **MUST** configure Cloudinary:

**See [CLOUDINARY_README.md](./CLOUDINARY_README.md)** (5-minute setup)

### Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see SETUP.md for details)
cp .env.example .env.local
# Add Firebase & Cloudinary credentials

# 3. Start development
npm run dev
# Open http://localhost:3000

# 4. Admin login
# URL: http://localhost:3000/admin/login
```

**Complete setup guide:** See [SETUP.md](./SETUP.md) (one-time configuration)

## 📁 Project Structure

```
src/
├── app/                        # Next.js 14 App Router
│   ├── page.tsx               # Public catalogue
│   ├── admin/
│   │   ├── login/             # Admin authentication
│   │   ├── dashboard/         # Inventory management
│   │   └── items/
│   │       ├── new/           # Create item
│   │       └── [id]/edit/     # Edit item
│   └── api/
│       ├── auth/login         # Firebase login endpoint
│       └── items/upload       # Image validation
├── components/                # React components
│   ├── AdminForm.tsx          # Create/edit form
│   ├── CartModal.tsx          # Shopping cart + checkout
│   ├── ItemCard.tsx           # Product display
│   ├── ItemGrid.tsx           # Responsive grid
│   ├── ProductModal.tsx       # Detail view
│   └── ErrorState.tsx         # Error UI
├── contexts/                  # State management
│   └── CartContext.tsx        # Shopping cart (React Context)
├── lib/
│   ├── firebase.ts            # Firebase config
│   ├── auth.ts                # Authentication
│   ├── items.ts               # CRUD operations
│   ├── imageCompression.ts    # Image optimization
│   └── helpers.ts             # Utilities
├── types/
│   └── index.ts               # TypeScript interfaces
└── styles/
    └── globals.css            # Global styles
```

## 🔧 Configuration

### Firebase Setup

1. Create project at https://console.firebase.google.com
2. Enable Firestore Database (start in test mode)
3. Enable Authentication (Email/Password)
4. Copy Web API credentials

### Environment Variables

```env
# Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_WHATSAPP_PHONE=+919814869063
```

See [DOCUMENTATION.md](DOCUMENTATION.md#setup) for detailed setup instructions.

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel
# Follow prompts to connect GitHub repository
# Add environment variables in Vercel dashboard
```

### Firebase Hosting

```bash
npm run build
firebase deploy
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📊 Image Handling

### Compression Strategy

- **Technology:** Canvas API (client-side)
- **Format:** JPEG at 60% quality
- **Reduction:** 70-80% smaller than original
- **Storage:** Compressed Base64 in Firestore
- **Benefit:** Free tier compatible, no Firebase Storage needed
- **Limit:** ~700KB per document (safety threshold)

### How It Works

1. User selects image in admin panel
2. Browser compresses using Canvas API
3. API validates compression
4. Base64 stored directly in Firestore
5. Public page loads images directly

## 🛡️ Security

- **Authentication:** Firebase email/password
- **Admin Access:** Email whitelist
- **Database Rules:** Firestore security rules enforce access
- **Images:** Base64 encoded, no external URLs
- **Environment:** Secrets in .env (not committed)

## 🐛 Troubleshooting

### Common Issues

**Build fails with module not found**

```bash
npm install
```

**Firebase authentication fails**

- Verify .env.local has correct credentials
- Check Firebase project ID in Web config
- Ensure Authentication is enabled

**Images not showing**

- Check browser console for errors
- Verify compression succeeded
- Try uploading again

**WhatsApp link doesn't work**

- Use international phone format: `+919814869063`
- Remove spaces/dashes (automatically handled)
- Test on different browser

See [DOCUMENTATION.md](DOCUMENTATION.md#troubleshooting) for more solutions.

## 📈 Performance

- **Next.js 14:** Latest optimization features
- **Image Compression:** 70-80% size reduction
- **Code Splitting:** Automatic per route
- **CSS:** Tailwind tree-shaking
- **Build Size:** < 300KB JavaScript

## ✅ Production Checklist

Before deploying:

- [ ] All environment variables configured
- [ ] Firebase security rules set
- [ ] Admin email verified
- [ ] Test admin login
- [ ] Test item creation with images
- [ ] Test public catalogue
- [ ] Test cart and checkout
- [ ] Run `npm run build` (zero errors)
- [ ] Test on mobile device

## 🤝 Support

For detailed guidance:

1. Read [DOCUMENTATION.md](DOCUMENTATION.md) first
2. Check [QUICKSTART.md](QUICKSTART.md) for setup
3. Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment
4. Check browser/Firebase console logs

## 📝 License

MIT - Feel free to use for personal or commercial projects

---

**Last Updated:** December 23, 2025 | **Status:** ✅ Production Ready

│ ├── route.ts
│ ├── [id]/route.ts
│ └── upload/route.ts
├── components/
│ ├── AdminForm.tsx
│ ├── ItemCard.tsx
│ ├── ItemGrid.tsx
│ └── ConfirmDialog.tsx
├── lib/
│ ├── firebase.ts
│ ├── auth.ts
│ ├── items.ts
│ └── helpers.ts
└── types/
└── index.ts

````

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
````

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
