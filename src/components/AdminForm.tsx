"use client";

import { useState } from "react";
import { ItemFormData } from "@/types";
import { Upload, AlertCircle } from "lucide-react";

interface AdminFormProps {
  onSubmit: (
    data: ItemFormData,
    imageFile?: File,
    imageFiles?: File[]
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleMultipleImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setImageFiles([]);
      setImagePreviews([]);
      return;
    }

    // Check total files (max 5)
    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    // Check each file size (2MB limit)
    const validFiles: File[] = [];
    const previews: string[] = [];
    let hasError = false;

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        setError(`${file.name} is too large (max 2MB)`);
        hasError = true;
        return;
      }
      validFiles.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === validFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });

    if (!hasError) {
      setImageFiles(validFiles);
      setError("");
    }
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
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
    if (!defaultValues && !imageFile && imageFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }
    if (
      defaultValues &&
      !imageFile &&
      imageFiles.length === 0 &&
      existingImageUrls.length === 0
    ) {
      setError("Please keep at least one image or upload new ones");
      return;
    }
    await onSubmit(
      formData,
      imageFile || undefined,
      imageFiles.length > 0 ? imageFiles : undefined
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-bg-secondary border border-border rounded-xl shadow-md p-8 dark:bg-bg-secondary"
    >
      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 bg-error/5 border border-error/20 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Item Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-text-primary mb-3"
        >
          Item Name <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter item name"
          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-text-primary mb-3"
        >
          Category <span className="text-error">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
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
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-semibold text-text-primary mb-3"
        >
          Price (USD) <span className="text-error">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-text-secondary font-semibold">
            $
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
            className="w-full pl-8 pr-4 py-3 bg-bg border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-text-primary mb-3"
        >
          Description{" "}
          <span className="text-text-tertiary text-xs">(Optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter item description..."
          rows={4}
          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Existing Images (when editing) */}
      {defaultValues && (existingImageUrl || existingImageUrls.length > 0) && (
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Current Images
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {existingImageUrl && (
              <div className="relative">
                <img
                  src={existingImageUrl}
                  alt="Main product"
                  className="w-full h-24 object-cover rounded-lg shadow-md border border-border"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setExistingImageUrl("");
                  }}
                  className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-error/90 transition"
                >
                  ✕
                </button>
              </div>
            )}
            {existingImageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg shadow-md border border-border"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeExistingImage(index);
                  }}
                  className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-error/90 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          {defaultValues ? "Update Main Image" : "Item Image"}{" "}
          <span className="text-error">{!defaultValues ? "*" : ""}</span>
        </label>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group bg-bg-tertiary/30">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-input"
            required={!defaultValues && !imageFile && !existingImageUrl}
          />
          <label htmlFor="image-input" className="cursor-pointer block">
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg shadow-md border border-border"
                  />
                  <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-primary font-semibold text-sm">
                      Change image
                    </p>
                  </div>
                </div>
                <p className="text-sm text-success font-semibold flex items-center justify-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-success rounded-full" />
                  New image selected
                </p>
                <p className="text-xs text-text-tertiary">{imageFile?.name}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="inline-block p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Upload className="text-primary w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    PNG, JPG, WebP up to 2MB
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Additional Images (optional) */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Additional Images{" "}
          <span className="text-text-tertiary text-xs">
            (Optional - up to 5)
          </span>
        </label>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group bg-bg-tertiary/30">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleImagesChange}
            className="hidden"
            id="multiple-images-input"
          />
          <label
            htmlFor="multiple-images-input"
            className="cursor-pointer block"
          >
            {imagePreviews.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-md border border-border"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage(index);
                        }}
                        className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-error/90 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-success font-semibold flex items-center justify-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-success rounded-full" />
                  {imagePreviews.length} image
                  {imagePreviews.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-text-tertiary">
                  Click to add or replace images
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="inline-block p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Upload className="text-primary w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    PNG, JPG, WebP up to 2MB each (max 5 images)
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-secondary disabled:from-text-tertiary disabled:to-text-secondary text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:cursor-not-allowed disabled:hover:-translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
    </form>
  );
}
