import "@/styles/globals.css";
import "@/styles/admin.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";

export const metadata = {
  title: "Clothing Catalogue",
  description: "Browse and manage clothing items",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
