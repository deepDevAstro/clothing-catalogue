# Testing Guide - Admin Features Fixes

## Quick Test Scenarios

### Test 1: Caching Performance (Issue #4)

**Goal:** Verify that dashboard data is cached and avoids repeated Firebase calls

**Steps:**

1. Login to admin dashboard (`/admin/dashboard`)
2. Observe: Items load and list is displayed
3. Navigate to home page (`/`)
4. Navigate back to dashboard (`/admin/dashboard`)
5. **Expected:** Items load instantly without spinner (from cache)
6. Wait 5+ minutes
7. Navigate to dashboard again
8. **Expected:** Items reload from Firebase (cache expired)

**How to Verify in Browser DevTools:**

- Open DevTools Console
- Add this code to check cache:
  ```javascript
  // Check if cache is working (in the app context)
  // Cache operations are internal to app, not visible in console
  // But you can observe network requests:
  // - First dashboard visit: Shows 1 getAllItems Firebase request
  // - Return after <5 min: No network request (cached)
  // - Return after >5 min: New getAllItems Firebase request
  ```

---

### Test 2: Delete Confirmation Modal (Issue #2)

**Goal:** Verify delete shows confirmation BEFORE deleting

**Steps:**

1. Login to admin dashboard
2. Find any item in the list
3. Click the **Delete** button (trash icon)
4. **Expected:** Confirmation dialog appears with message:
   - "Delete Item"
   - "Are you sure you want to delete this item? This action cannot be undone."
   - Red "Delete" button
   - Cancel button
5. Click **Cancel**
   - **Expected:** Dialog closes, item NOT deleted
6. Click **Delete** button again
7. Click **Delete** confirmation button
   - **Expected:** Item deleted, success toast appears, list updates

---

### Test 3: Mark Sold Confirmation (Issue #2)

**Goal:** Verify mark sold shows confirmation BEFORE marking

**Steps:**

1. Login to admin dashboard
2. Find any available item
3. Click the **Mark Sold** button (or Package icon showing status)
4. **Expected:** Confirmation dialog appears with:
   - "Mark as Sold"
   - "Mark this item as sold?"
   - "Mark Sold" button
   - Cancel button
5. Click **Cancel**
   - **Expected:** Dialog closes, item status unchanged
6. Click button again, then **Confirm**
   - **Expected:** Item marked as sold (isSold = true), success toast

---

### Test 4: Form Layout Alignment (Issue #1)

**Goal:** Verify admin form has proper layout and spacing

**Steps:**

