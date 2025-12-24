"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminForm from "@/components/AdminForm";
import { updateItem, getItemById } from "@/lib/items";
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
    primaryImageUrl?: string,
    additionalImageUrls?: string[],
    itemId?: string,
    imagesToDelete?: string[]
  ) => {
    if (!id) return;

    try {
      setSubmitting(true);

      // All images are now URLs from Firebase Storage (not base64)
      // The AdminForm component handles uploading new files and deleting old ones
      // We just need to update the Firestore document with the final URLs

      // Step 1: Use provided URLs (newly uploaded + existing)
      const finalPrimaryImageUrl = primaryImageUrl || item?.imageUrl;
      const finalAdditionalImageUrls =
        additionalImageUrls || item?.imageUrls || [];

      if (!finalPrimaryImageUrl) {
        toast.error("Primary image is required");
        setSubmitting(false);
        return;
      }

      // Step 2: Update item with image URLs (NOT base64)
      toast.loading("Updating item...");
      await updateItem(id, {
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        imageUrl: finalPrimaryImageUrl,
        imageUrls: finalAdditionalImageUrls,
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
