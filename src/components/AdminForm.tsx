"use client";

import { useState, useRef } from "react";
import { ItemFormData } from "@/types";
import { Upload, AlertCircle, X } from "lucide-react";
import {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  deleteImageFromCloudinary,
} from "@/lib/cloudinary";

interface AdminFormProps {
  onSubmit: (
    data: ItemFormData,
    primaryImageUrl?: string,
    additionalImageUrls?: string[],
    keptExistingImageUrls?: string[],
    keptExistingImageUrl?: string
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

  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>(
    defaultValues?.imageUrl || ""
  );
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
  const [keptExistingImageUrl, setKeptExistingImageUrl] = useState<string>(
    defaultValues?.imageUrl || ""
  );
  const [keptExistingImageUrls, setKeptExistingImageUrls] = useState<string[]>(
    defaultValues?.imageUrls || []
  );

  const [uploading, setUploading] = useState(false);
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [error, setError] = useState<string>("");

  const primaryImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

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

  const handlePrimaryImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setError("");
      setUploadingPrimary(true);

      try {
        // Validate file
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select a valid image file");
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Image must be smaller than 5MB");
        }

        // Upload to Cloudinary
        const url = await uploadImageToCloudinary(
          file,
          defaultValues?.id || "new"
        );
        setPrimaryImageUrl(url);
        setKeptExistingImageUrl(url);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload primary image"
        );
        setPrimaryImageUrl("");
        setKeptExistingImageUrl("");
      } finally {
        setUploadingPrimary(false);
        // Reset file input
        if (primaryImageInputRef.current) {
          primaryImageInputRef.current.value = "";
        }
      }
    }
  };

  const handleAdditionalImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setAdditionalImageUrls([]);
      return;
    }

    if (files.length > 5) {
      setError("Maximum 5 additional images allowed");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Validate all files
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          throw new Error("All files must be valid image files");
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Each image must be smaller than 5MB");
        }
      }

      // Upload all to Cloudinary in parallel
      const urls = await uploadMultipleImagesToCloudinary(
        files,
        defaultValues?.id || "new"
      );
      // Only set newly uploaded images, keep existing images separate
      setAdditionalImageUrls(urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
      setAdditionalImageUrls([]);
    } finally {
      setUploading(false);
      // Reset file input
      if (additionalImagesInputRef.current) {
        additionalImagesInputRef.current.value = "";
      }
    }
  };

  const removeAdditionalImage = (index: number) => {
    const newUrls = additionalImageUrls.filter((_, i) => i !== index);
    setAdditionalImageUrls(newUrls);
  };

  const removePrimaryImage = () => {
    setPrimaryImageUrl("");
    setKeptExistingImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.category || formData.price <= 0) {
      setError("Please fill all required fields");
      return;
    }

    if (!defaultValues && !primaryImageUrl) {
      setError("Please select a primary image");
      return;
    }

    if (
      defaultValues &&
      !primaryImageUrl &&
      keptExistingImageUrl.length === 0
    ) {
      setError("Please keep or upload a primary image");
      return;
    }

    await onSubmit(
      formData,
      primaryImageUrl || undefined,
      additionalImageUrls.length > 0 ? additionalImageUrls : undefined,
      keptExistingImageUrls.length > 0 ? keptExistingImageUrls : undefined,
      keptExistingImageUrl || undefined
    );
  };

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
          />
        </div>
      </div>

      {/* ==========================================
          SECTION 2: PRIMARY IMAGE
          ========================================== */}
      <div className="form-section">
        <h3 className="form-section-title">
          {defaultValues ? "Update Main Image" : "Main Image"}
        </h3>

        {primaryImageUrl ? (
          <div className="space-y-3">
            <div className="image-preview-wrapper">
              <img
                src={primaryImageUrl}
                alt="Primary product"
                className="image-preview"
              />
            </div>
            <p className="image-upload-success">
              <span className="image-upload-success-dot" />
              Primary image uploaded to Cloudinary
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                removePrimaryImage();
              }}
              className="btn btn-secondary"
            >
              <X className="w-4 h-4" />
              Change Primary Image
            </button>
          </div>
        ) : (
          <div className="image-upload-area">
            <input
              ref={primaryImageInputRef}
              type="file"
              accept="image/*"
              onChange={handlePrimaryImageChange}
              className="hidden"
              id="primary-image-input"
              disabled={uploadingPrimary}
            />
            <label
              htmlFor="primary-image-input"
              className={`image-upload-label ${
                uploadingPrimary ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploadingPrimary ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                  <p className="text-center text-gray-600">
                    Uploading to Cloudinary...
                  </p>
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
                      PNG, JPG, WebP up to 5MB - Cloudinary optimizes
                      automatically
                    </p>
                  </div>
                </div>
              )}
            </label>
          </div>
        )}
      </div>

      {/* ==========================================
          SECTION 3: ADDITIONAL IMAGES
          ========================================== */}
      <div className="form-section">
        <h3 className="form-section-title">Additional Images</h3>
        <p className="form-helper-text">Optional - up to 5 images</p>

        {(keptExistingImageUrls.length > 0 ||
          additionalImageUrls.length > 0) && (
          <div className="space-y-3 mb-6">
            <div className="image-gallery">
              {/* Show kept existing images first */}
              {keptExistingImageUrls.map((url, index) => (
                <div key={`kept-${index}`} className="image-thumbnail-wrapper">
                  <img
                    src={url}
                    alt={`Existing image ${index + 1}`}
                    className="image-thumbnail"
                  />
                  <div className="image-badge">Existing</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const newUrls = keptExistingImageUrls.filter(
                        (_, i) => i !== index
                      );
                      setKeptExistingImageUrls(newUrls);
                    }}
                    className="image-remove-button"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {/* Show newly uploaded images */}
              {additionalImageUrls.map((url, index) => (
                <div key={`new-${index}`} className="image-thumbnail-wrapper">
                  <img
                    src={url}
                    alt={`Additional image ${index + 1}`}
                    className="image-thumbnail"
                  />
                  <div className="image-badge">New</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeAdditionalImage(index);
                    }}
                    className="image-remove-button"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p className="image-upload-success">
              <span className="image-upload-success-dot" />
              {keptExistingImageUrls.length} existing +{" "}
              {additionalImageUrls.length} new ={" "}
              {keptExistingImageUrls.length + additionalImageUrls.length} total
            </p>
          </div>
        )}

        <div className="image-upload-area">
          <input
            ref={additionalImagesInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesChange}
            className="hidden"
            id="additional-images-input"
            disabled={uploading}
          />
          <label
            htmlFor="additional-images-input"
            className={`image-upload-label ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-center text-gray-600">
                  Uploading images to Cloudinary...
                </p>
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
                    PNG, JPG, WebP up to 5MB each (max 5 images)
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* ==========================================
          SECTION 4: ACTIONS
          ========================================== */}
      <div className="form-section">
        <button
          type="submit"
          disabled={loading || uploading || uploadingPrimary}
          className="btn btn-primary btn-block"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </span>
          ) : uploading || uploadingPrimary ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Uploading Images...
            </span>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}
