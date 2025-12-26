# Cloudinary Folder Organization by Item Code

## Overview

Each item now has its own dedicated folder in Cloudinary using its **itemCode**, making it easy to manage and delete images for specific products. This maintains consistency with your Firestore database structure.

## Folder Structure

### Before (Problematic)
```
clothing-catalogue/
└── new/
    ├── item1_image1.jpg
    ├── item1_image2.jpg
    ├── item2_image1.jpg
    ├── item2_image2.jpg
    └── item2_image3.jpg    ← All mixed together!
```

**Problem**: Can't tell which images belong to which item. Difficult to clean up old items.

### After (Organized) ✅
```
clothing-catalogue/
├── ITEM-ABC123/           ← Item 1 (uses itemCode)
│   ├── primary_image.jpg
│   ├── additional_1.jpg
│   └── additional_2.jpg
├── ITEM-DEF456/           ← Item 2 (uses itemCode)
│   └── primary_image.jpg
└── ITEM-GHI789/           ← New item (generated itemCode used upfront)
    ├── image1.jpg
    └── image2.jpg
```

**Benefits**: Clear organization, human-readable, matches Firestore, easy cleanup!

## How It Works

### Creating a New Item

1. **User starts creating item**
   - AdminForm generates a unique itemCode: `ITEM-{timestamp}{random}`
   - Example: `ITEM-ABC123`
   - This is the same itemCode stored in Firestore

2. **User uploads images**
   - Images upload to: `clothing-catalogue/ITEM-ABC123/`
   - Cloudinary URLs contain this folder path
   - itemCode is generated BEFORE images upload (not after)

3. **User submits form**
   - Item is created in Firestore with the same itemCode
   - All images are already in the correct folder
   - No reorganization needed

4. **Result**
   - Item has folder: `clothing-catalogue/ITEM-ABC123/`
   - Folder name MATCHES Firestore itemCode
   - Easy to find and manage

### Editing an Existing Item

1. **User opens edit form**
   - Form loads with actual item itemCode (e.g., `ITEM-ABC123`)
   - Uses this as the folder ID

2. **User adds new images**
   - New images upload to: `clothing-catalogue/ITEM-ABC123/`
   - Combines with existing images in same folder

3. **Result**
   - All images for item are in: `clothing-catalogue/ITEM-ABC123/`
   - Single folder per item with consistent naming

## Benefits

✅ **Easy to Find**: All images for one item are in one folder
✅ **Human-Readable**: Use itemCode (e.g., `ITEM-ABC123`) not random IDs
✅ **Matches Firestore**: Folder name = Firestore itemCode
✅ **Manual Cleanup**: Can find and delete folder in Cloudinary dashboard
✅ **Organized**: Clear visual structure in Cloudinary
✅ **Scalable**: Works for any number of items
✅ **No Reorganization**: itemCode generated upfront, images in right place from start

## Technical Implementation

### Changes Made

1. **AdminForm.tsx**
   - Generates itemCode using `generateItemCode()` upfront (not just on submit)
   - For new items: generates unique itemCode
   - For edits: uses existing item's itemCode
   - Passes itemCode to upload functions

2. **lib/items.ts**
   - Exported `generateItemCode()` function
   - `createItem()` accepts optional itemCode parameter
   - Uses passed itemCode or generates new one if not provided

3. **types/index.ts**
   - Removed unnecessary `folderId` field (itemCode is the folder name)

## Firestore Document Structure

```json
{
  "id": "SQOjhQbAlOYcNbbCTE8J",
  "itemCode": "ITEM-ABC123",          ← This is the Cloudinary folder name!
  "name": "Blue Denim Jacket",
  "category": "Men",
  "price": 2099,
  "imageUrl": "https://res.cloudinary.com/.../clothing-catalogue/ITEM-ABC123/primary.jpg",
  "imageUrls": [
    "https://res.cloudinary.com/.../clothing-catalogue/ITEM-ABC123/secondary_1.jpg",
    "https://res.cloudinary.com/.../clothing-catalogue/ITEM-ABC123/secondary_2.jpg"
  ],
  "isSold": false,
  "createdAt": "2025-12-26T10:30:00Z",
  "updatedAt": "2025-12-26T10:30:00Z"
}
```

**Note**: Firestore document `id` (database record ID) and `itemCode` (Cloudinary folder) are different by design.

## Manual Image Management

### Finding Images for an Item

1. Go to **Cloudinary Dashboard** → **Media Library**
2. Navigate to **Folders** → **clothing-catalogue**
3. Find folder by itemCode (e.g., `ITEM-ABC123`)
4. View all images in that item's folder

### Deleting Images Manually

**To delete a single image:**
1. Open folder in Cloudinary
2. Select image
3. Click **Delete**

**To delete all images for an item:**
1. Open item's folder in Cloudinary (e.g., `ITEM-ABC123`)
2. Select all images in folder
3. Click **Delete**

(Note: Folder will auto-delete when empty)

### Finding itemCode

**From Firestore**: Open item document, check `itemCode` field

**From Cloudinary URL**: Extract from folder path
- URL: `https://res.cloudinary.com/.../clothing-catalogue/ITEM-ABC123/image.jpg`
- itemCode: `ITEM-ABC123`

## Testing

### Test 1: New Item Creation
```
1. Create new item with 2 images
2. Check Cloudinary Media Library
3. Verify: Images in `clothing-catalogue/ITEM-xxxxx/` folder
4. Verify: Folder name matches itemCode in Firestore
5. Verify: All images in same folder
```

### Test 2: Edit Item
```
1. Edit item with new images
2. Check Cloudinary Media Library
3. Verify: All images (old + new) in `clothing-catalogue/ITEM-xxxxx/` folder
4. Verify: Folder name = item's itemCode
```

### Test 3: Delete Item
```
1. Delete item from dashboard
2. Check Cloudinary
3. Verify: Images deleted from folder
4. Folder becomes empty (auto-cleans)
```

## Migration Notes

- **New items**: Created with itemCode-based folders automatically
- **Legacy items**: If any exist in old structure, they will continue to work
- **Manual migration**: Not needed - old and new items work together

## Future Enhancements

- [ ] Add itemCode display in admin dashboard
- [ ] Show direct "Manage Images in Cloudinary" link
- [ ] Add bulk migration tool for old items
- [ ] Add image count display per item
