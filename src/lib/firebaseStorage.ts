/**
 * Firebase Storage Utilities for Item Images
 *
 * This module handles all image uploads to Firebase Storage.
 * Images are stored with a consistent path structure: /items/{itemId}/{uuid}-{filename}
 *
 * IMPORTANT: This moves images OUT of Firestore documents and into Cloud Storage,
 * which solves the 1MB document size limit problem.
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Generate a simple unique ID (UUID v4-like)
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Upload a single image file to Firebase Storage
 *
 * @param file - The image file to upload
 * @param itemId - The item ID (used for folder organization)
 * @returns Promise with the public download URL
 */
export async function uploadImageToStorage(
  file: File,
  itemId: string
): Promise<string> {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Generate unique filename: uuid-originalname
    const uuid = generateUUID();
    const filename = `${uuid}-${file.name}`;

    // Create storage path: /items/{itemId}/{uuid}-{filename}
    const storagePath = `items/${itemId}/${filename}`;
    const storageRef = ref(storage, storagePath);

    // Upload the file
    await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
    });

    // Get the public download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to upload image to Storage");
  }
}

/**
 * Upload multiple image files to Firebase Storage in parallel
 *
 * @param files - Array of image files to upload
 * @param itemId - The item ID (used for folder organization)
 * @returns Promise with array of public download URLs
 */
export async function uploadMultipleImagesToStorage(
  files: File[],
  itemId: string
): Promise<string[]> {
  try {
    if (!files || files.length === 0) {
      return [];
    }

    // Upload all files in parallel
    const uploadPromises = files.map((file) =>
      uploadImageToStorage(file, itemId)
    );

    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error(
      "Error uploading multiple images to Firebase Storage:",
      error
    );
    throw error instanceof Error
      ? error
      : new Error("Failed to upload images to Storage");
  }
}

/**
 * Delete an image from Firebase Storage by URL
 *
 * @param downloadURL - The full download URL of the image
 */
export async function deleteImageFromStorage(
  downloadURL: string
): Promise<void> {
  try {
    if (!downloadURL) {
      throw new Error("No URL provided");
    }

    // Extract the storage path from the download URL
    // URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?{params}
    const urlParts = downloadURL.split("/o/");
    if (urlParts.length < 2) {
      throw new Error("Invalid download URL format");
    }

    const encodedPath = urlParts[1].split("?")[0];
    const decodedPath = decodeURIComponent(encodedPath);

    const storageRef = ref(storage, decodedPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image from Firebase Storage:", error);
    // Don't throw - allow deletion to continue even if a file deletion fails
    console.warn("Continuing despite deletion error");
  }
}

/**
 * Delete multiple images from Firebase Storage
 *
 * @param downloadURLs - Array of download URLs to delete
 */
export async function deleteMultipleImagesFromStorage(
  downloadURLs: string[]
): Promise<void> {
  try {
    if (!downloadURLs || downloadURLs.length === 0) {
      return;
    }

    // Delete all files in parallel
    const deletePromises = downloadURLs.map((url) =>
      deleteImageFromStorage(url)
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error(
      "Error deleting multiple images from Firebase Storage:",
      error
    );
    // Don't throw - allow the operation to continue
  }
}
