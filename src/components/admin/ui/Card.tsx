export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-[24px] border border-[#F0EEF8] 
      shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}