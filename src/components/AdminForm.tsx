"use client";

import { useState } from "react";
import { ItemFormData } from "@/types";
import { Upload, AlertCircle } from "lucide-react";
import {
  validateAndCompressImage,
  formatFileSize,
} from "@/lib/imageCompression";

interface AdminFormProps {
  onSubmit: (
    data: ItemFormData,
    imageBase64?: string,
    imageBase64Array?: string[],
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
  const [imageBase64, setImageBase64] = useState<string>("");
  const [imageSizeInfo, setImageSizeInfo] = useState<{
    original: number;
    compressed: number;
    ratio: string;
  } | null>(null);
  const [imageBase64Array, setImageBase64Array] = useState<string[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string>(
    defaultValues?.imageUrl || ""
  );
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    defaultValues?.imageUrls || []
  );
  const [error, setError] = useState<string>("");

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError("");

      try {
        const compressedBase64 = await validateAndCompressImage(file);
        setImageBase64(compressedBase64);

        const originalSize = file.size;
        const compressedSize = compressedBase64.length;
        const ratio = Math.round(
          ((originalSize - compressedSize) / originalSize) * 100
        );

        setImageSizeInfo({
          original: originalSize,
          compressed: compressedSize,
          ratio: `${ratio}%`,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to compress image"
        );
        setImageBase64("");
        setImageSizeInfo(null);
      }
    }
  };

  const handleMultipleImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setImageBase64Array([]);
      return;
    }

    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setError("");
    const base64Array: string[] = [];

    try {
      for (const file of files) {
        const compressedBase64 = await validateAndCompressImage(file);
        base64Array.push(compressedBase64);
      }

      setImageBase64Array(base64Array);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to compress images"
      );
    }
  };

  const removeImage = (index: number) => {
    const newBase64Array = imageBase64Array.filter((_, i) => i !== index);
    setImageBase64Array(newBase64Array);
  };

  const removeExistingImage = (index: number) => {
    const newUrls = existingImageUrls.filter((_, i) => i !== index);
    setExistingImageUrls(newUrls);
    if (index === 0 && newUrls.length > 0) {
      setExistingImageUrl(newUrls[0]);
    } else if (newUrls.length === 0) {
      setExistingImageUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.category || formData.price <= 0) {
      setError("Please fill all required fields");
      return;
    }
    if (!defaultValues && !imageBase64 && imageBase64Array.length === 0) {
      setError("Please select at least one image");
      return;
    }
    if (
      defaultValues &&
      !imageBase64 &&
      imageBase64Array.length === 0 &&
      existingImageUrls.length === 0
    ) {
      setError("Please keep at least one image or upload new ones");
      return;
    }
    await onSubmit(
      formData,
      imageBase64 || undefined,
      imageBase64Array.length > 0 ? imageBase64Array : undefined,
      existingImageUrls.length > 0 ? existingImageUrls : undefined,
      existingImageUrl || undefined
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
          SECTION 2: CURRENT IMAGES (EDIT ONLY)
          ========================================== */}
      {defaultValues && (existingImageUrl || existingImageUrls.length > 0) && (
        <div className="form-section">
          <h3 className="form-section-title">Current Images</h3>
          <div className="image-gallery">
            {existingImageUrl && (
              <div className="image-thumbnail-wrapper">
                <img
                  src={existingImageUrl}
                  alt="Main product"
                  className="image-thumbnail"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setExistingImageUrl("");
                  }}
                  className="image-remove-button"
                  aria-label="Remove main image"
                >
                  ✕
                </button>
              </div>
            )}
            {existingImageUrls.map((url, index) => (
              <div key={index} className="image-thumbnail-wrapper">
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="image-thumbnail"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeExistingImage(index);
                  }}
                  className="image-remove-button"
                  aria-label={`Remove image ${index + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          SECTION 3: PRIMARY IMAGE
          ========================================== */}
      <div className="form-section">
        <h3 className="form-section-title">
          {defaultValues ? "Update Main Image" : "Item Image"}
        </h3>
        <div className="image-upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-input"
            required={!defaultValues && !imageBase64 && !existingImageUrl}
          />
          <label htmlFor="image-input" className="image-upload-label">
            {imageBase64 ? (
              <div className="space-y-3">
                <div className="image-preview-wrapper">
                  <img
                    src={imageBase64}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
                <p className="image-upload-success">
                  <span className="image-upload-success-dot" />
                  Image compressed & selected
                </p>
                {imageSizeInfo && (
                  <div className="image-compression-info">
                    <p>Original: {formatFileSize(imageSizeInfo.original)}</p>
                    <p>
                      Compressed: {formatFileSize(imageSizeInfo.compressed)}
                    </p>
                    <p className="image-compression-ratio">
                      Reduced by {imageSizeInfo.ratio}
                    </p>
                  </div>
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
                    PNG, JPG, WebP - Auto-compressed to fit Firestore
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* ==========================================
          SECTION 4: ADDITIONAL IMAGES
          ========================================== */}
      <div className="form-section">
        <h3 className="form-section-title">Additional Images</h3>
        <p className="form-helper-text">Optional - up to 5 images</p>
        <div className="image-upload-area">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleImagesChange}
            className="hidden"
            id="multiple-images-input"
          />
          <label htmlFor="multiple-images-input" className="image-upload-label">
            {imageBase64Array.length > 0 ? (
              <div className="space-y-3">
                <div className="image-gallery">
                  {imageBase64Array.map((base64, index) => (
                    <div key={index} className="image-thumbnail-wrapper">
                      <img
                        src={base64}
                        alt={`Preview ${index + 1}`}
                        className="image-thumbnail"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage(index);
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
                  {imageBase64Array.length} image
                  {imageBase64Array.length !== 1 ? "s" : ""} selected
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
                    PNG, JPG, WebP up to 2MB each (max 5 images)
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* ==========================================
          SECTION 5: ACTIONS
          ========================================== */}
      <div className="form-section">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-block"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </span>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}
