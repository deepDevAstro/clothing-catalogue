export const metadata = {
  title: "Admin - Clothing Catalogue",
  description: "Admin panel for managing clothing items",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
