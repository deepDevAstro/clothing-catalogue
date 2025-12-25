# Project Architecture & Codebase Guide

Complete overview of the clothing catalogue application structure, key files, and how everything works together.

## 🏗️ System Architecture

```
User (Browser)
    ↓
Next.js Frontend (React + TypeScript)
    ├── Public Catalogue Pages
    ├── Admin Dashboard Pages
    └── API Routes
        ↓
Next.js Backend (API Routes)
    ├── Authentication (Firebase Auth)
    ├── Image Uploads (Cloudinary)
    └── Data Operations
        ↓
External Services
├── Firebase Firestore (Database)
├── Cloudinary (Image Storage & Optimization)
└── Firebase Auth (User Authentication)
```

## 📁 Directory Structure

```
src/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout (HTML, CSS, fonts)
│   ├── page.tsx                 # Public catalogue homepage
│   ├── globals.css              # Global styles
│   │
│   ├── admin/                   # Admin panel pages
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── login/
│   │   │   └── page.tsx         # Admin login form
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Inventory management dashboard
│   │   └── items/
│   │       ├── new/
│   │       │   └── page.tsx     # Create new item page
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx # Edit item page
│   │
│   ├── api/                     # Backend API routes
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts     # Firebase auth endpoint
│   │   ├── items/
│   │   │   ├── route.ts         # GET all items
│   │   │   ├── [id]/
│   │   │   │   └── route.ts     # GET/PUT/DELETE single item
│   │   │   └── upload/
│   │   │       └── route.ts     # Image upload validation
│   │   └── cloudinary/
│   │       └── delete/
│   │           └── route.ts     # Delete image from Cloudinary
│   │
│   ├── components/              # Reusable React components
│   │   ├── AdminForm.tsx        # Create/edit item form
│   │   ├── AdminSidebar.tsx     # Admin nav sidebar
│   │   ├── Cart.tsx             # Shopping cart (not active)
│   │   ├── Footer.tsx           # Footer component
│   │   ├── Header.tsx           # Header navigation
│   │   ├── ItemCard.tsx         # Product card component
│   │   ├── ItemGrid.tsx         # Product grid layout
│   │   └── WhatsAppButton.tsx   # WhatsApp floating button
│   │
│   ├── lib/                     # Utility functions
│   │   ├── firebase.ts          # Firebase initialization
│   │   ├── items.ts             # Item CRUD operations
│   │   ├── cloudinary.ts        # Cloudinary upload/delete
│   │   ├── auth.ts              # Authentication helpers
│   │   └── cache.ts             # Caching utilities
│   │
│   ├── styles/                  # CSS files
│   │   ├── admin.css            # Admin dashboard styles
│   │   ├── catalog.css          # Public catalogue styles
│   │   ├── components.css       # Component styles
│   │   └── variables.css        # CSS variables & theme
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # All type interfaces
│   │
│   └── middleware.ts            # Request/response middleware

public/                           # Static files (images, fonts, etc)
├── favicon.ico
└── ...

.env.local                        # Environment variables (local dev)
.env.example                      # Template for env variables
package.json                      # Dependencies & scripts
tsconfig.json                     # TypeScript configuration
next.config.js                    # Next.js configuration
tailwind.config.js               # Tailwind CSS configuration
README.md                         # Project overview
SETUP.md                          # One-time setup guide
```

## 🔑 Key Files & Their Purpose

### Frontend Pages

| File                                     | Purpose                                         |
| ---------------------------------------- | ----------------------------------------------- |
| `src/app/page.tsx`                       | Public catalogue - browse items, filter, search |
| `src/app/admin/login/page.tsx`           | Admin login form                                |
| `src/app/admin/dashboard/page.tsx`       | Inventory dashboard - CRUD items                |
| `src/app/admin/items/new/page.tsx`       | Create new item form                            |
| `src/app/admin/items/[id]/edit/page.tsx` | Edit item form                                  |

### Components

| Component            | Purpose                             |
| -------------------- | ----------------------------------- |
| `AdminForm.tsx`      | Reusable form for create/edit items |
| `ItemGrid.tsx`       | Grid display of products            |
| `ItemCard.tsx`       | Individual product card             |
| `Header.tsx`         | Top navigation bar                  |
| `AdminSidebar.tsx`   | Admin panel navigation              |
| `Footer.tsx`         | Footer with contact info            |
| `WhatsAppButton.tsx` | Floating WhatsApp button            |

### Libraries & Utilities

| File                | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `lib/firebase.ts`   | Firebase initialization, auth state          |
| `lib/items.ts`      | Create, read, update, delete items           |
| `lib/cloudinary.ts` | Upload images, delete images, URL management |
| `lib/auth.ts`       | Login, logout, authentication checks         |
| `lib/cache.ts`      | Client-side caching system                   |

### API Routes

