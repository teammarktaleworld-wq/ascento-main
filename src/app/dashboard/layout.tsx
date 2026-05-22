// app/dashboard/layout.tsx

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* <UserSidebar /> */}
      <main>{children}</main>
    </div>
  );
}