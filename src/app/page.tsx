"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllItems } from "@/lib/items";
import { ClothingItem } from "@/types";
import ItemGrid from "@/components/ItemGrid";
import CartModal from "@/components/CartModal";
import ProductModal from "@/components/ProductModal";
import { ErrorLoadingState } from "@/components/ErrorState";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Lock, Search, ShoppingCart } from "lucide-react";

const CATEGORIES = ["Men", "Women", "Kids", "Accessories"];

export default function Home() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ClothingItem | null>(
    null
  );
  const { itemCount, openCart } = useCart();

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on category and search
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="app-container">
      {/* HEADER / NAVBAR */}
      <header className="navbar">
        <div className="nav-container">
          {/* Left: Logo */}
          <Link href="/" className="nav-brand">
            Jaipuri Collection
          </Link>

          {/* Center: Categories Dropdown + Search Bar */}
          <div
            style={{
              flex: 1,
              marginLeft: "3rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                height: "44px",
                paddingRight: "2.5rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                color: "#666",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "1rem",
                fontFamily: "inherit",
                minWidth: "150px",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#667eea";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Pill-shaped Search Input */}
            <div style={{ flex: 1, maxWidth: "300px", position: "relative" }}>
              <Search
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "18px",
                  height: "18px",
                  color: "#a0aec0",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.75rem",
                  paddingRight: "1rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  height: "44px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "50px",
                  fontSize: "1rem",
                  backgroundColor: "white",
                  transition: "all 0.3s ease",
                  color: "#333",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Right: Cart & Admin */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={openCart}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.75rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                color: "#667eea",
                position: "relative",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(102, 126, 234, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "#e53e3e",
                    color: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              href="/admin/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.9rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
            >
              <Lock size={16} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="home-container">
        <div className="home-hero">
          <h1 className="home-title">Authentic Jaipuri Handcrafted Apparel</h1>
          <p className="home-subtitle">
            Discover our curated collection of premium, ethically sourced
            clothing and accessories.
          </p>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            marginBottom: "2rem",
            scrollBehavior: "smooth",
          }}
        >
          <button
            onClick={() => setSelectedCategory("")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "50px",
              border: "none",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background:
                selectedCategory === ""
                  ? "linear-gradient(45deg, #667eea, #764ba2)"
                  : "rgba(255, 255, 255, 0.2)",
              color: "white",
              transition: "all 0.3s ease",
              boxShadow:
                selectedCategory === ""
                  ? "0 4px 15px rgba(102, 126, 234, 0.3)"
                  : "none",
            }}
            onMouseOver={(e) => {
              if (selectedCategory !== "") {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.3)";
              }
            }}
            onMouseOut={(e) => {
              if (selectedCategory !== "") {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.2)";
              }
            }}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                border: "none",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
                background:
                  selectedCategory === cat
                    ? "linear-gradient(45deg, #667eea, #764ba2)"
                    : "rgba(255, 255, 255, 0.2)",
                color: "white",
                transition: "all 0.3s ease",
                boxShadow:
                  selectedCategory === cat
                    ? "0 4px 15px rgba(102, 126, 234, 0.3)"
                    : "none",
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.3)";
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.2)";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT - Product Grid */}
        {error ? (
          <ErrorLoadingState onRetry={fetchItems} />
        ) : (
          <ItemGrid
            items={filteredItems}
            loading={loading}
            onItemClick={setSelectedProduct}
          />
        )}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95))",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          marginTop: "auto",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "3rem",
              marginBottom: "2rem",
            }}
          >
            {/* About */}
            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                About
              </h3>
              <p style={{ opacity: "0.9", lineHeight: "1.6" }}>
                Jaipuri Collection celebrates authentic Indian craftsmanship
                with modern design sensibilities.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Contact
              </h3>
              <p style={{ opacity: "0.9" }}>
                📱 {process.env.NEXT_PUBLIC_WHATSAPP_PHONE}
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(
                  /[^0-9]/g,
                  ""
                )}`}
                style={{
                  color: "#e0e7ff",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#e0e7ff";
                }}
              >
                💬 WhatsApp
              </a>
            </div>

            {/* Links */}
            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Links
              </h3>
              <ul style={{ listStyle: "none" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <a
                    href="#"
                    style={{
                      color: "#e0e7ff",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = "#e0e7ff";
                    }}
                  >
                    Browse
                  </a>
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <a
                    href="/admin/login"
                    style={{
                      color: "#e0e7ff",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = "#e0e7ff";
                    }}
                  >
                    Admin
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "2rem",
              textAlign: "center",
              opacity: "0.8",
            }}
          >
            <p>
              &copy; {new Date().getFullYear()} Jaipuri Collection. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartModal />
    </div>
  );
}
