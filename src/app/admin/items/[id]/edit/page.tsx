"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminForm from "@/components/AdminForm";
import {
  updateItem,
  uploadImage,
  uploadImages,
  getItemById,
} from "@/lib/items";
import { ItemFormData, ClothingItem } from "@/types";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [item, setItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch item
  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        const fetchedItem = await getItemById(id);
        if (fetchedItem) {
          setItem(fetchedItem);
        } else {
          toast.error("Item not found");
          router.push("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, router]);

  const handleSubmit = async (
    data: ItemFormData,
    imageBase64?: string,
    imageBase64Array?: string[],
    keptExistingImageUrls?: string[],
    keptExistingImageUrl?: string
  ) => {
    if (!id) return;

    try {
      setSubmitting(true);

      // Step 1: Handle primary image - new image takes priority
      let primaryImageBase64: string;
      if (imageBase64) {
        // User uploaded a new primary image
        toast.loading("Validating primary image...");
        primaryImageBase64 = await uploadImage(imageBase64);
      } else if (keptExistingImageUrl) {
        // User kept the existing image (didn't delete it)
        primaryImageBase64 = keptExistingImageUrl;
      } else if (item?.imageUrl) {
        // Fallback to original if no changes
        primaryImageBase64 = item.imageUrl;
      } else {
        toast.error("Primary image is required");
        setSubmitting(false);
        return;
      }

      // Step 2: Handle additional images
      let additionalImageBase64 =
        keptExistingImageUrls || item?.imageUrls || [];

      if (imageBase64Array && imageBase64Array.length > 0) {
        toast.loading("Validating additional images...");
        const newBase64Images = await uploadImages(imageBase64Array);
        // Only append new images if they fit within document size limit (~700KB for safety)
        const totalSize =
          (additionalImageBase64?.reduce((sum, img) => sum + img.length, 0) ||
            0) +
          (primaryImageBase64?.length || 0) +
          newBase64Images.reduce((sum, img) => sum + img.length, 0);

        if (totalSize > 700000) {
          toast.dismiss();
          toast.error(
            "Adding these images would exceed document size limit. Try removing some existing images first."
          );
          setSubmitting(false);
          return;
        }

        additionalImageBase64 = [
          ...(additionalImageBase64 || []),
          ...newBase64Images,
        ];
      }

      // Step 3: Update item with validated base64 images
      toast.loading("Updating item...");
      await updateItem(id, {
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        imageUrl: primaryImageBase64,
        imageUrls: additionalImageBase64,
      });

      toast.dismiss();
      toast.success("Item updated successfully!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Error updating item:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to update item");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-dark transition-all"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-card">
          <div className="admin-card-header">
            <h1 className="admin-card-title">Edit Item</h1>
            <p className="admin-card-subtitle">SKU: {item.itemCode}</p>
          </div>
          <AdminForm
            onSubmit={handleSubmit}
            loading={submitting}
            defaultValues={{
              name: item.name,
              category: item.category,
              price: item.price,
              description: item.description,
              id: item.id,
              imageUrl: item.imageUrl,
              imageUrls: item.imageUrls || [],
            }}
            submitText="Update Item"
          />
        </div>
      </main>
    </div>
  );
}
