"use client";

import { Bell, Search } from "lucide-react";

export default function TopBar({ title }: { title: string }) {
  return (
    <header className="h-[80px] bg-[#FFFDF7] border-b flex items-center justify-between px-8">
      <h2 className="text-xl font-bold capitalize">{title}</h2>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2 text-gray-400" size={16} />
          <input
            className="pl-9 pr-3 py-2 border rounded-full text-sm"
            placeholder="Search..."
          />
        </div>

        <Bell className="text-gray-500 cursor-pointer" />
      </div>
    </header>
  );
}