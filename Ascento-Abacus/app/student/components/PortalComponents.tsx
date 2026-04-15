import React from "react";

// --- MINI CHART COMPONENTS ---
export function LineChartMini({ data, color = "#197fe6" }: { data: number[], color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 400, h = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 40) + 20;
    const y = h - 10 - ((v - min) / range) * (h - 20);
    return `${x},${y}`;
  });
  const area = `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(" ")} L${pts[pts.length - 1].split(",")[0]},${h} L20,${h} Z`;
  const line = `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(" ")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 80 }}>
      <defs>
        <linearGradient id={`lg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#lg-${color.replace("#","")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const [x, y] = pts[i].split(",");
        return <circle key={i} cx={x} cy={y} r="3.5" fill={color} />;
      })}
    </svg>
  );
}

export function BarChartMini({ data, labels, color = "#197fe6" }: { data: number[], labels: string[], color?: string }) {
  const max = Math.max(...data);
  const w = 400, h = 100;
  const barW = (w - 40) / data.length - 8;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 100 }}>
      {data.map((v, i) => {
        const barH = ((v / max) * (h - 30));
        const x = 20 + i * ((w - 40) / data.length) + 4;
        const y = h - 20 - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={color} opacity="0.85" />
            <text x={x + barW / 2} y={h - 5} textAnchor="middle" fontSize="9" fill="#4b5563">{labels[i]}</text>
            <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="9" fill="#374151">{v}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function CircleProgress({ pct, size = 100, stroke = 10, color = "#197fe6" }: { pct: number, size?: number, stroke?: number, color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#cbd5e1" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827">{pct}%</text>
    </svg>
  );
}

// --- CALENDAR HEATMAP ---
export function AttendanceCalendar() {
  const days = Array.from({ length: 31 }, (_, i) => {
    const r = Math.random();
    return r > 0.85 ? "absent" : r > 0.78 ? "holiday" : "present";
  });
  const colors: Record<string, string> = { present: "#10b981", absent: "#ef4444", holiday: "#6b7280" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
      {["S","M","T","W","T","F","S"].map(d => (
        <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#6b7280", paddingBottom: 2 }}>{d}</div>
      ))}
      {days.map((s, i) => (
        <div key={i} title={`Day ${i+1}: ${s}`}
          style={{ aspectRatio: "1", borderRadius: 4, background: colors[s], opacity: 0.85, cursor: "pointer" }} />
      ))}
    </div>
  );
}

// --- SKELETON LOADER ---
export function Skeleton({ w = "100%", h = 16, r = 6 }: { w?: string | number, h?: string | number, r?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: r, background: "linear-gradient(90deg,#e2e8f0 25%,#cbd5e1 50%,#e2e8f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
  );
}

// --- BADGE ---
export function Badge({ label, color }: { label: string, color?: string }) {
  const map: Record<string, string> = { "Upcoming":"#197fe6","Scheduled":"#f59e0b","Completed":"#10b981","Pending":"#ef4444","Paid":"#10b981","Announcement":"#197fe6","Reminder":"#f59e0b","Event":"#10b981" };
  const c = color || map[label] || "#6b7280";
  return <span style={{ background: c+"22", color: c, border: `1px solid ${c}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{label}</span>;
}

// --- CARD SHELL ---
export function Card({ children, style = {}, onClick }: { children: React.ReactNode, style?: React.CSSProperties, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, ...style }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ title, sub }: { title: string, sub?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
