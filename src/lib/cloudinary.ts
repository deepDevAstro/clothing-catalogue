/**
 * Cloudinary Image Management Utilities
 * Handles image uploads and deletions using Cloudinary's API
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Extract public ID from Cloudinary URL
 * URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Match Cloudinary URL pattern
    const match = url.match(
      /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/
    );
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
}

/**
 * Upload image to Cloudinary using unsigned upload (requires upload preset)
 * @param file - File object to upload
 * @param itemId - Item ID for folder organization
 * @returns Promise<string> - Download URL of uploaded image
 */
export async function uploadImageToCloudinary(
  file: File,
  itemId: string
): Promise<string> {
  try {
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error(
        "Cloudinary Cloud Name not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local"
      );
    }

    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary Upload Preset not configured. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
      );
    }

    // Create form data for unsigned upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", `clothing-catalogue/${itemId}`);
    formData.append("resource_type", "auto");

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Failed to upload image to Cloudinary"
      );
    }

    const data = await response.json();

    // Return optimized URL with quality and format transformations
    // This automatically serves WebP to modern browsers and JPEG to older ones
    const optimizedUrl = data.secure_url
      .replace("/upload/", "/upload/q_auto,f_auto/")
      .replace("/upload/v", "/upload/q_auto,f_auto/v");

    return optimizedUrl;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to upload image to Cloudinary");
  }
}

/**
 * Upload multiple images to Cloudinary in parallel
 * @param files - Array of File objects to upload
 * @param itemId - Item ID for folder organization
 * @returns Promise<string[]> - Array of download URLs
 */
export async function uploadMultipleImagesToCloudinary(
  files: File[],
  itemId: string
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) =>
      uploadImageToCloudinary(file, itemId)
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading multiple images to Cloudinary:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to upload images to Cloudinary");
  }
}

/**
 * Delete image from Cloudinary (requires API credentials)
 * Note: This requires CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET on the backend
 * For now, we'll use this for reference - actual deletion can be done via admin API
 *
 * @param url - Cloudinary image URL to delete
 * @returns Promise<void>
 */
export async function deleteImageFromCloudinary(url: string): Promise<void> {
  try {
    const publicId = extractPublicIdFromUrl(url);

    if (!publicId) {
      console.warn(
        "Could not extract public ID from URL, skipping deletion:",
        url
      );
      return;
    }

    // Call a backend endpoint to delete (since we need API credentials)
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete image from Cloudinary");
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    // Don't throw - deletion errors shouldn't block the UI
    console.warn("Failed to clean up image, but operation will continue");
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param urls - Array of Cloudinary image URLs to delete
 * @returns Promise<void>
 */
export async function deleteMultipleImagesFromCloudinary(
  urls: string[]
): Promise<void> {
  try {
    const deletePromises = urls.map((url) =>
      deleteImageFromCloudinary(url).catch((err) => {
        console.warn("Failed to delete individual image:", err);
        // Don't throw to allow other deletions to continue
      })
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting multiple images from Cloudinary:", error);
    // Don't throw - deletion errors shouldn't block the UI
  }
}
