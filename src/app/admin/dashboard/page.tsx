"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { getAllItems, markAsSold, deleteItem } from "@/lib/items";
import { ClothingItem } from "@/types";
import { logoutUser } from "@/lib/auth";
import { formatPrice } from "@/lib/helpers";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Plus, LogOut, Edit2, Trash2, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [markSoldId, setMarkSoldId] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/admin/login");
      } else if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        toast.error("Unauthorized access");
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleMarkAsSold = async () => {
    if (!markSoldId) return;

    try {
      await markAsSold(markSoldId);
      setItems((prev) =>
        prev.map((item) =>
          item.id === markSoldId ? { ...item, isSold: true } : item
        )
      );
      toast.success("Item marked as sold");
      setMarkSoldId(null);
    } catch (error) {
      toast.error("Failed to mark item as sold");
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteItem(deleteItemId);
      setItems((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast.success("Item deleted successfully");
      setDeleteItemId(null);
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="text-amber-400" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/items/new"
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition"
            >
              <Plus size={18} />
              Add Item
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Items</p>
            <p className="text-3xl font-bold text-gray-900">{items.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Available</p>
            <p className="text-3xl font-bold text-green-600">
              {items.filter((i) => !i.isSold).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Sold</p>
            <p className="text-3xl font-bold text-red-600">
              {items.filter((i) => i.isSold).length}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Items</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-600">
              Loading items...
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No items yet.{" "}
              <Link
                href="/admin/items/new"
                className="text-amber-400 hover:underline"
              >
                Add your first item
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">
                        {item.itemCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-amber-400">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.isSold
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.isSold ? "Sold" : "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2 flex">
                        <Link
                          href={`/admin/items/${item.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Link>
                        {!item.isSold && (
                          <button
                            onClick={() => setMarkSoldId(item.id)}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            Mark Sold
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteItemId(item.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={!!deleteItemId}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteItemId(null)}
      />

      <ConfirmDialog
        isOpen={!!markSoldId}
        title="Mark as Sold"
        message="Mark this item as sold?"
        confirmText="Mark as Sold"
        cancelText="Cancel"
        onConfirm={handleMarkAsSold}
        onCancel={() => setMarkSoldId(null)}
      />
    </div>
  );
}
