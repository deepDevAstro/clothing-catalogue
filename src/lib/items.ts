import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ClothingItem, ItemFormData } from "@/types";
import { getCache } from "./cache";

/**
 * Generate unique item code
 */
function generateItemCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ITEM-${timestamp}${random}`.substring(0, 12);
}

/**
 * Get single item by ID
 */
export async function getItemById(id: string): Promise<ClothingItem | null> {
  try {
    const docRef = doc(db, "items", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt:
        docSnap.data().createdAt?.toDate?.().toISOString() ||
        new Date().toISOString(),
    } as ClothingItem;
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    return null;
  }
}

/**
 * Get all items from Firestore with caching
 * Cache TTL: 5 minutes
 */
export async function getAllItems(): Promise<ClothingItem[]> {
  try {
    const cache = getCache();
    const cacheKey = "items_all";

    // Check cache first
    const cachedItems = cache.get<ClothingItem[]>(cacheKey);
    if (cachedItems) {
      return cachedItems;
    }

    // If not cached, fetch from Firestore
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.().toISOString() ||
            new Date().toISOString(),
        } as ClothingItem)
    );

    // Cache the results
    cache.set(cacheKey, items);

    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

/**
 * Get items by category with caching
 * Cache TTL: 5 minutes
 */
export async function getItemsByCategory(
  category: string
): Promise<ClothingItem[]> {
  try {
    const cache = getCache();
    const cacheKey = `items_category_${category}`;

    // Check cache first
    const cachedItems = cache.get<ClothingItem[]>(cacheKey);
    if (cachedItems) {
      return cachedItems;
    }

    // If not cached, fetch from Firestore
    const q = query(
      collection(db, "items"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.().toISOString() ||
            new Date().toISOString(),
        } as ClothingItem)
    );

    // Cache the results
    cache.set(cacheKey, items);

    return items;
  } catch (error) {
    console.error("Error fetching items by category:", error);
    return [];
  }
}

/**
 * Search items by name or code
 */
export async function searchItems(query: string): Promise<ClothingItem[]> {
  try {
    const allItems = await getAllItems();
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching items:", error);
    return [];
  }
}

/**
 * DEPRECATED: uploadImage function
 *
 * This function is no longer used.
 * Images are now uploaded directly to Firebase Storage using:
 * - uploadImageToStorage() in firebaseStorage.ts
 * - uploadMultipleImagesToStorage() in firebaseStorage.ts
 *
 * See FIRESTORE_ARCHITECTURE.md for details
 */

/**
 * Create new item with image URLs stored in Firestore
 *
 * IMPORTANT: Images must be uploaded to Firebase Storage FIRST
 * This function stores ONLY metadata and image URLs in Firestore
 * (NOT base64 strings)
 *
 * Workflow:
 * 1. Upload images using uploadImageToStorage() → get URLs
 * 2. Call this function with the image URLs
 * 3. Firestore document created with URLs only
 *
 * @param data - Item form data
 * @param imageUrl - Primary image download URL (from Firebase Storage)
 * @param imageUrls - Additional image download URLs (from Firebase Storage)
 * @returns Promise with created item
 */
export async function createItem(
  data: ItemFormData,
  imageUrl: string,
  imageUrls?: string[]
): Promise<ClothingItem> {
  try {
    if (!imageUrl) {
      throw new Error("Primary image URL is required");
    }

    const itemCode = generateItemCode();
    const newItem = {
      itemCode,
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description || "",
      imageUrl, // Download URL from Firebase Storage
      imageUrls: imageUrls || [], // Array of download URLs from Firebase Storage
      isSold: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "items"), newItem);

    // Invalidate all item caches after creating a new item
    const cache = getCache();
    cache.invalidateItems();

    return {
      id: docRef.id,
      ...newItem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ClothingItem;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error instanceof Error ? error : new Error("Failed to create item");
  }
}

/**
 * Update item metadata and image URLs
 *
 * This handles:
 * - Updating item metadata (name, price, description, category)
 * - Updating primary image URL (from Firebase Storage)
 * - Updating additional image URLs (from Firebase Storage)
 *
 * IMPORTANT: Images must be uploaded to Firebase Storage BEFORE calling this
 * This function stores ONLY URLs (NOT base64 strings)
 *
 * @param id - Item ID
 * @param data - Partial item data to update (including image URLs)
 * @returns Promise<void>
 */
export async function updateItem(
  id: string,
  data: Partial<ItemFormData> & {
    imageUrl?: string;
    imageUrls?: string[];
  }
): Promise<void> {
  try {
    const itemRef = doc(db, "items", id);
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

    // Update only provided fields
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl; // Download URL from Firebase Storage
    if (data.imageUrls !== undefined) updateData.imageUrls = data.imageUrls; // Download URLs from Firebase Storage

    await updateDoc(itemRef, updateData);

    // Invalidate all item caches after updating
    const cache = getCache();
    cache.invalidateItems();
  } catch (error) {
    console.error("Error updating item:", error);
    throw error instanceof Error ? error : new Error("Failed to update item");
  }
}

/**
 * Mark item as sold
 */
export async function markAsSold(id: string): Promise<void> {
  try {
    const itemRef = doc(db, "items", id);
    await updateDoc(itemRef, {
      isSold: true,
      updatedAt: Timestamp.now(),
    });

    // Invalidate caches after marking as sold
    const cache = getCache();
    cache.invalidateItems();
  } catch (error) {
    console.error("Error marking item as sold:", error);
    throw new Error("Failed to mark item as sold");
  }
}

/**
 * Mark item as available (revert from sold)
 */
export async function markAsAvailable(id: string): Promise<void> {
  try {
    const itemRef = doc(db, "items", id);
    await updateDoc(itemRef, {
      isSold: false,
      updatedAt: Timestamp.now(),
    });

    // Invalidate caches after marking as available
    const cache = getCache();
    cache.invalidateItems();
  } catch (error) {
    console.error("Error marking item as available:", error);
    throw new Error("Failed to mark item as available");
  }
}

/**
 * Delete item
 */
export async function deleteItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "items", id));

    // Invalidate caches after deletion
    const cache = getCache();
    cache.invalidateItems();
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error("Failed to delete item");
  }
}
