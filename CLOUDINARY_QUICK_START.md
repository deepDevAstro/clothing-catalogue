# Cloudinary Setup - Quick Reference

## ⚡ 5-Minute Setup

### Step 1: Sign Up (2 min)

```
Go to: https://cloudinary.com
Sign Up → Free Plan → Verify Email
```

### Step 2: Get Cloud Name (1 min)

```
Dashboard: Copy "Cloud Name"
Add to .env.local:
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Step 3: Create Upload Preset (2 min)

```
Settings → Upload → Add Upload Preset
Preset name: clothing-catalogue
Signing mode: Unsigned ⚠️
Add to .env.local:
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=clothing-catalogue
```

### Step 4: Restart & Test

```bash
npm run dev
# Go to Admin → Add Item
# Select image → Should upload automatically ✓
```

## 🔑 Environment Variables

### Required (to get uploads working)

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

### Optional (for image deletion)

```env
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## 📊 By The Numbers

| Feature        | Firebase   | Cloudinary |
| -------------- | ---------- | ---------- |
| Free/Month     | 5GB        | 25GB       |
| Price/GB       | $0.18      | $0.12      |
| Auto-Optimize  | No         | Yes        |
| Size Reduction | ~10%       | ~35%       |
| CORS           | ⚠️ Complex | ✅ None    |
| Your Usage     | ~200MB/mo  | ~200MB/mo  |
| Cost           | FREE       | FREE       |

## 🎯 Upload Flow

```
Select Image (FormData)
    ↓
uploadImageToCloudinary()
    ↓
POST to Cloudinary API
    ↓
Cloudinary optimizes
    ↓
Returns URL
    ↓
Save URL to Firestore
    ↓
Show Success ✓
```

## 🐛 Quick Fixes

| Issue                          | Fix                                                                 |
| ------------------------------ | ------------------------------------------------------------------- |
| "Cloud Name not configured"    | Add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to `.env.local` and restart |
| "Upload Preset not configured" | Add `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` and check preset exists  |
| Upload doesn't start           | Check browser console (F12) for errors                              |
| Slow uploads                   | Normal first time (Cloudinary optimizes). Second upload faster.     |
| Images don't appear            | Check Firestore - should have `https://res.cloudinary.com/...` URLs |

## 📁 What Changed

### New Files

- `src/lib/cloudinary.ts` - Upload/delete utilities
- `src/app/api/cloudinary/delete/route.ts` - Delete endpoint

### Modified Files

- `src/components/AdminForm.tsx` - Now uses Cloudinary
- `.env.local` - Added Cloudinary credentials

### Documentation

- `CLOUDINARY_SETUP.md` - Detailed setup guide
- `CLOUDINARY_MIGRATION_SUMMARY.md` - Technical summary
- `CLOUDINARY_INTEGRATION_GUIDE.md` - Complete guide

## ✅ Checklist

- [ ] Account created at cloudinary.com
- [ ] Cloud Name copied to `.env.local`
- [ ] Upload preset created with "Unsigned" mode
- [ ] Preset name in `.env.local`
- [ ] Server restarted (`npm run dev`)
- [ ] Test upload works
- [ ] Form submit successful
- [ ] Firestore shows Cloudinary URLs

## 🚀 Ready!

Once setup complete:

- Images upload instantly
- Automatic optimization (35% smaller)
- 25GB free per month
- Global CDN delivery
- No CORS issues

## 📞 Need Help?

Read: `CLOUDINARY_SETUP.md` (step-by-step with screenshots)

---

**Status**: Code ✅ | Setup ⏳ | Ready to Deploy 🚀
