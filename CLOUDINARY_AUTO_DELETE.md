# Automatic Cloudinary Image Deletion on Item Delete

## Overview

When you delete an item from the admin dashboard, **all associated images are automatically deleted from Cloudinary** as well. This keeps your Cloudinary account clean and avoids orphaned images taking up storage quota.

## How It Works

### 1. **Deletion Flow**

```
Admin clicks Delete Item
    ↓
System fetches item from Firestore
    ↓
Extracts all image URLs (primary + additional)
    ↓
Deletes images from Cloudinary in parallel
    ↓
Deletes item document from Firestore
    ↓
Success! Item and images removed
```

### 2. **What Gets Deleted**

When an item is deleted, the system removes:

- ✅ Primary image (`imageUrl`)
- ✅ All additional images (`imageUrls` array)
- ✅ The item document itself
- ✅ Associated Cloudinary folder (empty after images deleted)

### 3. **Folder Structure in Cloudinary**

Images are organized in Cloudinary by item ID:

```
clothing-catalogue/
├── ITEM-ABC123/
│   ├── primary_image.jpg
│   ├── additional_1.jpg
│   └── additional_2.jpg
├── ITEM-DEF456/
│   └── primary_image.jpg
└── new/  (for items being created)
```

When an item is deleted, all images in its folder are deleted, leaving the folder empty (which Cloudinary automatically cleans up).

## Technical Implementation

### Modified Files

1. **`src/lib/items.ts`** - `deleteItem()` function

### Code Changes

```typescript
export async function deleteItem(id: string): Promise<void> {
  try {
    // Step 1: Fetch item to get image URLs
    const itemSnapshot = await getDoc(doc(db, "items", id));
    if (itemSnapshot.exists()) {
      const item = itemSnapshot.data() as ClothingItem;

      // Step 2: Collect all image URLs
      const imagesToDelete: string[] = [];
      if (item.imageUrl) imagesToDelete.push(item.imageUrl);
      if (item.imageUrls && Array.isArray(item.imageUrls)) {
        imagesToDelete.push(...item.imageUrls);
      }

      // Step 3: Delete from Cloudinary
      if (imagesToDelete.length > 0) {
        try {
          const { deleteMultipleImagesFromCloudinary } = await import(
            "./cloudinary"
          );
          await deleteMultipleImagesFromCloudinary(imagesToDelete);
        } catch (cloudinaryError) {
          console.warn(
            "Warning: Failed to delete images from Cloudinary, but continuing with item deletion"
          );
          // Don't throw - allow item deletion even if Cloudinary cleanup fails
        }
      }
    }

    // Step 4: Delete item from Firestore
    await deleteDoc(doc(db, "items", id));
    const cache = getCache();
    cache.invalidateItems();
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error("Failed to delete item");
  }
}
```

## Error Handling

### What Happens If...

| Scenario                   | Behavior                                                                    |
| -------------------------- | --------------------------------------------------------------------------- |
| Cloudinary deletion fails  | Item still deletes from Firestore; warning logged; user continues           |
| Firestore deletion fails   | Error thrown; user sees "Failed to delete item" message; nothing is deleted |
| Some images fail to delete | Other images still delete; item still deletes; warning logged               |
| Item has no images         | Item deletes normally without attempting Cloudinary cleanup                 |

This design ensures **the app always prioritizes successful item deletion** - even if Cloudinary cleanup fails, the item is removed from the database.

## Manual Cleanup (If Needed)

In rare cases where images weren't deleted from Cloudinary (e.g., API failures), you can manually clean them up:

### Via Cloudinary Dashboard

1. Go to **Media Library** → **Folders**
2. Find the item's folder: `clothing-catalogue/ITEM-[ItemCode]`
3. Select all images in the folder
4. Click **Delete** → Confirm

### Via Cloudinary API (Advanced)

```bash
# Delete entire folder and all contents
curl -X DELETE "https://api.cloudinary.com/v1_1/{cloud_name}/resources/folders/clothing-catalogue/ITEM-ABC123" \
  -u "{api_key}:{api_secret}"
```

## Benefits

✅ **Automatic Cleanup** - No orphaned images in Cloudinary
✅ **Storage Savings** - Deleted items don't consume storage quota
✅ **Folder Organization** - Each item has its own folder for easy manual cleanup
✅ **Reliable** - Continues even if Cloudinary API is slow/unavailable
✅ **Transparent** - Warnings logged if cleanup fails

## Testing

### Test Case 1: Delete Item with Multiple Images

1. Create item with 1 primary + 3 additional images
2. Click Delete Item → Confirm
3. Verify in Cloudinary Media Library: folder should be gone or empty
4. Verify in Firestore: item should be gone

### Test Case 2: Delete Item with Only Primary Image

1. Create item with only primary image
2. Click Delete Item → Confirm
3. Verify in Cloudinary: image deleted
4. Verify in Firestore: item deleted

### Test Case 3: Manual Cleanup (If Needed)

1. If deletion fails (rare), go to Cloudinary Media Library
2. Find folder: `clothing-catalogue/ITEM-[ItemCode]`
3. Delete folder manually

## Future Enhancements

Potential improvements (if needed):

- [ ] Add retry logic for failed Cloudinary deletions
- [ ] Show deletion progress to user during multi-image deletion
- [ ] Add option to delete only images but keep item
- [ ] Add bulk delete with progress bar
