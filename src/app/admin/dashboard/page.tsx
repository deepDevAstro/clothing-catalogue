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
import { Plus, LogOut, Edit2, Trash2, Package, ArrowLeft } from "lucide-react";
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
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Header */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#5a67d8";
                e.currentTarget.style.transform = "translateX(-4px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#667eea";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <ArrowLeft size={18} />
              Back
            </Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginLeft: "1rem",
                paddingLeft: "1rem",
                borderLeft: "1px solid #e2e8f0",
              }}
            >
              <Package size={28} style={{ color: "#667eea" }} />
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1a202c",
                  margin: 0,
                }}
              >
                Admin Dashboard
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/admin/items/new"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                color: "white",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(102, 126, 234, 0.3)";
              }}
            >
              <Plus size={18} />
              Add Item
            </Link>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                background: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(255, 107, 107, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(255, 107, 107, 0.3)";
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              padding: "1.5rem",
              transition: "all 0.3s ease",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow =
                "0 12px 24px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <p
              style={{
                color: "#a0aec0",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Total Items
            </p>
            <p
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "#1a202c",
                margin: 0,
              }}
            >
              {items.length}
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              padding: "1.5rem",
              transition: "all 0.3s ease",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow =
                "0 12px 24px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <p
              style={{
                color: "#a0aec0",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Available
            </p>
            <p
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "#51cf66",
                margin: 0,
              }}
            >
              {items.filter((i) => !i.isSold).length}
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              padding: "1.5rem",
              transition: "all 0.3s ease",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow =
                "0 12px 24px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <p
              style={{
                color: "#a0aec0",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Sold
            </p>
            <p
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "#ff6b6b",
                margin: 0,
              }}
            >
              {items.filter((i) => i.isSold).length}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: "700",
                color: "#1a202c",
                margin: 0,
              }}
            >
              Items Inventory
            </h2>
          </div>

          {loading ? (
            <div
              style={{ padding: "3rem", textAlign: "center", color: "#a0aec0" }}
            >
              <p>Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <div
              style={{ padding: "3rem", textAlign: "center", color: "#a0aec0" }}
            >
              <p>No items yet.</p>
              <Link
                href="/admin/items/new"
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontWeight: "600",
                  marginTop: "1rem",
                  display: "inline-block",
                }}
              >
                Add your first item →
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <th
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: "#a0aec0",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Code
                    </th>
                    <th
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: "#a0aec0",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: "#a0aec0",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: "#a0aec0",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: "#a0aec0",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: "#a0aec0",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        transition: "all 0.3s ease",
                        background: "white",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#f8fafc";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          fontSize: "0.875rem",
                          color: "#2d3748",
                          fontFamily: "monospace",
                        }}
                      >
                        {item.itemCode}
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          fontSize: "0.875rem",
                          color: "#2d3748",
                          maxWidth: "250px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          fontSize: "0.875rem",
                          color: "#2d3748",
                        }}
                      >
                        {item.category}
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          fontSize: "0.875rem",
                          fontWeight: "700",
                          color: "#667eea",
                        }}
                      >
                        {formatPrice(item.price)}
                      </td>
                      <td
                        style={{ padding: "1rem 1.5rem", fontSize: "0.75rem" }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.4rem 0.75rem",
                            borderRadius: "6px",
                            fontWeight: "700",
                            background: item.isSold ? "#fee2e2" : "#dcfce7",
                            color: item.isSold ? "#991b1b" : "#166534",
                          }}
                        >
                          {item.isSold ? "Sold" : "Available"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          fontSize: "0.875rem",
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <Link
                          href={`/admin/items/${item.id}/edit`}
                          style={{
                            color: "#667eea",
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            transition: "color 0.3s ease",
                            cursor: "pointer",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = "#5a67d8";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = "#667eea";
                          }}
                        >
                          <Edit2 size={16} />
                          Edit
                        </Link>
                        {!item.isSold && (
                          <button
                            onClick={() => setMarkSoldId(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#f97316",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "color 0.3s ease",
                              padding: 0,
                              fontSize: "0.875rem",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = "#ea580c";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = "#f97316";
                            }}
                          >
                            Mark Sold
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteItemId(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ff6b6b",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "color 0.3s ease",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontSize: "0.875rem",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = "#fa5252";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = "#ff6b6b";
                          }}
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
