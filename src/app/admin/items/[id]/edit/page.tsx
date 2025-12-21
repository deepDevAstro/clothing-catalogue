"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminForm from "@/components/AdminForm";
import { db } from "@/lib/firebase";
import { updateItem } from "@/lib/items";
import { ItemFormData, ClothingItem } from "@/types";
import { doc, getDoc } from "firebase/firestore";
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
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({
            id: docSnap.id,
            ...docSnap.data(),
          } as ClothingItem);
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

  const handleSubmit = async (data: ItemFormData) => {
    if (!id) return;

    try {
      setSubmitting(true);
      await updateItem(id, data);
      toast.success("Item updated successfully!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Error updating item:", error);
      toast.error(error.message || "Failed to update item");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-gray-300 text-lg drop-shadow-lg">Loading...</p>
      </div>
    );
  }

  if (!item) {
    return null;
  }

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
          <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
            Edit Item
          </h1>
          <p className="text-gray-300 mb-6 text-sm">{item.itemCode}</p>
          <AdminForm
            onSubmit={handleSubmit}
            loading={submitting}
            defaultValues={{
              name: item.name,
              category: item.category,
              price: item.price,
              description: item.description,
            }}
            submitText="Update Item"
          />
        </div>
      </main>
    </div>
  );
}
