"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminForm from "@/components/AdminForm";
import { createItem } from "@/lib/items";
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
    primaryImageUrl?: string,
    additionalImageUrls?: string[]
  ) => {
    try {
      setLoading(true);

      if (!primaryImageUrl) {
        toast.error("Please select a primary image");
        return;
      }

      // Step 1: Create item with image URLs (from Firebase Storage)
      // Images are stored as URLs in Firestore, NOT as base64
      toast.loading("Creating item...");
      await createItem(data, primaryImageUrl, additionalImageUrls);

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
