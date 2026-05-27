// // app/admin/layout.tsx

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div style={{ isolation: "isolate" }}>
//       {children}
//     </div>
//   );
// }









// app/admin/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Ascento" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Renders NOTHING from the root layout — full takeover
  return <>{children}</>;
}