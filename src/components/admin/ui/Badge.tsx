export default function Badge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-[#4ECDC4]/10 text-[#4ECDC4]",
    Pending: "bg-[#FFB347]/10 text-[#FFB347]",
    Inactive: "bg-[#FF6B6B]/10 text-[#FF6B6B]",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}