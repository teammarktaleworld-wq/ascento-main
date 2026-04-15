import React, { useState } from "react";
import { subjectColors } from "./StudentData";
import { useStudentData } from "../page";
import {
  LineChartMini, BarChartMini, CircleProgress, AttendanceCalendar, Badge, Card, SectionTitle
} from "./PortalComponents";

// --- AI INSIGHTS ---
export function AIInsights() {
  const insights = [
    { icon: "🧮", title: "Weak in Mathematics", body: "Your UT2 score dropped to 34/50. Focus on Algebra & Quadratic Equations this week.", color: "#197fe6" },
    { icon: "📈", title: "Predicted Final Grade: A−", body: "Based on current trend, you're on track for 78–82% overall. Improve attendance to boost.", color: "#10b981" },
    { icon: "⚠️", title: "Attendance Risk", body: "Your attendance is 82%. Minimum 85% required. Missing 1 more day may affect eligibility.", color: "#f59e0b" },
  ];
  return (
    <Card style={{ background: "linear-gradient(135deg,#f1f5f9,#eef2ff)", border: "1px solid #c7d2fe" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>🤖</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#4338ca" }}>AI Study Insights</span>
        <span style={{ marginLeft: "auto", background: "#197fe622", color: "#0284c7", border: "1px solid #197fe633", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 600 }}>POWERED BY AI</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: ins.color+"11", borderRadius: 12, border: `1px solid ${ins.color}33` }}>
            <span style={{ fontSize: 20 }}>{ins.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: ins.color, marginBottom: 2 }}>{ins.title}</div>
              <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>{ins.body}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- MAIN DASHBOARD PAGES ---

export function PageDashboard() {
  const { student, kpis, notifications, results, isLive, dashboardRaw } = useStudentData();
  const perfLabels = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const subMarks = results.map(r => r.marksObtained ?? 0);
  const subLabels = results.map(r => r.subject.slice(0, 4));

  const today = [
    { time: "08:00", subj: "Mathematics", teacher: "Mrs. Priya", room: "Room 9A" },
    { time: "09:00", subj: "English", teacher: "Ms. Rachel", room: "Room 9A" },
    { time: "10:00", subj: "Science", teacher: "Mr. Anil", room: "Lab 2" },
    { time: "11:30", subj: "Social Studies", teacher: "Mr. Ramesh", room: "Room 9A" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Welcome, {student.name.split(" ")[0]} 👋</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {student.class}</div>
        </div>
        <div style={{ background: "#e2e8f0", border: "1px solid #cbd5e1", borderRadius: 10, padding: "8px 16px", fontSize: 12, color: "#4b5563" }}>
          📅 Academic Year 2024–25
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {kpis.map((k, i) => (
          <Card key={i} style={{ background: "#f1f5f9", border: `1px solid ${k.color}33` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{k.sub}</div>
              </div>
              <div style={{ fontSize: 26 }}>{k.icon}</div>
            </div>
            {k.trend && (
              <div style={{ marginTop: 10, fontSize: 11, color: k.trend.startsWith("+") ? "#10b981" : "#ef4444" }}>
                {k.trend.startsWith("+") ? "▲" : "▼"} {k.trend} from last month
              </div>
            )}
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <SectionTitle title="Academic Progress" sub="Monthly performance trend" />
          <LineChartMini data={[62,68,71,65,74,78,76,80,84]} color="#197fe6" />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            {perfLabels.map((l,i) => <span key={i} style={{ fontSize:9, color:"#6b7280" }}>{l}</span>)}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Subject-wise Marks (UT2)" sub="Out of 50" />
          <BarChartMini data={subMarks} labels={subLabels} color="#1d4ed8" />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <AIInsights />
        <Card>
          <SectionTitle title="Today's Classes" sub="Monday Schedule" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {today.map((cls, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", background: "#f1f5f9", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <div style={{ minWidth: 44, fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{cls.time}</div>
                <div style={{ width: 3, height: 32, background: (subjectColors as any)[cls.subj] || "#197fe6", borderRadius: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>{cls.subj}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{cls.teacher} · {cls.room}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Recent Notifications" sub="Latest updates from school" />
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {notifications.slice(0,3).map((n,i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"10px 12px", background: n.read?"#f1f5f9":"#e0f2fe33", borderRadius:10, border:`1px solid ${n.read?"#e2e8f0":"#a5b4fc44"}` }}>
              <Badge label={n.type} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#1f2937" }}>{n.title}</div>
                <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{n.body.slice(0,70)}…</div>
              </div>
              <div style={{ fontSize:11, color:"#9ca3af", whiteSpace:"nowrap" }}>{n.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function PageAcademics() {
  const { student, subjects } = useStudentData();
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <SectionTitle title="My Academics" sub="Class, subjects and academic year info" />
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14 }}>
        {[["🏫 Class",student.class],["📚 Board","CBSE"],["📅 Year","2024–25"],["🎯 Domain",student.domainName || "Abacus"],["👤 Roll No",String(student.roll)],["📊 ID",student.id]].map(([k,v],i)=>(
          <Card key={i} style={{padding:"14px 18px"}}>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>{k}</div>
            <div style={{fontSize:16,fontWeight:700,color:"#111827"}}>{v}</div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionTitle title="Academic Year Timeline" />
        <div style={{ display:"flex", gap:0, overflowX:"auto", paddingBottom:8 }}>
          {[["Q1","Apr–Jun 2024","✅"],["Q2","Jul–Sep 2024","✅"],["Q3","Oct–Dec 2024","✅"],["Q4","Jan–Mar 2025","🔄"]].map(([q,d,s],i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center" }}>
              <div style={{ textAlign:"center", minWidth:100 }}>
                <div style={{ fontSize:20 }}>{s}</div>
                <div style={{ fontSize:13,fontWeight:700,color:"#1f2937",marginTop:4 }}>{q}</div>
                <div style={{ fontSize:11,color:"#6b7280" }}>{d}</div>
              </div>
              {i<3 && <div style={{ width:40,height:2,background:"#cbd5e1" }}/>}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="My Subjects" sub="Current semester subjects" />
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {subjects.map((s,i)=>(
            <div key={i} style={{ display:"grid",gridTemplateColumns:"80px 1fr 1fr 1fr",gap:12,padding:"12px 14px",background:"#f1f5f9",borderRadius:12,border:"1px solid #e2e8f0",alignItems:"center" }}>
              <span style={{ fontSize:11,color:"#197fe6",fontWeight:700,fontFamily:"monospace" }}>{s.code}</span>
              <span style={{ fontSize:13,fontWeight:600,color:"#1f2937" }}>{s.name}</span>
              <span style={{ fontSize:12,color:"#4b5563" }}>👩‍🏫 {s.teacher}</span>
              <span style={{ fontSize:11,color:"#6b7280" }}>{s.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function PageTimetable() {
  const { timetable, student } = useStudentData();
  const periods = ["P1\n8:00","P2\n9:00","P3\n10:00","Break","P4\n11:30","P5\n12:30","P6\n1:30","P7\n2:30"];
  const days = Object.keys(timetable) as (keyof typeof timetable)[];
  const now = new Date();
  const currentDay = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][now.getDay()];

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
        <SectionTitle title="Weekly Timetable" sub="Grade 9 – Section A · 2024–25" />
        <button style={{ background:"#197fe6",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:600,cursor:"pointer" }}>📥 Download PDF</button>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"separate",borderSpacing:4 }}>
          <thead>
            <tr>
              <th style={{ padding:"8px 12px",textAlign:"left",fontSize:11,color:"#6b7280",fontWeight:600 }}>Period</th>
              {days.map(d=>(
                <th key={d} style={{ padding:"8px 12px",textAlign:"center",fontSize:12,fontWeight:700,color:d===currentDay?"#197fe6":"#4b5563",background:d===currentDay?"#e0f2fe33":"transparent",borderRadius:8 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((p,pi)=>(
              <tr key={pi}>
                <td style={{ padding:"8px 10px",fontSize:10,color:"#6b7280",fontWeight:600,whiteSpace:"pre-line",verticalAlign:"middle" }}>{p}</td>
                {days.map(d=>{
                  const subj = (timetable as any)[d][pi];
                  const color = (subjectColors as any)[subj] || "#cbd5e1";
                  return (
                    <td key={d} style={{ padding:3 }}>
                      <div style={{ background:subj==="—"?"#f1f5f9":color+"22",border:`1px solid ${subj==="—"?"#e2e8f0":color+"44"}`,borderRadius:8,padding:"8px 6px",textAlign:"center",fontSize:11,fontWeight:600,color:subj==="—"?"#cbd5e1":color,minWidth:90 }}>
                        {subj}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
        {Object.entries(subjectColors).filter(([k])=>k!=="—").map(([k,v])=>(
          <div key={k} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#4b5563" }}>
            <div style={{ width:10,height:10,borderRadius:3,background:v }} />{k}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageExams() {
  const { exams } = useStudentData();
  const [sel,setSel] = useState<number | null>(null);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <SectionTitle title="Examinations" sub="Schedule, details and admit cards" />
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {exams.map((e,i)=>(
          <Card key={i} style={{ cursor:"pointer",transition:"border-color .2s",border:`1px solid ${sel===i?"#197fe6":"#e2e8f0"}` }}
            onClick={()=>setSel(sel===i?null:i)}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
              <div>
                <div style={{ fontSize:15,fontWeight:700,color:"#1f2937" }}>{e.name}</div>
                <div style={{ fontSize:12,color:"#6b7280",marginTop:3 }}>📅 {e.dates} · ⏱ {e.duration}</div>
              </div>
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <Badge label={e.status} />
                <span style={{ color:"#6b7280",fontSize:14 }}>{sel===i?"▲":"▼"}</span>
              </div>
            </div>
            {sel===i && (
              <div style={{ marginTop:14,paddingTop:14,borderTop:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:12,color:"#4b5563",marginBottom:8 }}>Subjects: {e.subjects.join(", ")}</div>
                <div style={{ fontSize:12,color:"#6b7280",background:"#f1f5f9",borderRadius:8,padding:"10px 12px",marginBottom:10 }}>
                  📋 Students must bring hall ticket + school ID. No electronic devices allowed. Report 15 min early.
                </div>
                {e.status!=="Completed" && (
                  <button style={{ background:"#197fe6",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer" }}>📥 Download Admit Card</button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PageAttendance() {
  const { attendance } = useStudentData();
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <SectionTitle title="Attendance" sub="Monthly and subject-wise breakdown" />

      {attendance.overall < 85 && (
        <div style={{ background:"#fee2e2",border:"1px solid #fca5a544",borderRadius:12,padding:"12px 16px",display:"flex",gap:10,alignItems:"center" }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div>
            <div style={{ fontSize:13,fontWeight:700,color:"#b91c1c" }}>Low Attendance Warning</div>
            <div style={{ fontSize:12,color:"#dc2626" }}>Your attendance is {attendance.overall}%, below the required 85%. Please attend regularly.</div>
          </div>
        </div>
      )}

      <div style={{ display:"grid",gridTemplateColumns:"auto 1fr",gap:20 }}>
        <Card style={{ textAlign:"center",padding:"24px 32px" }}>
          <div style={{ fontSize:12,color:"#6b7280",marginBottom:12 }}>Overall Attendance</div>
          <CircleProgress pct={attendance.overall} size={120} stroke={12} color={attendance.overall>=85?"#10b981":"#f59e0b"} />
          <div style={{ fontSize:11,color:"#6b7280",marginTop:10 }}>Target: 85%</div>
        </Card>
        <Card>
          <SectionTitle title="March 2025 Calendar" />
          <AttendanceCalendar />
          <div style={{ display:"flex",gap:14,marginTop:10 }}>
            {[["#10b981","Present"],["#ef4444","Absent"],["#6b7280","Holiday"]].map(([c,l])=>(
              <div key={l} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#4b5563" }}>
                <div style={{ width:10,height:10,borderRadius:3,background:c }} />{l}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Subject-wise Attendance" />
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {attendance.bySubject.map((s,i)=>(
            <div key={i} style={{ display:"grid",gridTemplateColumns:"160px 1fr 60px",gap:12,alignItems:"center" }}>
              <div style={{ fontSize:12,fontWeight:600,color:"#1f2937" }}>{s.subject}</div>
              <div style={{ background:"#e2e8f0",borderRadius:20,height:8,overflow:"hidden" }}>
                <div style={{ width:`${s.pct}%`,height:"100%",background:s.pct>=85?"#10b981":s.pct>=75?"#f59e0b":"#ef4444",borderRadius:20,transition:"width .5s" }} />
              </div>
              <div style={{ fontSize:12,color:s.pct>=85?"#10b981":s.pct>=75?"#f59e0b":"#ef4444",fontWeight:700,textAlign:"right" }}>{s.pct}%</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function PageFees() {
  const { fees } = useStudentData();
  const total = fees.reduce((a,f)=>a+f.amount,0);
  const paid = fees.filter(f=>f.status==="Paid").reduce((a,f)=>a+f.amount,0);
  const pending = total - paid;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <SectionTitle title="Fees" sub="Fee summary, payment history and receipts" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
        {[["Total Fees",`₹${total.toLocaleString()}`,"#4b5563"],["Paid",`₹${paid.toLocaleString()}`,"#10b981"],["Pending",`₹${pending.toLocaleString()}`,"#ef4444"]].map(([l,v,c],i)=>(
          <Card key={i}>
            <div style={{ fontSize:11,color:"#6b7280",marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:26,fontWeight:800,color:c||"#111827" }}>{v}</div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionTitle title="Fee Details" />
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Fee Type","Amount","Due Date","Status","Action"].map(h=>(
                <th key={h} style={{ textAlign:"left",padding:"8px 12px",fontSize:11,color:"#6b7280",borderBottom:"1px solid #e2e8f0",fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fees.map((f,i)=>(
              <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}>
                <td style={{ padding:"10px 12px",fontSize:13,color:"#1f2937" }}>{f.type}</td>
                <td style={{ padding:"10px 12px",fontSize:13,color:"#1f2937",fontWeight:700 }}>₹{f.amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px",fontSize:12,color:"#6b7280" }}>{f.due}</td>
                <td style={{ padding:"10px 12px" }}><Badge label={f.status} /></td>
                <td style={{ padding:"10px 12px" }}>
                  {f.status==="Pending"
                    ? <button style={{ background:"#197fe6",color:"#fff",border:"none",borderRadius:6,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer" }}>Pay Now</button>
                    : <button style={{ background:"#e2e8f0",color:"#4b5563",border:"none",borderRadius:6,padding:"5px 12px",fontSize:11,cursor:"pointer" }}>📥 Receipt</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function PageResults() {
  const { results } = useStudentData();
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
        <SectionTitle title="Results" sub="Unit tests and mid-term performance" />
        <button style={{ background:"#197fe6",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:600,cursor:"pointer" }}>📥 Download Report Card</button>
      </div>
      <Card>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Subject","Marks","Total","Percentage","Grade"].map(h=>(
                <th key={h} style={{ textAlign:"left",padding:"8px 12px",fontSize:11,color:"#6b7280",borderBottom:"1px solid #e2e8f0",fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r,i)=>{
              const pct = r.marksObtained !== null && r.totalMarks > 0 ? Math.round((r.marksObtained / r.totalMarks) * 100) : null;
              return (
                <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}>
                  <td style={{ padding:"10px 12px",fontSize:13,color:"#1f2937",fontWeight:600 }}>{r.subject}</td>
                  <td style={{ padding:"10px 12px",fontSize:13,color:pct !== null ? (pct >= 80?"#10b981":pct >= 60?"#f59e0b":"#ef4444") : "#9ca3af",fontWeight:700 }}>{r.marksObtained ?? "—"}</td>
                  <td style={{ padding:"10px 12px",fontSize:13,color:"#6b7280" }}>{r.totalMarks}</td>
                  <td style={{ padding:"10px 12px",fontSize:13,color:pct !== null ? (pct >= 80?"#10b981":pct >= 60?"#f59e0b":"#ef4444") : "#9ca3af",fontWeight:600 }}>{pct !== null ? `${pct}%` : "—"}</td>
                  <td style={{ padding:"10px 12px" }}>{r.grade ? <Badge label={r.grade} /> : <span style={{ color:"#9ca3af" }}>—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <Card>
        <SectionTitle title="Marks Comparison" sub="Your scores across subjects" />
        <BarChartMini data={results.map(r=>r.marksObtained ?? 0)} labels={results.map(r=>r.subject.slice(0,4))} color="#197fe6" />
      </Card>
    </div>
  );
}

export function PageTeachers() {
  const { teachers } = useStudentData();
  const initials = (name: string) => name.split(" ").map(w=>w[0]).join("").slice(0,2);
  const colors = ["#197fe6","#10b981","#f59e0b","#ec4899","#14b8a6","#1d4ed8"];
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <SectionTitle title="My Teachers" sub="Contact and subject information" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14 }}>
        {teachers.map((t,i)=>(
          <Card key={i}>
            <div style={{ display:"flex",gap:14,alignItems:"flex-start" }}>
              <div style={{ width:46,height:46,borderRadius:12,background:colors[i%colors.length]+"33",border:`2px solid ${colors[i%colors.length]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:colors[i%colors.length],flexShrink:0 }}>
                {initials(t.name)}
              </div>
              <div>
                <div style={{ fontSize:14,fontWeight:700,color:"#1f2937" }}>{t.name}</div>
                <div style={{ fontSize:12,color:colors[i%colors.length],marginTop:2,fontWeight:600 }}>{t.subject}</div>
                <div style={{ fontSize:11,color:"#6b7280",marginTop:6 }}>🎓 {t.exp} experience</div>
                <div style={{ fontSize:11,color:"#6b7280",marginTop:2 }}>📧 {t.email}</div>
                <div style={{ fontSize:11,color:"#6b7280",marginTop:2 }}>📞 {t.phone}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PageNotifications() {
  const { notifications } = useStudentData();
  const [filter,setFilter] = useState("All");
  const types = ["All","Announcement","Reminder","Event"];
  const filtered = filter==="All"?notifications:notifications.filter(n=>n.type===filter);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <SectionTitle title="Notifications" sub="Announcements, reminders and events" />
      <div style={{ display:"flex",gap:8 }}>
        {types.map(t=>(
          <button key={t} onClick={()=>setFilter(t)}
            style={{ background:filter===t?"#197fe6":"#e2e8f0",color:filter===t?"#fff":"#4b5563",border:`1px solid ${filter===t?"#197fe6":"#cbd5e1"}`,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,cursor:"pointer" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {filtered.map((n,i)=>(
          <Card key={i} style={{ background:n.read?"#ffffff":"#e0e7ff",border:`1px solid ${n.read?"#e2e8f0":"#a5b4fc44"}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10 }}>
              <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                <Badge label={n.type} />
                <div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#1f2937",marginBottom:4 }}>{n.title}</div>
                  <div style={{ fontSize:12,color:"#4b5563",lineHeight:1.6 }}>{n.body}</div>
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6 }}>
                <div style={{ fontSize:11,color:"#9ca3af",whiteSpace:"nowrap" }}>{n.time}</div>
                {!n.read && <div style={{ width:8,height:8,borderRadius:"50%",background:"#197fe6" }} />}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PageDocuments() {
  const { documents } = useStudentData();
  const icons: Record<string, string> = { "Admit Card":"🎫","Report Card":"📊","Receipt":"🧾","Certificate":"📜" };
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <SectionTitle title="Documents" sub="Admit cards, certificates and receipts" />
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {documents.map((d,i)=>(
          <Card key={i}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
              <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                <div style={{ fontSize:28 }}>{icons[d.type]||"📄"}</div>
                <div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#1f2937" }}>{d.name}</div>
                  <div style={{ fontSize:11,color:"#6b7280",marginTop:2 }}>
                    <Badge label={d.type} /> · {d.date} · {d.size}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button style={{ background:"#e2e8f0",color:"#4b5563",border:"1px solid #cbd5e1",borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer" }}>👁 Preview</button>
                <button style={{ background:"#197fe6",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer" }}>📥 Download</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PageProfile() {
  const { student, attendance } = useStudentData();
  const Field = ({label,value}: {label:string, value:string}) => (
    <div style={{ padding:"12px 0",borderBottom:"1px solid #e2e8f0" }}>
      <div style={{ fontSize:11,color:"#6b7280",marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:13,fontWeight:600,color:"#1f2937" }}>{value}</div>
    </div>
  );
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <SectionTitle title="Profile" sub="Student information and academic history" />
      <div style={{ display:"grid",gridTemplateColumns:"auto 1fr",gap:20 }}>
        <Card style={{ textAlign:"center",padding:"28px 24px",minWidth:160 }}>
          <div style={{ width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#197fe6,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff",margin:"0 auto 12px" }}>AM</div>
          <div style={{ fontSize:15,fontWeight:700,color:"#111827" }}>{student.name}</div>
          <div style={{ fontSize:12,color:"#197fe6",marginTop:3,fontWeight:600 }}>{student.id}</div>
          <div style={{ fontSize:11,color:"#6b7280",marginTop:6 }}>{student.class}</div>
          <div style={{ fontSize:11,color:"#6b7280",marginTop:2 }}>Roll No: {student.roll}</div>
        </Card>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:0 }}>
          <Card style={{ borderRadius:"16px 0 0 16px",borderRight:"none" }}>
            <div style={{ fontSize:12,fontWeight:700,color:"#197fe6",marginBottom:8,textTransform:"uppercase",letterSpacing:1 }}>Personal Details</div>
            <Field label="Date of Birth" value={student.dob} />
            <Field label="Gender" value={student.gender} />
            <Field label="Blood Group" value={student.blood} />
            <Field label="Email" value={student.email} />
            <Field label="Phone" value={student.phone} />
            <Field label="Address" value={student.address} />
          </Card>
          <Card style={{ borderRadius:"0 16px 16px 0" }}>
            <div style={{ fontSize:12,fontWeight:700,color:"#10b981",marginBottom:8,textTransform:"uppercase",letterSpacing:1 }}>Parent/Guardian</div>
            <Field label="Parent Name" value={student.parent} />
            <Field label="Parent Phone" value={student.parentPhone} />
            <Field label="Parent Email" value={student.parentEmail} />
            <div style={{ marginTop:20 }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:8,textTransform:"uppercase",letterSpacing:1 }}>Academic History</div>
              <Field label="Joined" value={student.joined} />
              <Field label="Current GPA" value="8.4 / 10" />
              <Field label="Overall Attendance" value="82%" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function PageSettings() {
  const [theme,setTheme] = useState("dark");
  const [notifs,setNotifs] = useState({announcements:true,reminders:true,events:true,fees:true});
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20,maxWidth:640 }}>
      <SectionTitle title="Settings" sub="Preferences, security and notifications" />
      <Card>
        <div style={{ fontSize:13,fontWeight:700,color:"#1f2937",marginBottom:14 }}>🎨 Appearance</div>
        <div style={{ display:"flex",gap:10 }}>
          {["dark","light"].map(t=>(
            <button key={t} onClick={()=>setTheme(t)}
              style={{ background:theme===t?"#197fe6":"#e2e8f0",color:theme===t?"#fff":"#4b5563",border:`1px solid ${theme===t?"#197fe6":"#cbd5e1"}`,borderRadius:8,padding:"8px 20px",fontSize:12,fontWeight:600,cursor:"pointer",textTransform:"capitalize" }}>
              {t==="dark"?"🌙 Dark":"☀️ Light"}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{ fontSize:13,fontWeight:700,color:"#1f2937",marginBottom:14 }}>🔒 Security</div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {["Current Password","New Password","Confirm Password"].map((label,i)=>(
            <div key={i}>
              <div style={{ fontSize:11,color:"#6b7280",marginBottom:4 }}>{label}</div>
              <input type="password" placeholder="••••••••"
                style={{ width:"100%",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:8,padding:"9px 12px",color:"#1f2937",fontSize:13,outline:"none",boxSizing:"border-box" }} />
            </div>
          ))}
          <button style={{ background:"#197fe6",color:"#fff",border:"none",borderRadius:8,padding:"9px 16px",fontSize:12,fontWeight:600,cursor:"pointer",alignSelf:"flex-start",marginTop:4 }}>Update Password</button>
        </div>
      </Card>
      <Card>
        <div style={{ fontSize:13,fontWeight:700,color:"#1f2937",marginBottom:14 }}>🔔 Notification Preferences</div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {Object.entries(notifs).map(([k,v])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #e2e8f0" }}>
              <div style={{ fontSize:13,color:"#1f2937",textTransform:"capitalize" }}>{k}</div>
              <div onClick={()=>setNotifs(p=>({...p,[k as keyof typeof notifs]:!p[k as keyof typeof notifs]}))}
                style={{ width:40,height:22,borderRadius:11,background:v?"#197fe6":"#cbd5e1",cursor:"pointer",position:"relative",transition:"background .2s" }}>
                <div style={{ position:"absolute",top:3,left:v?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
