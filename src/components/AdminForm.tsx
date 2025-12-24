"use client";

import { useState } from "react";
import { ItemFormData } from "@/types";
import { Upload, AlertCircle } from "lucide-react";
import {
  uploadImageToStorage,
  uploadMultipleImagesToStorage,
  deleteMultipleImagesFromStorage,
} from "@/lib/firebaseStorage";

interface AdminFormProps {
  onSubmit: (
    data: ItemFormData,
    primaryImageUrl?: string,
    additionalImageUrls?: string[],
    itemId?: string,
    imagesToDelete?: string[]
  ) => Promise<void>;
  loading?: boolean;
  defaultValues?: Partial<ItemFormData> & {
    id?: string;
    imageUrl?: string;
    imageUrls?: string[];
  };
  submitText?: string;
}

const CATEGORIES = ["Men", "Women", "Kids", "Accessories"];

export default function AdminForm({
  onSubmit,
  loading = false,
  defaultValues,
  submitText = "Add Item",
}: AdminFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    name: defaultValues?.name || "",
    category: defaultValues?.category || "Men",
    price: defaultValues?.price || 0,
    description: defaultValues?.description || "",
  });

  // Primary image
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string>(
    defaultValues?.imageUrl || ""
  );

  // Additional images
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    { file: File; preview: string }[]
  >(
    (defaultValues?.imageUrls || []).map((url) => ({
      file: new File([], "existing"),
      preview: url,
    }))
  );

  // Images to delete from Storage
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // UI State
  const [error, setError] = useState<string>("");
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    });
    setError("");
  };

  /**
   * Handle primary image selection
   * Creates preview but doesn't upload yet - waits for form submission
   */
  const handlePrimaryImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setError("");

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be smaller than 2MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrimaryImageFile(file);
        setPrimaryImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handle additional images selection
   * Creates previews but doesn't upload yet - waits for form submission
   */
  const handleAdditionalImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setAdditionalImageFiles([]);
      setAdditionalImagePreviews([]);
      return;
    }

    // Validate maximum 5 images total
    const totalImages =
      (primaryImageFile ? 1 : 0) +
      additionalImageFiles.length +
      files.length +
      additionalImagePreviews.filter((p) => p.file.size > 0).length;

    if (totalImages > 5) {
      setError(
        `Maximum 5 images allowed (you have ${
          (primaryImageFile ? 1 : 0) + additionalImageFiles.length
        }, trying to add ${files.length})`
      );
      return;
    }

    setError("");
    const previews: { file: File; preview: string }[] = [];
    let filesProcessed = 0;

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("All files must be valid images");
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setError("All images must be smaller than 2MB each");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push({
          file,
          preview: e.target?.result as string,
        });
        filesProcessed++;

        if (filesProcessed === files.length) {
          setAdditionalImageFiles([...additionalImageFiles, ...files]);
          setAdditionalImagePreviews([...additionalImagePreviews, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * Remove a preview (but not from Storage yet - waits for form submission)
   */
  const removeImagePreview = (index: number) => {
    const newPreviews = additionalImagePreviews.filter((_, i) => i !== index);
    setAdditionalImagePreviews(newPreviews);
  };

  /**
   * Mark an existing image for deletion
   */
  const removeExistingImage = (url: string) => {
    setImagesToDelete([...imagesToDelete, url]);
    setAdditionalImagePreviews(
      additionalImagePreviews.filter((p) => p.preview !== url)
    );
  };

  /**
   * Clear primary image
   */
  const clearPrimaryImage = () => {
    setPrimaryImageFile(null);
    setPrimaryImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate basic form data
    if (!formData.name || !formData.category || formData.price <= 0) {
      setError("Please fill all required fields");
      return;
    }

    // For new items: require primary image
    if (
      !defaultValues &&
      !primaryImageFile &&
      !primaryImagePreview
    ) {
      setError("Please select a primary image");
      return;
    }

    // For edit: must have at least one image
    if (defaultValues) {
      const totalImages =
        (primaryImageFile ? 1 : 0) +
        (primaryImagePreview && !primaryImageFile ? 1 : 0) +
        additionalImageFiles.length +
        additionalImagePreviews.filter((p) => p.file.size === 0).length; // existing images

      if (totalImages === 0) {
        setError("Please keep at least one image or upload new ones");
        return;
      }
    }

    try {
      setUploadingImages(true);

      // Temporary ID for new items, use real ID for edits
      const tempId = defaultValues?.id || `temp-${Date.now()}`;

      // Step 1: Delete marked images from Firebase Storage
      if (imagesToDelete.length > 0) {
        await deleteMultipleImagesFromStorage(imagesToDelete);
      }

      // Step 2: Upload new primary image if provided
      let primaryImageUrl = primaryImagePreview; // Use existing if not changing
      if (primaryImageFile) {
        primaryImageUrl = await uploadImageToStorage(primaryImageFile, tempId);
      }

      // Step 3: Upload additional images
      let additionalImageUrls: string[] = [];

      // Keep existing images that weren't deleted
      const keptExistingUrls = additionalImagePreviews
        .filter((p) => p.file.size === 0) // Existing images have size 0
        .map((p) => p.preview);

      additionalImageUrls = [...keptExistingUrls];

      // Upload new image files
      if (additionalImageFiles.length > 0) {
        const newUrls = await uploadMultipleImagesToStorage(
          additionalImageFiles,
          tempId
        );
        additionalImageUrls = [...additionalImageUrls, ...newUrls];
      }

      // Step 4: Call the onSubmit handler with URLs (NOT base64)
      await onSubmit(
        formData,
        primaryImageUrl,
        additionalImageUrls.length > 0 ? additionalImageUrls : undefined,
        defaultValues?.id,
        imagesToDelete.length > 0 ? imagesToDelete : undefined
      );

      setUploadingImages(false);
    } catch (err) {
      setUploadingImages(false);
      setError(
        err instanceof Error ? err.message : "Failed to upload images"
      );
    }
  };

  const isFormLoading = loading || uploadingImages;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Error Message */}
      {error && (
        <div className="form-error">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* ==========================================
          SECTION 1: ITEM DETAILS
          ========================================== */}
      <div className="form-section">
        <h3 className="form-section-title">Item Details</h3>

        {/* Item Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label form-label-required">
            Item Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Blue Denim Jacket"
            className="form-input"
            required
            disabled={isFormLoading}
          />
        </div>

        {/* Category & Price Grid */}
        <div className="form-group-row">
          {/* Category */}
          <div className="form-group">
            <label
              htmlFor="category"
              className="form-label form-label-required"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
              disabled={isFormLoading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price" className="form-label form-label-required">
              Price (₹)
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "var(--spacing-md)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280",
                  fontWeight: "600",
                  pointerEvents: "none",
                }}
              >
                ₹
              </span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
                required
                disabled={isFormLoading}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <p className="form-helper-text">
            Optional - Add details about the item
          </p>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter item description..."
            className="form-textarea"
            disabled={isFormLoading}
          />
        </div>
      </div>

      {/* ==========================================
          SECTION 2: PRIMARY IMAGE
          ========================================== */}
      <div className="form-section">
        <h3 className="form-section-title">
          {defaultValues ? "Update Main Image" : "Item Image"}
        </h3>
        <div className="image-upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handlePrimaryImageChange}
            className="hidden"
            id="image-input"
            required={!defaultValues && !primaryImageFile && !primaryImagePreview}
            disabled={isFormLoading}
          />
          <label
            htmlFor="image-input"
            className="image-upload-label"
            style={{
              pointerEvents: isFormLoading ? "none" : "auto",
              opacity: isFormLoading ? 0.6 : 1,
            }}
          >
            {primaryImagePreview ? (
              <div className="space-y-3">
                <div className="image-preview-wrapper">
                  <img
                    src={primaryImagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
                <p className="image-upload-success">
                  <span className="image-upload-success-dot" />
                  {primaryImageFile ? "New image selected" : "Current image"}
                </p>
                {primaryImageFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      clearPrimaryImage();
                    }}
                    className="btn btn-secondary"
                  >
                    Change Image
                  </button>
                )}
              </div>
            ) : (
              <div className="image-upload-placeholder">
                <div className="image-upload-icon-wrapper">
                  <Upload className="image-upload-icon" />
                </div>
                <div>
                  <p className="image-upload-title">
                    Click to upload or drag and drop
                  </p>
                  <p className="image-upload-subtitle">
                    PNG, JPG, WebP (up to 2MB)
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* ==========================================
          SECTION 3: ADDITIONAL IMAGES
          ========================================== */}
      <div className="form-section">
        <h3 className="form-section-title">Additional Images</h3>
        <p className="form-helper-text">Optional - up to 5 images total</p>

        {/* Current Additional Images */}
        {additionalImagePreviews.length > 0 && (
          <div className="image-gallery" style={{ marginBottom: "1.5rem" }}>
            {additionalImagePreviews.map((item, index) => (
              <div key={index} className="image-thumbnail-wrapper">
                <img
                  src={item.preview}
                  alt={`Additional image ${index + 1}`}
                  className="image-thumbnail"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.file.size === 0) {
                      // Existing image
                      removeExistingImage(item.preview);
                    } else {
                      // New image
                      removeImagePreview(index);
                    }
                  }}
                  className="image-remove-button"
                  aria-label={`Remove image ${index + 1}`}
                  disabled={isFormLoading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload New Images */}
        <div className="image-upload-area">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesChange}
            className="hidden"
            id="multiple-images-input"
            disabled={isFormLoading}
          />
          <label
            htmlFor="multiple-images-input"
            className="image-upload-label"
            style={{
              pointerEvents: isFormLoading ? "none" : "auto",
              opacity: isFormLoading ? 0.6 : 1,
            }}
          >
            <div className="image-upload-placeholder">
              <div className="image-upload-icon-wrapper">
                <Upload className="image-upload-icon" />
              </div>
              <div>
                <p className="image-upload-title">
                  Click to upload or drag and drop
                </p>
                <p className="image-upload-subtitle">
                  PNG, JPG, WebP (up to 2MB each, max 5 images total)
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* ==========================================
          SECTION 4: ACTIONS
          ========================================== */}
      <div className="form-section">
        <button
          type="submit"
          disabled={isFormLoading}
          className="btn btn-primary btn-block"
        >
          {isFormLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              {uploadingImages ? "Uploading images..." : "Processing..."}
            </span>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}
