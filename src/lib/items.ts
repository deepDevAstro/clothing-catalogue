import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ClothingItem, ItemFormData } from "@/types";

/**
 * Generate unique item code
 */
function generateItemCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ITEM-${timestamp}${random}`.substring(0, 12);
}

/**
 * Get all items from Firestore
 */
export async function getAllItems(): Promise<ClothingItem[]> {
  try {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.().toISOString() ||
            new Date().toISOString(),
        } as ClothingItem)
    );
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

/**
 * Get items by category
 */
export async function getItemsByCategory(
  category: string
): Promise<ClothingItem[]> {
  try {
    const q = query(
      collection(db, "items"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.().toISOString() ||
            new Date().toISOString(),
        } as ClothingItem)
    );
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
 * Upload image to Firebase Storage via API route
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // Get Firebase auth token from the current user
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const idToken = await currentUser.getIdToken();

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/items/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    const result = await response.json();
    return result.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }
}

/**
 * Create new item
 */
export async function createItem(
  data: ItemFormData,
  imageUrl: string
): Promise<ClothingItem> {
  try {
    const itemCode = generateItemCode();
    const newItem = {
      itemCode,
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description || "",
      imageUrl,
      isSold: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "items"), newItem);
    return {
      id: docRef.id,
      ...newItem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ClothingItem;
  } catch (error) {
    console.error("Error creating item:", error);
    throw new Error("Failed to create item");
  }
}

/**
 * Update item
 */
export async function updateItem(
  id: string,
  data: Partial<ItemFormData>
): Promise<void> {
  try {
    const itemRef = doc(db, "items", id);
    const updateData: any = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(itemRef, updateData);
  } catch (error) {
    console.error("Error updating item:", error);
    throw new Error("Failed to update item");
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
  } catch (error) {
    console.error("Error marking item as sold:", error);
    throw new Error("Failed to mark item as sold");
  }
}

/**
 * Delete item
 */
export async function deleteItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "items", id));
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error("Failed to delete item");
  }
}
