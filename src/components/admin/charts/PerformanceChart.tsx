"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DATA = [
  { name: "Attendance", value: 85, color: "#4ECDC4" },
  { name: "Grades", value: 78, color: "#FFB347" },
  { name: "Fees", value: 92, color: "#FF6B6B" },
];

export default function PerformanceChart() {
  return (
    <div className="flex flex-col gap-6">
      {DATA.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-14 h-14 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: item.value }, { value: 100 - item.value }]}
                  dataKey="value"
                  innerRadius={20}
                  outerRadius={26}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill={item.color} />
                  <Cell fill={`${item.color}20`} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {item.value}%
            </div>
          </div>

          <div>
            <p className="font-bold">{item.name}</p>
            <p className="text-xs text-gray-500">Overall metric</p>
          </div>
        </div>
      ))}
    </div>
  );
}