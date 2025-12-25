# Cloudinary Setup Guide

## Step 1: Create a Free Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click **Sign Up** for free
3. Complete the registration (email verification required)
4. You'll be logged into your Cloudinary dashboard

## Step 2: Get Your Cloud Name

1. On the Cloudinary dashboard, you'll see your **Cloud Name** prominently displayed at the top
2. Copy it and update `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   ```

## Step 3: Create an Upload Preset

1. In Cloudinary dashboard, go to **Settings** → **Upload** tab
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Fill in:
   - **Preset name**: `clothing-catalogue` (or your preferred name)
   - **Signing mode**: Set to **Unsigned** (important for free tier)
   - Click **Save**
5. Copy the preset name and update `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
   ```

## Step 4: Get API Credentials (Optional - For Image Deletion)

If you want to enable automatic cleanup of deleted images:

1. Go to **Settings** → **Account** tab
2. Scroll to **API Key** and **API Secret**
3. Copy both values and add to `.env.local`:
   ```
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   > **Security Note**: `CLOUDINARY_API_SECRET` should NEVER be exposed in frontend code. It's only used in the `/api/cloudinary/delete` route on the backend.

## Step 5: Verify Environment Variables

Your `.env.local` should now have:

```dotenv
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=clothing-catalogue
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note**: Variables starting with `NEXT_PUBLIC_` are exposed to the browser (safe for public info). Backend-only variables like `CLOUDINARY_API_SECRET` are never sent to the client.

## Step 6: Test the Setup

1. Start your dev server: `npm run dev`
2. Navigate to **Admin** → **Add Item**
3. Try uploading an image
4. If it uploads successfully, you're all set! ✅

## How It Works

### Image Upload Flow

1. **Client-side Upload**: Images are uploaded directly from your browser to Cloudinary

   - Uses unsigned upload (no API key needed on frontend)
   - Happens in `src/lib/cloudinary.ts` → `uploadImageToCloudinary()`
   - Cloudinary automatically optimizes images (30-40% smaller)
   - Returns optimized URL with automatic format selection (`q_auto,f_auto`)

2. **URL Storage**: Cloudinary URLs are saved to Firestore
   - Much smaller than base64 (4KB instead of 300KB)
   - URLs are persistent and CDN-cached globally
   - Images are automatically served in optimal format (WebP for modern browsers, JPEG for older ones)

### Free Tier Benefits

- **25GB/month** upload limit (5x more than Firebase Storage)
- **Automatic image optimization** (no manual compression needed)
- **Global CDN** distribution (images load faster worldwide)
- **Responsive image delivery** (automatically serves WebP vs JPEG)
- **No CORS issues** (unlike Firebase Storage)

## Troubleshooting

### Issue: "Cloudinary Cloud Name not configured"

- Make sure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set in `.env.local`
- Restart your dev server after updating `.env.local`

### Issue: "Upload Preset not configured"

- Ensure `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is set
- Verify the preset exists in Cloudinary Settings
- Make sure signing mode is set to **Unsigned**

### Issue: Image uploads are slow

- This is normal for first upload (optimization happens on Cloudinary servers)
- Subsequent uploads from same image are cached
- Images serve much faster after first load

### Issue: Delete operations fail

- Check that `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are set
- These are only needed if you want automatic cleanup
- Upload/edit operations work without these

## File Structure

### New Files Created

- `src/lib/cloudinary.ts` - Image upload/delete utilities
- `src/app/api/cloudinary/delete/route.ts` - Backend delete endpoint

### Modified Files

- `src/components/AdminForm.tsx` - Now uses Cloudinary upload widget
- `.env.local` - Added Cloudinary credentials
- `package.json` - Added `next-cloudinary` dependency

## Next Steps

1. ✅ Complete the setup steps above
2. ✅ Test image upload in admin panel
3. ✅ Enjoy 25GB/month free storage with automatic optimization!

For questions, check [Cloudinary Docs](https://cloudinary.com/documentation)
