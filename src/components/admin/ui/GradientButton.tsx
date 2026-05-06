import { LucideIcon } from "lucide-react";

export default function GradientButton({
  children,
  icon: Icon,
  onClick,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] 
      text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 
      hover:shadow-lg transition-all"
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}