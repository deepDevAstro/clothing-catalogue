"use client";

import { useCart } from "@/contexts/CartContext";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/helpers";

export default function CartModal() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();

  if (!isOpen) return null;

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
          animation: "slideIn 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1a202c" }}
          >
            Shopping Cart ({items.length})
          </h2>
          <button
            onClick={closeCart}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              color: "#666",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem",
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#a0aec0",
                padding: "2rem 0",
              }}
            >
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem",
                    backgroundColor: "#f7fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      flexShrink: 0,
                      backgroundColor: "#edf2f7",
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "600",
                        color: "#1a202c",
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#667eea",
                        fontWeight: "600",
                        marginTop: "0.25rem",
                      }}
                    >
                      {formatPrice(item.price)}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          color: "#666",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          minWidth: "24px",
                          textAlign: "center",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          color: "#666",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#e53e3e",
                      padding: "0.5rem",
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.95rem", color: "#666" }}>Total:</span>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#667eea",
                }}
              >
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
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
              Checkout
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
