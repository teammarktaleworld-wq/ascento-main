"use client";

import Badge from "@/components/admin/ui/Badge";
import { Edit, Trash2 } from "lucide-react";

const students = [
  { id: 1, name: "Aarav", level: "Level 1", status: "Active" },
  { id: 2, name: "Diya", level: "Level 2", status: "Pending" },
];

export default function StudentsTable() {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b">
          <th className="p-3">Name</th>
          <th>Level</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {students.map((s) => (
          <tr key={s.id} className="border-b">
            <td className="p-3 font-semibold">{s.name}</td>
            <td>{s.level}</td>
            <td>
              <Badge status={s.status} />
            </td>
            <td className="flex gap-2">
              <Edit size={16} />
              <Trash2 size={16} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}