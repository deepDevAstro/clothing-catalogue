# Cloudinary Configuration

This project uses **Cloudinary** for image storage and optimization. Before deploying or running the app, you need to configure Cloudinary.

## ⚡ Quick Setup (5 minutes)

1. **Create free account**: https://cloudinary.com/users/register/free
2. **Get Cloud Name** from dashboard
3. **Create Upload Preset** (Settings → Upload → Add Upload Preset)
   - Name: `clothing-catalogue`
   - Signing mode: `Unsigned`
4. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=clothing-catalogue
   ```
5. **Restart dev server**: `npm run dev`
6. **Test**: Admin → Add Item → Upload image ✓

## 📖 Detailed Instructions

See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for step-by-step setup with screenshots.

## 🎯 Benefits

- **25GB/month** free storage (vs 5GB Firebase)
- **Automatic image optimization** (30-40% smaller files)
- **Global CDN** for fast delivery
- **No CORS configuration** needed
- **$0.12/GB** pricing (cheaper than Firebase at $0.18/GB)

## 🚀 What You Get

✅ Images upload instantly from admin panel
✅ Automatic format optimization (WebP for modern browsers)
✅ Responsive image delivery worldwide
✅ Production-ready with 0 configuration headaches

## 📝 Environment Variables

**Required:**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=clothing-catalogue
```

**Optional (for image deletion cleanup):**

```env
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Note: Optional variables are only needed if you want automatic cleanup when deleting items. Uploads work fine without them.

## ✅ Deployment

When deploying to production (Vercel, etc.), add the required environment variables to your hosting platform's environment settings. Same names, same values.

---

**Next**: Follow [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) if you need detailed instructions.

**Status**: Production-ready after Cloudinary setup ✓
