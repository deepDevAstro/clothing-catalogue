"use client";

import { ClothingItem } from "@/types";
import { useCart } from "@/contexts/CartContext";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { formatPrice, getWhatsAppLink } from "@/lib/helpers";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductModalProps {
  item: ClothingItem | null;
  onClose: () => void;
}

export default function ProductModal({ item, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  if (!item) return null;

  const images =
    item.imageUrls && item.imageUrls.length > 0
      ? item.imageUrls
      : [item.imageUrl];
  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addItem(item, 1);
    toast.success(`${item.name} added to cart!`);
  };

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
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "12px",
          zIndex: 50,
          maxWidth: "800px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "white",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            zIndex: 10,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <X size={24} />
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            padding: "2rem",
          }}
        >
          {/* Image Gallery */}
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#f7fafc",
                marginBottom: "1rem",
              }}
            >
              <Image
                src={currentImage}
                alt={item.name}
                fill
                style={{ objectFit: "cover" }}
              />

              {/* Navigation Arrows */}
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
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronLeft size={20} />
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
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
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
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {hasMultipleImages && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{
                      aspectRatio: "1",
                      border:
                        currentImageIndex === idx
                          ? "2px solid #667eea"
                          : "2px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: 0,
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "border-color 0.3s ease",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${item.name} ${idx + 1}`}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Code */}
            <p
              style={{
                fontSize: "0.85rem",
                color: "#a0aec0",
                fontFamily: "monospace",
              }}
            >
              {item.itemCode}
            </p>

            {/* Name */}
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: "#1a202c",
                margin: 0,
              }}
            >
              {item.name}
            </h1>

            {/* Category & Price */}
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  backgroundColor: "#e0e7ff",
                  color: "#667eea",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                }}
              >
                {item.category}
              </div>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#667eea",
                  margin: 0,
                }}
              >
                {formatPrice(item.price)}
              </p>
            </div>

            {/* Description */}
            {item.description && (
              <p
                style={{
                  color: "#666",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            )}

            {/* Status */}
            <div
              style={{
                padding: "1rem",
                backgroundColor: item.isSold ? "#fee" : "#efe",
                borderRadius: "8px",
                color: item.isSold ? "#c53030" : "#22543d",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {item.isSold ? "This item is sold out" : "In Stock"}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {!item.isSold && (
                <>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#764ba2";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#667eea";
                    }}
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={handleInterestedClick}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "#25d366",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "background 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1faa47";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#25d366";
                    }}
                  >
                    <MessageCircle size={18} />
                    Message via WhatsApp
                  </button>

                  {showPhone && (
                    <div
                      style={{
                        backgroundColor: "#ebe9ff",
                        border: "1px solid #ddd6fe",
                        borderRadius: "8px",
                        padding: "1rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Call or message:
                      </p>
                      <a
                        href={`tel:${whatsappPhone}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "#667eea",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        <Phone size={18} />
                        {whatsappPhone}
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