| Route                    | Method | Purpose                        |
| ------------------------ | ------ | ------------------------------ |
| `/api/items`             | GET    | Fetch all items from Firestore |
| `/api/items/[id]`        | GET    | Fetch single item by ID        |
| `/api/items/[id]`        | PUT    | Update item                    |
| `/api/items/[id]`        | DELETE | Delete item and images         |
| `/api/auth/login`        | POST   | Firebase authentication        |
| `/api/cloudinary/delete` | POST   | Delete image from Cloudinary   |

## 🔄 Data Flow Examples

### Create New Item

```
1. User fills form in AdminForm.tsx
   ├── Selects primary image
   ├── uploadImageToCloudinary() called
   └── Returns Cloudinary URL

2. User adds additional images
   ├── uploadMultipleImagesToCloudinary() called
   └── Returns array of URLs

3. User clicks "Add Item"
   ├── form submits to admin/items/new/page.tsx
   ├── handleSubmit() calls createItem()
   │   ├── POST /api/items with item data
   │   └── API writes to Firestore
   └── Success message shown
```

### Edit Item

```
1. Dashboard shows item list
   ├── Fetched via getItems() from Firestore
   └── User clicks Edit

2. Edit page loads
   ├── getItemById() fetches current item
   ├── Form populated with current data
   ├── keptExistingImageUrls = current images
   └── additionalImageUrls = [] (empty)

3. User updates fields and adds new images
   ├── New images uploaded to Cloudinary
   ├── additionalImageUrls = [new1, new2]
   └── keptExistingImageUrls = [existing1, existing2]

4. User clicks "Update Item"
   ├── handleSubmit() calls updateItem()
   ├── Final imageUrls = [...kept, ...new]
   ├── PUT /api/items/[id] with merged arrays
   └── Firestore updated
```

### Delete Item

```
1. User clicks Delete in dashboard
   ├── Confirmation dialog shown
   └── User confirms

2. handleDeleteConfirmed() called
   ├── deleteItem(id) from lib/items.ts
   │   ├── getItemById(id) to fetch current data
   │   ├── Extract all image URLs
   │   ├── deleteMultipleImagesFromCloudinary(urls)
   │   │   └── POST /api/cloudinary/delete for each
   │   └── deleteDoc() from Firestore
   └── Item removed from list
```

## 🌐 External Services

### Firebase Firestore

- **Purpose**: Store item data
- **Collections**: `items`
- **Document structure**:
  ```
  {
    id: string,
    itemCode: string,
    name: string,
    category: string,
    price: number,
    description: string,
    imageUrl: string (primary),
    imageUrls: string[] (additional),
    isSold: boolean,
    createdAt: timestamp,
    updatedAt: timestamp
  }
  ```

### Cloudinary

- **Purpose**: Image upload, storage, optimization
- **Folder structure**: `clothing-catalogue/{itemId}/`
- **Transformations**: `q_auto,f_auto` (auto quality & format)
- **Features**:
  - Automatic format selection (WebP for modern, JPEG for old)
  - Automatic quality optimization (30-40% size reduction)
  - Global CDN delivery
  - Automatic deletion on item delete

### Firebase Auth

- **Purpose**: Admin authentication
- **Method**: Email/Password
- **Protected routes**: `/admin/*`
- **Middleware**: Checked in `src/app/middleware.ts`

## 🔐 Authentication Flow

```
User visits /admin/login
    ↓
LoginForm submits email/password
    ↓
POST /api/auth/login
    ├── Firebase.auth().signInWithEmailAndPassword()
    └── Returns auth token
    ↓
Token stored in browser (Firebase SDK handles)
    ↓
User redirected to /admin/dashboard
    ├── middleware.ts checks if authenticated
    ├── If yes: allow access
    └── If no: redirect to login
```

## 💾 State Management

### Client-Side State

- **React useState**: Form inputs, UI state, loading indicators
- **Firebase Auth SDK**: Handles auth state automatically
- **Custom Cache**: `lib/cache.ts` for item caching

### Server-Side State

- **Firestore**: Persistent data storage
- **Environment variables**: Config (.env.local)

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update `.env` variables in deployment platform
- [ ] Enable proper Firestore Security Rules
- [ ] Set up Firebase custom domain (if using)
- [ ] Test all features in staging environment
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up monitoring/logging
- [ ] Review sensitive data in logs
- [ ] Backup Firestore data

## 📊 Performance Considerations

1. **Image Optimization**: Cloudinary handles auto-optimization (30-40% reduction)
2. **Caching**: Custom cache system for items (5-minute TTL)
3. **Lazy Loading**: ItemGrid uses lazy loading for images
4. **Code Splitting**: Next.js automatically splits code by route
5. **Database Queries**: Indexed by itemId and category

## 🔗 Related Documentation

- [SETUP.md](./SETUP.md) - One-time setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Feature testing
- [CLOUDINARY_README.md](./CLOUDINARY_README.md) - Image storage guide

---

**Status**: ✅ Production Ready | Version: 1.0
