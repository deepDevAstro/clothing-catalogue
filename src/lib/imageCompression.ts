/**
 * Image Compression Utility for Firestore Storage
 *
 * Since we can't use Firebase Storage (free tier limitation),
 * we compress images before storing as base64 in Firestore.
 *
 * IMPORTANT: This keeps document size under 1MB limit
 */

/**
 * Compress image using Canvas API
 * Reduces file size by ~70-80% while maintaining acceptable quality
 *
 * @param file - Original image file
 * @param maxWidth - Max width in pixels (default 800)
 * @param quality - JPEG quality 0-1 (default 0.6)
 * @returns Promise with compressed base64 string
 */
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  quality: number = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (maintain aspect ratio)
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((maxWidth / width) * height);
          width = maxWidth;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error("Could not load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Could not read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Estimate base64 string size in bytes
 * Formula: (string.length × 3) / 4
 *
 * @param base64String - Base64 encoded string
 * @returns Size in bytes
 */
export function estimateBase64Size(base64String: string): number {
  // Account for data URL prefix: "data:image/jpeg;base64,"
  const base64Part = base64String.split(",")[1] || base64String;
  return Math.ceil((base64Part.length * 3) / 4);
}

/**
 * Format bytes to human readable size
 *
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "150 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate and compress image for Firestore storage
 *
 * Rules:
 * - Max 100KB per image (compressed)
 * - Max 5 images per item
 * - Total document size must stay < 900KB
 *
 * @param file - Image file to validate
 * @param index - Image index (for error messages)
 * @returns Promise with compressed base64 if valid
 * @throws Error if validation fails
 */
export async function validateAndCompressImage(
  file: File,
  index: number = 0
): Promise<string> {
  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP allowed.");
  }

  // Validate original file size (soft limit before compression)
  const maxOriginalSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxOriginalSize) {
    throw new Error("File size exceeds 5MB limit");
  }

  // Compress the image
  let compressed = await compressImage(file, 800, 0.6);

  // Check compressed size
  const compressedSize = estimateBase64Size(compressed);
  const maxCompressedSize = 100 * 1024; // 100KB max per image

  if (compressedSize > maxCompressedSize) {
    // Try more aggressive compression
    compressed = await compressImage(file, 600, 0.5);
    const retrySize = estimateBase64Size(compressed);

    if (retrySize > maxCompressedSize) {
      throw new Error(
        `Image ${index + 1} too large even after compression (${formatFileSize(
          retrySize
        )}). ` + `Please use a smaller or lower-quality image.`
      );
    }
  }

  return compressed;
}

/**
 * Calculate document size with new images
 * Helps prevent exceeding 1MB Firestore limit
 *
 * @param existingImages - Current image URLs in document
 * @param newImages - New base64 images to add
 * @returns Size in bytes
 */
export function calculateDocumentSize(
  existingImages: string[] = [],
  newImages: string[] = []
): number {
  const imageSize = [...existingImages, ...newImages].reduce((total, img) => {
    return total + estimateBase64Size(img);
  }, 0);

  // Account for metadata (~1-2KB)
  const metadataSize = 2000;

  return imageSize + metadataSize;
}

/**
 * Check if adding images would exceed document size limit
 *
 * @param currentImages - Current images in document
 * @param imagesToAdd - New images to add
 * @returns true if safe, false if would exceed limit
 */
export function canAddImagesToDocument(
  currentImages: string[] = [],
  imagesToAdd: string[] = []
): boolean {
  const totalSize = calculateDocumentSize(currentImages, imagesToAdd);
  const limit = 900 * 1024; // 900KB limit (safety margin below 1MB)

  return totalSize < limit;
}
