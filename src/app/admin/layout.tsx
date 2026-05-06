// app/admin/layout.tsx

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ isolation: "isolate" }}>
      {children}
    </div>
  );
}