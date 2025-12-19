"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllItems } from "@/lib/items";
import { ClothingItem } from "@/types";
import ItemGrid from "@/components/ItemGrid";
import { ShoppingBag, Lock } from "lucide-react";

export default function Home() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-amber-400" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">
              Clothing Catalogue
            </h1>
          </div>
          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Lock size={18} />
            Admin
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-400 to-amber-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-3">Welcome to Our Store</h2>
          <p className="text-lg opacity-90">
            Discover our latest collection of quality clothing
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ItemGrid items={items} loading={loading} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for quality clothing and accessories.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-gray-400 text-sm">
                WhatsApp: {process.env.NEXT_PUBLIC_WHATSAPP_PHONE}
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <Link href="/admin/login" className="hover:text-white">
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Clothing Catalogue. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
