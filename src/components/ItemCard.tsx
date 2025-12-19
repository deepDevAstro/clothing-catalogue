"use client";

import { useState } from "react";
import Image from "next/image";
import { ClothingItem } from "@/types";
import { formatPrice, getWhatsAppLink, getCategoryColor } from "@/lib/helpers";
import { MessageCircle, Phone } from "lucide-react";
import toast from "react-hot-toast";

interface ItemCardProps {
  item: ClothingItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  const handleInterestedClick = () => {
    if (whatsappPhone) {
      const whatsappLink = getWhatsAppLink(
        item.itemCode,
        item.name,
        whatsappPhone
      );
      window.open(whatsappLink, "_blank");
      toast.success("Opening WhatsApp...");
    } else {
      setShowPhone(true);
      toast.error("WhatsApp not available, showing phone number");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group animate-fade-in">
      {/* Image Container */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.isSold && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-bold">SOLD OUT</span>
          </div>
        )}
        {/* Category Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
            item.category
          )}`}
        >
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Item Code */}
        <p className="text-xs text-gray-500 font-mono">{item.itemCode}</p>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-amber-400">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Price */}
        <p className="text-lg font-bold text-amber-400">
          {formatPrice(item.price)}
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 space-y-2">
          {!item.isSold ? (
            <>
              <button
                onClick={handleInterestedClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <MessageCircle size={18} />
                Interested
              </button>
              {showPhone && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Call us:</p>
                  <a
                    href={`tel:${whatsappPhone}`}
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-2"
                  >
                    <Phone size={16} />
                    {whatsappPhone}
                  </a>
                  <p className="text-xs text-gray-500 mt-2">
                    Please mention item code: <strong>{item.itemCode}</strong>
                  </p>
                </div>
              )}
            </>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 font-semibold py-2 rounded-lg cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
