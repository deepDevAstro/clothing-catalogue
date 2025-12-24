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
 * Validate and store pre-compressed image base64
 * NOTE: Compression must happen on CLIENT side before calling this
 *
 * @param base64 - Pre-compressed base64 data URL
 * @returns Promise with the validated base64 (for Firestore)
 */
export async function uploadImage(base64: string): Promise<string> {
  try {
    // Send to API for validation and size check
    const response = await fetch("/api/items/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64 }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to validate image");
    }

    const data = await response.json();
    return data.data.base64; // Return validated base64
  } catch (error) {
    console.error("Error validating image:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to validate image");
  }
}

/**
 * Validate multiple pre-compressed images
 * NOTE: Compression must happen on CLIENT side before calling this
 *
 * @param base64Array - Array of pre-compressed base64 data URLs
 * @returns Promise with array of validated base64 strings
 */
export async function uploadImages(base64Array: string[]): Promise<string[]> {
  try {
    const results = await Promise.all(
      base64Array.map((base64) => uploadImage(base64))
    );
    return results;
  } catch (error) {
    console.error("Error validating images:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to validate images");
  }
}

/**
 * Create new item with compressed images stored as base64 in Firestore
 *
 * IMPORTANT: Images must be compressed FIRST using uploadImage/uploadImages
 * This function stores base64 data URLs directly in Firestore
 *
 * @param data - Item form data
 * @param imageUrl - Primary image as base64 data URL
 * @param imageUrls - Additional images as base64 data URLs
 * @returns Promise with created item
 */
export async function createItem(
  data: ItemFormData,
  imageUrl: string,
  imageUrls?: string[]
): Promise<ClothingItem> {
  try {
    if (!imageUrl) {
      throw new Error("Primary image is required");
    }

    const itemCode = generateItemCode();
    const newItem = {
      itemCode,
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description || "",
      imageUrl, // Base64 data URL
      imageUrls: imageUrls || [], // Array of base64 data URLs
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
 * Update item with compressed images stored as base64 in Firestore
 *
 * This handles:
 * - Updating item metadata (name, price, etc.)
 * - Adding new images (compressed first)
 * - Preserving existing image data URLs
 *
 * @param id - Item ID
 * @param data - Partial item data to update
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
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl; // Base64 data URL
    if (data.imageUrls !== undefined) updateData.imageUrls = data.imageUrls; // Base64 data URLs

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
