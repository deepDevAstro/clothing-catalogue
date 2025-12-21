"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { isValidEmail, isValidPassword } from "@/lib/helpers";
import { LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser(email, password);

      // Verify user is admin (in production, check Firestore role)
      if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error("Unauthorized: Only admins can access this area");
        await user.getIdTokenResult(true).then(() => {});
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("User not found");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* Back button */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#667eea",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "0.95rem",
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
        Back to Home
      </Link>

      {/* Login Card */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          maxWidth: "450px",
          width: "100%",
          padding: "2.5rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                borderRadius: "12px",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogIn size={24} color="white" />
            </div>
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#1a202c",
              margin: 0,
            }}
          >
            Admin Login
          </h1>
          <p
            style={{
              color: "#a0aec0",
              marginTop: "0.5rem",
              fontSize: "0.95rem",
            }}
          >
            Sign in to manage items and orders
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Email */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="email"
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#2d3748",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{
                padding: "0.75rem 1rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                color: "#2d3748",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#667eea";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(102, 126, 234, 0.1)";
                e.currentTarget.style.backgroundColor = "#f7fafc";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.backgroundColor = "white";
              }}
              required
            />
          </div>

          {/* Password */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="password"
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#2d3748",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              style={{
                padding: "0.75rem 1rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                color: "#2d3748",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#667eea";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(102, 126, 234, 0.1)";
                e.currentTarget.style.backgroundColor = "#f7fafc";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.backgroundColor = "white";
              }}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? "linear-gradient(45deg, #cbd5e0, #a0aec0)"
                : "linear-gradient(45deg, #667eea, #764ba2)",
              color: "white",
              fontWeight: "600",
              fontSize: "0.95rem",
              padding: "0.75rem 1.5rem",
              height: "44px",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading
                ? "none"
                : "0 4px 15px rgba(102, 126, 234, 0.3)",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Info */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#a0aec0",
            marginTop: "1.5rem",
            marginBottom: 0,
          }}
        >
          Demo: Use configured admin email and password
        </p>
      </div>
    </div>
  );
}
