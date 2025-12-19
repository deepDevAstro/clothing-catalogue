"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminForm from "@/components/AdminForm";
import { createItem, uploadImage } from "@/lib/items";
import { ItemFormData } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ItemFormData, imageFile?: File) => {
    try {
      setLoading(true);

      if (!imageFile) {
        toast.error("Please select an image");
        return;
      }

      // Upload image
      const imageUrl = await uploadImage(imageFile);

      // Create item
      await createItem(data, imageUrl);

      toast.success("Item added successfully!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Error creating item:", error);
      toast.error(error.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-500 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Item
          </h1>
          <AdminForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Add Item"
          />
        </div>
      </main>
    </div>
  );
}
