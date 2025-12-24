"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminForm from "@/components/AdminForm";
import { createItem, uploadImage, uploadImages } from "@/lib/items";
import { ItemFormData } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (
    data: ItemFormData,
    imageBase64?: string,
    imageBase64Array?: string[]
  ) => {
    try {
      setLoading(true);

      if (!imageBase64) {
        toast.error("Please select a primary image");
        return;
      }

      // Step 1: Validate primary image
      toast.loading("Validating primary image...");
      const primaryImageBase64 = await uploadImage(imageBase64);

      // Step 2: Validate additional images
      let additionalImageBase64: string[] = [];
      if (imageBase64Array && imageBase64Array.length > 0) {
        toast.loading("Validating additional images...");
        additionalImageBase64 = await uploadImages(imageBase64Array);
      }

      // Step 3: Create item with compressed base64 images
      // Images are stored directly in Firestore with safety margin under 1MB
      toast.loading("Creating item...");
      await createItem(data, primaryImageBase64, additionalImageBase64);

      toast.dismiss();
      toast.success("Item added successfully!");

      // Reset form by changing key
      setFormKey((prev) => prev + 1);

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Error creating item:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="admin-card-title">Add New Item</h1>
          </div>
          <AdminForm
            key={formKey}
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Add Item"
          />
        </div>
      </main>
    </div>
  );
}