1. Login and navigate to **Add Item** (`/admin/items/new`)
2. **Expected observations:**
   - Page background is light gray (#f5f7fa)
   - Form is centered with max-width container
   - Form has white background with shadow
   - Title "Add New Item" is properly sized
3. Examine form fields:
   - **Label alignment:** All labels above inputs, aligned left
   - **Input spacing:** Consistent vertical spacing (space-y-8)
   - **Input styling:** Gray borders, focus blue highlight
   - **Error display:** Red box above form if error occurs
4. Test responsive:
   - Resize browser to mobile width (375px)
   - **Expected:** Form stacks properly, no horizontal scroll
   - Buttons remain full width

---

### Test 5: Image Upload & Update (Issue #3)

**Goal:** Verify image upload, deletion, and updates persist

**Steps:**

**Part A - Create with Images:**

1. Go to Add Item page (`/admin/items/new`)
2. Fill in: Name, Category, Price
3. **Upload main image:**
   - Click main image upload area
   - Select any image file
   - **Expected:** Image preview appears, compression info shown
   - Toast: "Creating item..." → "Item added successfully!"
4. **Expected:** Redirected to dashboard, new item visible

**Part B - Edit Images:**

1. Click **Edit** on newly created item
2. **Expected:** Item loads with images displayed
3. **Delete an image:**
   - Click "✕" button on any existing image
   - **Expected:** Image preview disappears from form
4. **Upload new image:**
   - Click "Additional Images" area
   - Select a new image
   - **Expected:** Preview appears in grid
5. Click **Update Item**
   - **Expected:** Toast: "Item updated successfully!"
6. Go back to dashboard
   - **Expected:** Item shows new images

**Part C - Change Main Image:**

1. Edit item again
2. In "Update Main Image" section, click upload
3. Select different image
4. In "Additional Images", add more
5. Click **Update**
   - **Expected:** Main image changed, additional images added
6. Verify on dashboard

**Part D - Size Validation:**

1. Try uploading many large images until total > 700KB
2. **Expected:** Error toast: "Adding these images would exceed document size limit..."
3. Remove some existing images
4. Try again
   - **Expected:** Update succeeds

---

### Test 6: Form States (Issue #1)

**Goal:** Verify form handles all states correctly

**Steps:**

**Empty Form Error:**

1. Go to Add Item page
2. Click **Add Item** without filling form
3. **Expected:** Error message appears (red box): "Please fill all required fields"

**Missing Image Error:**

1. Fill name, category, price
2. Don't select image
3. Click **Add Item**
4. **Expected:** Error: "Please select at least one image"

**Edit with Deleted Images:**

1. Edit item with multiple images
2. Delete all existing images
3. Don't upload new ones
4. Click **Update**
5. **Expected:** Error: "Please keep at least one image or upload new ones"

**Success State:**

1. Fill all required fields
2. Select image
3. Click button
4. **Expected:** Button shows spinner, text becomes "Processing..."
5. After success, button returns to normal state

---

## Verification Checklist

| Feature                                       | Working | Notes                              |
| --------------------------------------------- | ------- | ---------------------------------- |
| Cache: Dashboard loads instantly on 2nd visit | ✓       | Within 5-min TTL                   |
| Cache: Cache invalidates after delete         | ✓       | Next dashboard visit fetches fresh |
| Cache: Cache invalidates after create         | ✓       | New item immediately visible       |
| Confirm: Delete shows modal first             | ✓       | Modal appears before action        |
| Confirm: Mark sold shows modal first          | ✓       | Modal appears before action        |
| Confirm: Cancel closes modal                  | ✓       | No action performed                |
| Form: Main image upload works                 | ✓       | Compression + preview visible      |
| Form: Additional images upload                | ✓       | Grid preview with count            |
| Form: Image deletion works                    | ✓       | ✕ button removes image             |
| Form: Updates persist                         | ✓       | Dashboard shows changes            |
| Form: Responsive design                       | ✓       | Mobile layout works                |
| Form: Error messages display                  | ✓       | Red box at top of form             |
| Form: Loading state                           | ✓       | Button shows spinner               |
| Build: 0 TypeScript errors                    | ✓       | npx tsc --noEmit                   |
| Build: Successful compilation                 | ✓       | npm run build passes               |

---

## Troubleshooting

### Dashboard shows old data even after refresh

- **Cause:** Cache still valid (< 5 min)
- **Fix:** Wait 5 minutes, or clear localStorage if available
- **Workaround:** Check browser DevTools > Network tab, verify Firestore read

### Delete button doesn't show confirmation

- **Cause:** ConfirmDialog component not rendering
- **Fix:** Verify `src/app/admin/dashboard/page.tsx` has correct imports
- **Check:** Look for `ConfirmDialog` component near bottom of file

### Images not saving

- **Cause:** Size limit exceeded or Firestore permission issue
- **Fix:** Check Firebase rules allow admin writes to `/items/{itemId}`
- **Verify:** Console shows upload validation response

### Cache not working (data refetches every time)

- **Cause:** Cache system not initialized
- **Fix:** Verify `src/lib/cache.ts` file exists
- **Check:** Verify `getAllItems()` calls `getCache().get()` before Firestore

---

## Advanced Verification

### Monitor Cache Operations

Add to browser console when debugging:

```javascript
// Inside your app context, check cache state
// (These are internal API, may not be directly accessible)
// Instead, monitor network tab for Firebase calls:

// Expected pattern:
// 1st dashboard visit: 1 getAllItems call to Firebase
// 2nd visit (within 5 min): 0 Firebase calls (cached)
// 3rd visit (after 5 min): 1 getAllItems call (cache expired)
```

### Check TypeScript Compilation

```bash
cd /path/to/project
npx tsc --noEmit
# Should output: nothing (no errors)
```

### Verify Build Success

```bash
npm run build
# Should complete with:
# ✓ Compiled successfully
# ✓ Routes generated
# ○ Static prerendered
# ƒ Dynamic routes ready
```

---

## Expected Behavior Summary

### Before Fixes

❌ Delete happened immediately without confirmation  
❌ Dashboard refetched data on every visit  
❌ Mark sold had no confirmation  
❌ Form layout inconsistent  
❌ Image deletions might not persist

### After Fixes

✅ Confirmation modal shows BEFORE delete  
✅ Confirmation modal shows BEFORE mark sold  
✅ Dashboard caches data for 5 minutes  
✅ Form layout consistent with Tailwind CSS  
✅ Image changes persist to Firestore  
✅ Cache auto-invalidates on mutations  
✅ Zero TypeScript errors  
✅ Build completes successfully

---

## Production Deployment Notes

Before deploying to production:

1. **Environment Variables**

   - Verify `NEXT_PUBLIC_ADMIN_EMAIL` set correctly
   - Verify Firebase config present in `.env.local`

2. **Firestore Rules**

   - Ensure rules allow admin operations
   - Verify item deletion/update rules

3. **Cache Behavior**

   - 5-minute TTL is sensible for admin dashboard
   - Can be adjusted in `src/lib/cache.ts` if needed
   - Consider longer TTL (10+ min) for high-traffic scenarios

4. **Monitoring**

   - Watch Firebase Firestore costs (caching reduces significantly)
   - Monitor error logs for failed validations
   - Check image compression ratios (should be 70-80%)

5. **Rollback Plan**
   - If cache causes issues, remove `getCache()` calls (revert to `src/lib/cache.ts` v1)
   - Confirmation modals are separate fix, can be disabled independently

---

This guide covers all 4 fixes with practical testing steps and verification methods.
