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

  const handleSubmit = async (
    data: ItemFormData,
    imageFile?: File,
    imageFiles?: File[]
  ) => {
    try {
      setLoading(true);

      if (!imageFile) {
        toast.error("Please select a primary image");
        return;
      }

      // Upload primary image
      const imageUrl = await uploadImage(imageFile);

      // Upload additional images if provided
      let additionalImageUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        additionalImageUrls = await uploadImages(imageFiles);
      }

      // Create item with all image URLs
      await createItem(data, imageUrl, additionalImageUrls);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold drop-shadow-lg"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-6">
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
