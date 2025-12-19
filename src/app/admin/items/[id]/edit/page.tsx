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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!item) {
    return null;
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Item</h1>
          <p className="text-gray-600 mb-6">{item.itemCode}</p>
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
