"use client";

import { useState } from "react";
import Image from "next/image";
import { ClothingItem } from "@/types";
import { formatPrice, getWhatsAppLink } from "@/lib/helpers";
import { useCart } from "@/contexts/CartContext";
import {
  MessageCircle,
  Phone,
  Eye,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

interface ItemCardProps {
  item: ClothingItem;
  onImageClick?: () => void;
}

export default function ItemCard({ item, onImageClick }: ItemCardProps) {
  const { addItem } = useCart();
  const [showPhone, setShowPhone] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  // Use multiple images if available, otherwise fall back to single image
  const images =
    item.imageUrls && item.imageUrls.length > 0
      ? item.imageUrls
      : [item.imageUrl];
  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item, 1);
    toast.success(`${item.name} added to cart!`);
  };

  const handleInterestedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageClick?.();
  };

  return (
    <div className="article-card">
      {/* Image Container - Clickable */}
      <div
        onClick={onImageClick}
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "100%",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <Image
          src={currentImage}
          alt={item.name}
          fill
          className="article-image"
          style={{ objectFit: "cover" }}
          priority
        />

        {/* Image Navigation Arrows (for multiple images) */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              style={{
                position: "absolute",
                left: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "2.5rem",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.7)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextImage}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "2.5rem",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.7)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
              }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Image Indicator */}
            <div
              style={{
                position: "absolute",
                bottom: "0.75rem",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: "600",
                zIndex: 10,
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* Sold Out Overlay */}
        {item.isSold && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                SOLD OUT
              </p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          {item.isSold ? (
            <span
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "#ff6b6b",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "700",
                borderRadius: "8px",
              }}
            >
              Sold Out
            </span>
          ) : (
            <span
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "#51cf66",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "700",
                borderRadius: "8px",
              }}
            >
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="article-content">
        {/* Product Name */}
        <h3 className="article-title" style={{ color: "#1a202c" }}>
          {item.name}
        </h3>

        {/* Price */}
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#667eea",
            margin: "0.5rem 0 1rem 0",
          }}
        >
          {formatPrice(item.price)}
        </p>

        {/* Description */}
        {item.description && (
          <p className="article-description">{item.description}</p>
        )}

        {/* Item Code */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "#a0aec0",
            fontFamily: "monospace",
            marginBottom: "1rem",
          }}
        >
          SKU: {item.itemCode}
        </p>

        {/* Buttons */}
        {!item.isSold ? (
          <div
            style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}
          >
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleInterestedClick}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "white",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(102, 126, 234, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(102, 126, 234, 0.3)";
                }}
              >
                <MessageCircle size={16} />
                <span>Interested</span>
              </button>
              <button
                onClick={handleViewClick}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  background: "rgba(102, 126, 234, 0.1)",
                  color: "#667eea",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    "rgba(102, 126, 234, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                }}
              >
                <Eye size={16} />
                <span>View</span>
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.75rem",
                background: "linear-gradient(45deg, #25d366, #128c7e)",
                color: "white",
                fontSize: "0.9rem",
                fontWeight: "600",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(37, 211, 102, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(37, 211, 102, 0.3)";
              }}
            >
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        ) : null}

        {/* Phone fallback */}
        {showPhone && (
          <div
            className="article-meta"
            style={{
              background: "rgba(102, 126, 234, 0.1)",
              border: "1px solid rgba(102, 126, 234, 0.2)",
              borderRadius: "8px",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "#667eea",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Contact:
            </p>
            <a
              href={`https://wa.me/${whatsappPhone?.replace(/[^0-9]/g, "")}`}
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#5a67d8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#667eea";
              }}
            >
              <MessageCircle size={14} />
              {whatsappPhone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
