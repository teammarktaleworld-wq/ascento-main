




// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Category {
//   id: string;
//   name: string;
//   description: string;
// }

// interface Purchase {
//   id: string;
//   orderId: string;
//   paidAmount: number;
//   discountApplied: number;
//   purchasedAt: string;
//   couponCode: string | null;
// }

// interface NoteItem {
//   id: string;
//   serialId: number;
//   title: string;
//   label: string;
//   categoryId: string | null;
//   category: { id: string; name: string } | null;
//   price: number;
//   discountPercent: number | null;
//   effectivePrice: number;
//   isPurchased: boolean;
//   locked: boolean;
//   demoUrl: string | null;
//   realUrl: string | null;
//   purchase: Purchase | null;
//   createdAt: string;
//   _count: { purchases: number };
// }

// interface NotesPageProps {
//   onToast?: (msg: string, type?: "success" | "error") => void;
// }

// declare global {
//   interface Window { Razorpay: any; }
// }

// // ─── Auth ─────────────────────────────────────────────────────────────────────

// async function getAuthHeaders(): Promise<Record<string, string>> {
//   // Retry up to 5 times with 300ms gap — handles the race on first load
//   for (let i = 0; i < 5; i++) {
//     const { data: { session } } = await supabase.auth.getSession();
//     if (session?.access_token) {
//       return {
//         Authorization: `Bearer ${session.access_token}`,
//         "Content-Type": "application/json",
//       };
//     }
//     await new Promise(r => setTimeout(r, 300));
//   }
//   throw new Error("No active session");
// }

// // ─── API helpers ──────────────────────────────────────────────────────────────

// async function fetchNotes(params: {
//   search?: string; categoryId?: string; price?: string; access?: string;
// }): Promise<{ notes: NoteItem[]; total: number }> {
//   const headers = await getAuthHeaders();
//   const sp = new URLSearchParams();
//   if (params.search)     sp.set("search",     params.search);
//   if (params.categoryId && params.categoryId !== "all") sp.set("categoryId", params.categoryId);
//   if (params.price  && params.price  !== "all") sp.set("price",  params.price);
//   if (params.access && params.access !== "all") sp.set("access", params.access);
//   const res  = await fetch(`/api/notes?${sp}`, { headers });
//   const json = await res.json();
//   if (!res.ok) throw new Error(json.error ?? "Failed to load notes");
//   return { notes: json.notes ?? [], total: json.total ?? 0 };
// }

// async function fetchCategories(): Promise<Category[]> {
//   const headers = await getAuthHeaders();
//   const res  = await fetch("/api/notes/categories", { headers });
//   const json = await res.json();
//   return json.categories ?? [];
// }

// async function fetchMyOrders(): Promise<Purchase[]> {
//   const headers = await getAuthHeaders();
//   const res  = await fetch("/api/notes/my-purchases", { headers });
//   const json = await res.json();
//   return json.purchases ?? [];
// }

// async function createOrder(itemId: string, itemType: string, couponCode?: string) {
//   const headers = await getAuthHeaders();
//   const res = await fetch("/api/razorpay-order", {
//     method: "POST", headers,
//     body: JSON.stringify({ itemId, itemType, couponCode }),
//   });
//   const json = await res.json();
//   if (!res.ok) throw new Error(json.error ?? "Failed to create order");
//   return json;
// }

// async function verifyPayment(data: {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }) {
//   const headers = await getAuthHeaders();
//   const res = await fetch("/api/razorpay-verify", {
//     method: "POST", headers, body: JSON.stringify(data),
//   });
//   const json = await res.json();
//   if (!res.ok) throw new Error(json.error ?? "Verification failed");
//   return json;
// }

// function loadRazorpay(): Promise<boolean> {
//   return new Promise((resolve) => {
//     if (window.Razorpay) return resolve(true);
//     const s = document.createElement("script");
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.onload  = () => resolve(true);
//     s.onerror = () => resolve(false);
//     document.body.appendChild(s);
//   });
// }

// // ─── PDF Viewer ───────────────────────────────────────────────────────────────

// function PdfViewer({ url, title, onClose, allowDownload }: {
//   url: string; title: string; onClose: () => void; allowDownload: boolean;
// }) {
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState(false);

//   useEffect(() => {
//     const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", h);
//     document.body.style.overflow = "hidden";
//     return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
//   }, [onClose]);

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 2000,
//       background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
//       display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
//     }}>
//       <div onClick={e => e.stopPropagation()} style={{
//         background: "#fff", borderRadius: 16, width: "100%", maxWidth: 1100,
//         height: "calc(100vh - 48px)", maxHeight: 900,
//         display: "flex", flexDirection: "column", overflow: "hidden",
//         boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
//       }}>
//         {/* Header */}
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "12px 20px", borderBottom: "1px solid #e5e7eb",
//           background: "#f9fafb", flexShrink: 0, gap: 12,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
//             <div style={{
//               width: 32, height: 32, borderRadius: 8, background: "#ef4444",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               flexShrink: 0, fontSize: 14, color: "#fff", fontWeight: 800,
//             }}>PDF</div>
//             <span style={{
//               fontWeight: 700, fontSize: 14, color: "#111827",
//               overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//             }}>{title}</span>
//           </div>
//           <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
//             <a href={url} target="_blank" rel="noopener noreferrer" style={{
//               padding: "7px 14px", borderRadius: 8, background: "#2563eb",
//               color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none",
//             }}>Open Tab ↗</a>
//             {allowDownload && (
//               <a href={url} download style={{
//                 padding: "7px 14px", borderRadius: 8, background: "#059669",
//                 color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none",
//               }}>⬇ Download</a>
//             )}
//             <button onClick={onClose} style={{
//               padding: "7px 14px", borderRadius: 8, background: "#f3f4f6",
//               color: "#374151", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
//             }}>✕ Close</button>
//           </div>
//         </div>
//         {/* Body */}
//         <div style={{ flex: 1, position: "relative", background: "#374151" }}>
//           {loading && !error && (
//             <div style={{
//               position: "absolute", inset: 0, display: "flex",
//               alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
//             }}>
//               <div style={{
//                 width: 36, height: 36, border: "3px solid #6b7280",
//                 borderTopColor: "#fff", borderRadius: "50%",
//                 animation: "spin 0.8s linear infinite",
//               }} />
//               <span style={{ color: "#d1d5db", fontSize: 13 }}>Loading PDF…</span>
//             </div>
//           )}
//           {error ? (
//             <div style={{
//               position: "absolute", inset: 0, display: "flex",
//               flexDirection: "column", alignItems: "center", justifyContent: "center",
//               color: "#f9fafb", gap: 16, padding: 32, textAlign: "center",
//             }}>
//               <div style={{ fontSize: 48 }}>⚠️</div>
//               <div style={{ fontSize: 15, fontWeight: 600 }}>Could not display PDF in browser.</div>
//               <a href={url} target="_blank" rel="noopener noreferrer" style={{
//                 padding: "10px 24px", borderRadius: 10, background: "#2563eb",
//                 color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none",
//               }}>Open in New Tab ↗</a>
//             </div>
//           ) : (
//             <iframe key={url} src={url}
//               style={{ width: "100%", height: "100%", border: "none", display: "block" }}
//               title={title}
//               onLoad={() => setLoading(false)}
//               onError={() => { setLoading(false); setError(true); }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Payment Modal ────────────────────────────────────────────────────────────

// function PaymentModal({ note, onClose, onSuccess }: {
//   note: NoteItem; onClose: () => void; onSuccess: (updated: NoteItem) => void;
// }) {
//   const [couponCode,    setCouponCode]    = useState("");
//   const [couponApplied, setCouponApplied] = useState<{ code: string; saved: number; discountPercent: number } | null>(null);
//   const [couponError,   setCouponError]   = useState("");
//   const [validating,    setValidating]    = useState(false);
//   const [loading,       setLoading]       = useState(false);
//   const [error,         setError]         = useState("");

//   const displayPrice = couponApplied
//     ? Math.max(0, note.effectivePrice - couponApplied.saved)
//     : note.effectivePrice;

//   useEffect(() => {
//     const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", h);
//     document.body.style.overflow = "hidden";
//     return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
//   }, [onClose]);

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) return;
//     setValidating(true);
//     setCouponError("");
//     try {
//       const result = await createOrder(note.id, "note", couponCode.trim().toUpperCase());
//       if (result.couponApplied) {
//         setCouponApplied(result.couponApplied);
//       } else if (result.free) {
//         setCouponApplied({ code: couponCode.trim().toUpperCase(), saved: note.effectivePrice, discountPercent: 100 });
//       } else {
//         setCouponError("Coupon has no effect on this item.");
//       }
//     } catch (e: any) {
//       setCouponError(e.message);
//     } finally {
//       setValidating(false);
//     }
//   };

//   const handlePay = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const loaded = await loadRazorpay();
//       if (!loaded) throw new Error("Payment gateway could not load.");

//       const order = await createOrder(note.id, "note", couponApplied?.code);

//       if (order.free) {
//         onSuccess({ ...note, isPurchased: true, locked: false });
//         onClose();
//         return;
//       }

//       const { data: { session } } = await supabase.auth.getSession();

//       await new Promise<void>((resolve, reject) => {
//         const rzp = new window.Razorpay({
//           key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//           order_id:    order.orderId,
//           amount:      order.amount,
//           currency:    order.currency,
//           name:        "My Ascento",
//           description: note.title,
//           prefill:     { email: session?.user?.email ?? "" },
//           theme:       { color: "#2563eb" },
//           handler: async (response: any) => {
//             try {
//               const verified = await verifyPayment({
//                 razorpay_order_id:   response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature:  response.razorpay_signature,
//               });
//               onSuccess({
//                 ...note,
//                 isPurchased: true,
//                 locked: false,
//                 realUrl: verified.pdfUrl,
//                 purchase: {
//                   id:              verified.purchaseId ?? "",
//                   orderId:         response.razorpay_order_id,
//                   paidAmount:      displayPrice,
//                   discountApplied: note.price - displayPrice,
//                   purchasedAt:     new Date().toISOString(),
//                   couponCode:      couponApplied?.code ?? null,
//                 },
//               });
//               onClose();
//               resolve();
//             } catch (err: any) { reject(err); }
//           },
//           modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
//         });
//         rzp.open();
//       });
//     } catch (e: any) {
//       if (e.message !== "Payment cancelled.") setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 2001,
//       background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: 16, boxSizing: "border-box",
//     }}>
//       <div onClick={e => e.stopPropagation()} style={{
//         background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460,
//         boxShadow: "0 32px 80px rgba(0,0,0,0.4)", overflow: "hidden",
//       }}>
//         {/* Header */}
//         <div style={{
//           background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
//           padding: "24px 28px", color: "#fff",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{
//               width: 44, height: 44, borderRadius: 12,
//               background: "rgba(255,255,255,0.2)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 22,
//             }}>📄</div>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
//                 Unlock Full Access
//               </div>
//               <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2, lineHeight: 1.3 }}>
//                 {note.title}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div style={{ padding: "24px 28px" }}>
//           {/* Price breakdown */}
//           <div style={{
//             background: "#f8fafc", borderRadius: 12, padding: "16px 18px",
//             marginBottom: 20, border: "1px solid #e2e8f0",
//           }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
//               Price Breakdown
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 6 }}>
//               <span>Base price</span>
//               <span style={{ fontWeight: 600 }}>₹{note.price}</span>
//             </div>
//             {note.discountPercent && (
//               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#059669", marginBottom: 6 }}>
//                 <span>Item discount ({note.discountPercent}%)</span>
//                 <span style={{ fontWeight: 600 }}>−₹{note.price - note.effectivePrice}</span>
//               </div>
//             )}
//             {couponApplied && (
//               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#059669", marginBottom: 6 }}>
//                 <span>Coupon {couponApplied.code} ({couponApplied.discountPercent}%)</span>
//                 <span style={{ fontWeight: 600 }}>−₹{couponApplied.saved}</span>
//               </div>
//             )}
//             <div style={{
//               display: "flex", justifyContent: "space-between", alignItems: "center",
//               paddingTop: 10, marginTop: 6, borderTop: "1.5px dashed #e2e8f0",
//             }}>
//               <span style={{ fontWeight: 800, fontSize: 14, color: "#1e293b" }}>Total to pay</span>
//               <span style={{ fontWeight: 900, fontSize: 24, color: displayPrice === 0 ? "#059669" : "#2563eb" }}>
//                 {displayPrice === 0 ? "FREE 🎉" : `₹${displayPrice}`}
//               </span>
//             </div>
//           </div>

//           {/* Coupon input */}
//           {!couponApplied ? (
//             <div style={{ marginBottom: 18 }}>
//               <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
//                 Have a coupon?
//               </div>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <input
//                   value={couponCode}
//                   onChange={e => setCouponCode(e.target.value.toUpperCase())}
//                   placeholder="Enter coupon code"
//                   onKeyDown={e => { if (e.key === "Enter") handleApplyCoupon(); }}
//                   style={{
//                     flex: 1, padding: "10px 14px", border: "2px solid #e2e8f0",
//                     borderRadius: 10, fontSize: 13, fontWeight: 700,
//                     letterSpacing: 2, outline: "none", fontFamily: "monospace",
//                     textTransform: "uppercase", color: "#1e293b",
//                     transition: "border-color 0.2s",
//                   }}
//                   onFocus={e => (e.target.style.borderColor = "#2563eb")}
//                   onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}
//                 />
//                 <button
//                   onClick={handleApplyCoupon}
//                   disabled={!couponCode.trim() || validating}
//                   style={{
//                     padding: "10px 18px", borderRadius: 10,
//                     background: couponCode.trim() ? "#1e3a5f" : "#f1f5f9",
//                     color: couponCode.trim() ? "#fff" : "#94a3b8",
//                     border: "none", fontWeight: 700, fontSize: 13,
//                     cursor: couponCode.trim() ? "pointer" : "not-allowed",
//                     whiteSpace: "nowrap", transition: "all 0.2s",
//                   }}
//                 >
//                   {validating ? "…" : "Apply"}
//                 </button>
//               </div>
//               {couponError && (
//                 <div style={{
//                   marginTop: 8, padding: "8px 12px", background: "#fef2f2",
//                   border: "1px solid #fecaca", borderRadius: 8,
//                   fontSize: 12, fontWeight: 600, color: "#dc2626",
//                 }}>
//                   ⚠ {couponError}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div style={{
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//               padding: "10px 14px", background: "#f0fdf4",
//               border: "1.5px solid #86efac", borderRadius: 10, marginBottom: 18,
//             }}>
//               <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>
//                 ✓ <span style={{ fontFamily: "monospace" }}>{couponApplied.code}</span> — saved ₹{couponApplied.saved}
//               </div>
//               <button
//                 onClick={() => { setCouponApplied(null); setCouponCode(""); }}
//                 style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16 }}>
//                 ✕
//               </button>
//             </div>
//           )}

//           {error && (
//             <div style={{
//               padding: "10px 14px", background: "#fef2f2", border: "1.5px solid #fecaca",
//               borderRadius: 10, marginBottom: 16, color: "#dc2626", fontSize: 13, fontWeight: 600,
//             }}>⚠ {error}</div>
//           )}

//           {/* Action buttons */}
//           <div style={{ display: "flex", gap: 10 }}>
//             <button onClick={onClose} style={{
//               flex: 1, padding: "13px 0", borderRadius: 12, background: "#f1f5f9",
//               color: "#64748b", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
//             }}>Cancel</button>
//             <button onClick={handlePay} disabled={loading} style={{
//               flex: 2, padding: "13px 0", borderRadius: 12,
//               background: displayPrice === 0
//                 ? "#059669"
//                 : "linear-gradient(135deg, #1e3a5f, #2563eb)",
//               color: "#fff", border: "none", fontWeight: 800, fontSize: 15,
//               cursor: loading ? "not-allowed" : "pointer",
//               opacity: loading ? 0.75 : 1, transition: "opacity 0.2s",
//             }}>
//               {loading ? "Processing…" : displayPrice === 0 ? "Unlock for Free 🎉" : `Pay ₹${displayPrice}`}
//             </button>
//           </div>

//           <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#94a3b8" }}>
//             🔒 Secured by Razorpay · UPI, Cards, Net Banking
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Orders Modal ─────────────────────────────────────────────────────────────

// function OrdersModal({ orders, onClose }: { orders: Purchase[]; onClose: () => void }) {
//   useEffect(() => {
//     const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", h);
//     document.body.style.overflow = "hidden";
//     return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
//   }, [onClose]);

//   const fmtDate = (d: string) =>
//     new Date(d).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//       hour: "2-digit", minute: "2-digit",
//     });

//   const totalSpent = orders.reduce((s, o) => s + o.paidAmount, 0);
//   const totalSaved = orders.reduce((s, o) => s + o.discountApplied, 0);

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 2001,
//       background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: 20,
//     }}>
//       <div onClick={e => e.stopPropagation()} style={{
//         background: "#fff", borderRadius: 20, width: "100%", maxWidth: 780,
//         maxHeight: "85vh", display: "flex", flexDirection: "column",
//         boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
//       }}>
//         {/* Header */}
//         <div style={{
//           padding: "20px 24px", borderBottom: "1px solid #e2e8f0",
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           flexShrink: 0,
//         }}>
//           <div>
//             <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#1e293b" }}>
//               🛒 My Orders
//             </h2>
//             <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>
//               {orders.length} purchases · ₹{totalSpent} spent · ₹{totalSaved} saved
//             </p>
//           </div>
//           <button onClick={onClose} style={{
//             padding: "8px 14px", borderRadius: 10, background: "#f1f5f9",
//             border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b",
//           }}>✕ Close</button>
//         </div>

//         {/* Table */}
//         <div style={{ flex: 1, overflow: "auto" }}>
//           {orders.length === 0 ? (
//             <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
//               <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
//               <p style={{ fontSize: 15, fontWeight: 600 }}>No purchases yet</p>
//             </div>
//           ) : (
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
//                   {["Order ID", "Date", "Amount", "Discount", "Coupon", "Status"].map(h => (
//                     <th key={h} style={{
//                       padding: "12px 16px", textAlign: "left",
//                       fontSize: 10, fontWeight: 800, color: "#94a3b8",
//                       textTransform: "uppercase", letterSpacing: 1,
//                       whiteSpace: "nowrap",
//                     }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((o, i) => (
//                   <tr key={o.id} style={{
//                     borderBottom: i < orders.length - 1 ? "1px solid #f1f5f9" : "none",
//                     background: i % 2 === 0 ? "#fff" : "#fafafa",
//                   }}>
//                     <td style={{ padding: "12px 16px" }}>
//                       <span style={{
//                         fontFamily: "monospace", fontSize: 11, fontWeight: 700,
//                         color: "#2563eb", background: "#eff6ff",
//                         padding: "3px 8px", borderRadius: 6,
//                       }}>
//                         {o.orderId ? o.orderId.slice(0, 16) + "…" : o.id.slice(0, 16) + "…"}
//                       </span>
//                     </td>
//                     <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>
//                       {fmtDate(o.purchasedAt)}
//                     </td>
//                     <td style={{ padding: "12px 16px" }}>
//                       <span style={{ fontWeight: 800, color: o.paidAmount === 0 ? "#059669" : "#1e293b", fontSize: 14 }}>
//                         {o.paidAmount === 0 ? "Free" : `₹${o.paidAmount}`}
//                       </span>
//                     </td>
//                     <td style={{ padding: "12px 16px" }}>
//                       {o.discountApplied > 0 ? (
//                         <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>
//                           −₹{o.discountApplied}
//                         </span>
//                       ) : (
//                         <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>
//                       )}
//                     </td>
//                     <td style={{ padding: "12px 16px" }}>
//                       {o.couponCode ? (
//                         <span style={{
//                           fontFamily: "monospace", fontSize: 11, fontWeight: 700,
//                           color: "#d97706", background: "#fef3c7",
//                           padding: "3px 8px", borderRadius: 6,
//                           border: "1px solid #fcd34d",
//                         }}>{o.couponCode}</span>
//                       ) : (
//                         <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>
//                       )}
//                     </td>
//                     <td style={{ padding: "12px 16px" }}>
//                       <span style={{
//                         fontSize: 10, fontWeight: 700, padding: "3px 10px",
//                         borderRadius: 20, background: "#dcfce7", color: "#15803d",
//                       }}>✓ Completed</span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Note Card ────────────────────────────────────────────────────────────────

// function NoteCard({ note, onView, onBuy }: {
//   note: NoteItem;
//   onView: (url: string, title: string, allowDownload: boolean) => void;
//   onBuy:  (n: NoteItem) => void;
// }) {
//   const [hovered, setHovered] = useState(false);
//   const isPurchased = note.isPurchased;
//   const hasDemo     = !!note.demoUrl;
//   const hasReal     = !!note.realUrl;

//   const fmtDate = (d: string) =>
//     new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         background: "#fff",
//         border: `1.5px solid ${isPurchased ? "#86efac" : hovered ? "#bfdbfe" : "#e2e8f0"}`,
//         borderRadius: 14, padding: "16px 20px",
//         display: "flex", alignItems: "flex-start", gap: 16,
//         transition: "all 0.15s", flexWrap: "wrap",
//         boxShadow: hovered ? "0 8px 24px rgba(37,99,235,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
//         cursor: "default",
//       }}
//     >
//       {/* Serial badge */}
//       <div style={{
//         width: 40, height: 40, borderRadius: 10, flexShrink: 0, marginTop: 2,
//         background: isPurchased ? "#dcfce7" : "#eff6ff",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontWeight: 900, fontSize: 11,
//         color: isPurchased ? "#15803d" : "#2563eb",
//         border: `1.5px solid ${isPurchased ? "#86efac" : "#bfdbfe"}`,
//       }}>
//         #{note.serialId}
//       </div>

//       {/* Main content */}
//       <div style={{ flex: 1, minWidth: 160 }}>
//         {/* Title row */}
//         <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
//           <span style={{ fontWeight: 800, fontSize: 15, color: "#1e293b" }}>{note.title}</span>
//           {isPurchased && (
//             <span style={{
//               fontSize: 10, fontWeight: 800, background: "#dcfce7", color: "#15803d",
//               padding: "2px 8px", borderRadius: 20, border: "1px solid #86efac",
//               whiteSpace: "nowrap",
//             }}>✓ Owned</span>
//           )}
//         </div>

//         {/* Badges row */}
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
//           {/* Price */}
//           {note.price === 0 ? (
//             <span style={{
//               padding: "3px 10px", borderRadius: 20, background: "#dcfce7",
//               color: "#15803d", fontSize: 10, fontWeight: 800, border: "1px solid #86efac",
//             }}>🆓 Free</span>
//           ) : isPurchased ? (
//             <span style={{
//               padding: "3px 10px", borderRadius: 20, background: "#dcfce7",
//               color: "#15803d", fontSize: 10, fontWeight: 800, border: "1px solid #86efac",
//             }}>✓ ₹{note.purchase?.paidAmount ?? note.effectivePrice} paid</span>
//           ) : (
//             <span style={{
//               padding: "3px 10px", borderRadius: 20, background: "#eff6ff",
//               color: "#2563eb", fontSize: 10, fontWeight: 800, border: "1px solid #bfdbfe",
//             }}>
//               {note.discountPercent ? (
//                 <><s style={{ opacity: 0.5 }}>₹{note.price}</s> ₹{note.effectivePrice}</>
//               ) : `₹${note.price}`}
//             </span>
//           )}

//           {/* Discount */}
//           {note.discountPercent && !isPurchased && (
//             <span style={{
//               padding: "3px 8px", borderRadius: 20, background: "#fef3c7",
//               color: "#92400e", fontSize: 10, fontWeight: 800, border: "1px solid #fcd34d",
//             }}>{note.discountPercent}% OFF</span>
//           )}

//           {/* Category */}
//           {note.category && (
//             <span style={{
//               padding: "3px 10px", borderRadius: 20, background: "#f5f3ff",
//               color: "#6d28d9", fontSize: 10, fontWeight: 700, border: "1px solid #ddd6fe",
//             }}>📁 {note.category.name}</span>
//           )}

//           {/* Label */}
//           {note.label && (
//             <span style={{
//               padding: "3px 10px", borderRadius: 20, background: "#fefce8",
//               color: "#92400e", fontSize: 10, fontWeight: 600, border: "1px solid #fde68a",
//             }}>{note.label}</span>
//           )}

//           {/* PDF availability indicators */}
//           {hasDemo && (
//             <span style={{
//               padding: "3px 8px", borderRadius: 8, background: "#eff6ff",
//               color: "#1d4ed8", fontSize: 10, fontWeight: 700, border: "1px solid #bfdbfe",
//             }}>👁 Preview</span>
//           )}
//           {hasReal && (
//             <span style={{
//               padding: "3px 8px", borderRadius: 8,
//               background: isPurchased ? "#dcfce7" : "#f1f5f9",
//               color: isPurchased ? "#15803d" : "#94a3b8",
//               fontSize: 10, fontWeight: 700,
//               border: `1px solid ${isPurchased ? "#86efac" : "#e2e8f0"}`,
//             }}>📄 Full PDF</span>
//           )}

//           {/* Purchase date */}
//           {note.purchase && (
//             <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
//               Purchased {fmtDate(note.purchase.purchasedAt)}
//               {note.purchase.discountApplied > 0 && ` · saved ₹${note.purchase.discountApplied}`}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Action buttons */}
//       <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
//         {/* Demo preview — always visible */}
//         {hasDemo && (
//           <button
//             onClick={() => onView(note.demoUrl!, `${note.title} (Preview)`, false)}
//             style={{
//               padding: "8px 14px", borderRadius: 9,
//               background: "#eff6ff", color: "#2563eb",
//               border: "1.5px solid #bfdbfe",
//               fontWeight: 700, fontSize: 12, cursor: "pointer",
//               transition: "all 0.15s", whiteSpace: "nowrap",
//             }}
//             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#dbeafe"; }}
//             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#eff6ff"; }}
//           >👁 Preview</button>
//         )}

//         {isPurchased && hasReal ? (
//           <button
//             onClick={() => onView(note.realUrl!, note.title, true)}
//             style={{
//               padding: "8px 14px", borderRadius: 9,
//               background: "#dcfce7", color: "#15803d",
//               border: "1.5px solid #86efac",
//               fontWeight: 700, fontSize: 12, cursor: "pointer",
//               transition: "all 0.15s", whiteSpace: "nowrap",
//             }}
//             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#bbf7d0"; }}
//             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#dcfce7"; }}
//           >📄 View Full</button>
//         ) : !isPurchased && note.price > 0 ? (
//           <button
//             onClick={() => onBuy(note)}
//             style={{
//               padding: "8px 16px", borderRadius: 9,
//               background: hovered
//                 ? "linear-gradient(135deg, #1e3a5f, #2563eb)"
//                 : "#f1f5f9",
//               color: hovered ? "#fff" : "#475569",
//               border: "none", fontWeight: 700, fontSize: 12,
//               cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
//             }}
//           >🔒 Unlock ₹{note.effectivePrice}</button>
//         ) : null}

//         {/* Download for owned */}
//         {isPurchased && hasReal && note.realUrl && (
//           <a href={note.realUrl} download target="_blank" rel="noopener noreferrer" style={{
//             padding: "8px 12px", borderRadius: 9,
//             background: "#1e3a5f", color: "#fff",
//             fontWeight: 700, fontSize: 12, textDecoration: "none",
//             whiteSpace: "nowrap", transition: "opacity 0.15s",
//           }}
//           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
//           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
//           >⬇ Download</a>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// function Skeleton() {
//   return (
//     <div style={{
//       background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14,
//       padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
//     }}>
//       <div style={{
//         width: 40, height: 40, borderRadius: 10, background: "#f1f5f9",
//         animation: "pulse 1.5s ease-in-out infinite", flexShrink: 0,
//       }} />
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
//         <div style={{ height: 14, width: "50%", borderRadius: 6, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out infinite" }} />
//         <div style={{ height: 10, width: "30%", borderRadius: 6, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out 0.2s infinite" }} />
//       </div>
//       <div style={{ display: "flex", gap: 8 }}>
//         <div style={{ height: 34, width: 80, borderRadius: 9, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out infinite" }} />
//         <div style={{ height: 34, width: 100, borderRadius: 9, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out 0.15s infinite" }} />
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function NotesPage({ onToast }: NotesPageProps) {
//   const [notes,       setNotes]       = useState<NoteItem[]>([]);
//   const [categories,  setCategories]  = useState<Category[]>([]);
//   const [orders,      setOrders]      = useState<Purchase[]>([]);
//   const [loading,     setLoading]     = useState(true);
//   const [loadError,   setLoadError]   = useState("");

//   // Filters
//   const [search,       setSearch]       = useState("");
//   const [catFilter,    setCatFilter]    = useState("all");
//   const [priceFilter,  setPriceFilter]  = useState("all");
//   const [accessFilter, setAccessFilter] = useState("all");
//   const [showFilters,  setShowFilters]  = useState(false);

//   // Modals
//   const [viewer,    setViewer]    = useState<{ url: string; title: string; allowDownload: boolean } | null>(null);
//   const [buyNote,   setBuyNote]   = useState<NoteItem | null>(null);
//   const [showOrders, setShowOrders] = useState(false);

//   // Stats
//   const owned  = notes.filter(n => n.isPurchased && n.price > 0).length;
//   const free   = notes.filter(n => n.price === 0).length;
//   const locked = notes.filter(n => !n.isPurchased && n.price > 0).length;
//   const saved  = notes.reduce((s, n) => s + (n.purchase?.discountApplied ?? 0), 0);

//   useEffect(() => {
//     fetchCategories().then(setCategories).catch(() => {});
//     fetchMyOrders().then(setOrders).catch(() => {});
//   }, []);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setLoadError("");
//     try {
//       const { notes: data } = await fetchNotes({
//         search:     search || undefined,
//         categoryId: catFilter    !== "all" ? catFilter    : undefined,
//         price:      priceFilter  !== "all" ? priceFilter  : undefined,
//         access:     accessFilter !== "all" ? accessFilter : undefined,
//       });
//       setNotes(data);
//     } catch (e) {
//       setLoadError(e instanceof Error ? e.message : "Failed to load notes");
//     } finally {
//       setLoading(false);
//     }
//   }, [search, catFilter, priceFilter, accessFilter]);

//   useEffect(() => {
//     const t = setTimeout(load, search ? 350 : 0);
//     return () => clearTimeout(t);
//   }, [load, search]);

//   const handleBuySuccess = (updated: NoteItem) => {
//     setNotes(ns => ns.map(n => n.id === updated.id ? updated : n));
//     onToast?.(`✓ Unlocked: ${updated.title}`, "success");
//     fetchMyOrders().then(setOrders).catch(() => {});
//     setTimeout(load, 600);
//   };

//   const hasActiveFilters = catFilter !== "all" || priceFilter !== "all" || accessFilter !== "all";

//   const clearFilters = () => {
//     setCatFilter("all");
//     setPriceFilter("all");
//     setAccessFilter("all");
//     setSearch("");
//   };

//   return (
//     <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 940, margin: "0 auto" }}>
//       <style>{`
//         @keyframes spin  { to { transform: rotate(360deg); } }
//         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
//       `}</style>

//       {/* ── Header ─────────────────────────────────────────── */}
//       <div style={{
//         display: "flex", alignItems: "flex-start", justifyContent: "space-between",
//         flexWrap: "wrap", gap: 12, marginBottom: 20,
//       }}>
//         <div>
//           <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1e293b" }}>
//             📚 Notes & Study Materials
//           </h1>
//           <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 13 }}>
//             Study resources and PDFs from your teacher
//           </p>
//         </div>

//         <button
//           onClick={() => setShowOrders(true)}
//           style={{
//             display: "flex", alignItems: "center", gap: 8,
//             padding: "9px 16px", borderRadius: 10,
//             background: "#1e3a5f", color: "#fff",
//             border: "none", fontWeight: 700, fontSize: 13,
//             cursor: "pointer", whiteSpace: "nowrap",
//           }}
//         >
//           🛒 My Orders {orders.length > 0 && (
//             <span style={{
//               background: "#2563eb", padding: "1px 7px",
//               borderRadius: 20, fontSize: 11, fontWeight: 800,
//             }}>{orders.length}</span>
//           )}
//         </button>
//       </div>

//       {/* ── Stats strip ────────────────────────────────────── */}
//       {!loading && notes.length > 0 && (
//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
//           {[
//             { label: "Free",     value: free,   color: "#059669", bg: "#dcfce7", border: "#86efac" },
//             { label: "Owned",    value: owned,  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
//             { label: "Locked",   value: locked, color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
//             ...(saved > 0 ? [{ label: "Total Saved", value: `₹${saved}`, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" }] : []),
//           ].map((s, i) => (
//             <div key={i} style={{
//               display: "flex", alignItems: "center", gap: 8,
//               padding: "8px 14px", borderRadius: 10,
//               background: s.bg, border: `1px solid ${s.border}`,
//             }}>
//               <span style={{ fontWeight: 900, fontSize: 16, color: s.color }}>{s.value}</span>
//               <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.label}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ── Search + filter bar ─────────────────────────────── */}
//       <div style={{
//         background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14,
//         padding: "12px 14px", marginBottom: 16,
//       }}>
//         {/* Search row */}
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           <div style={{ position: "relative", flex: 1 }}>
//             <span style={{
//               position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
//               fontSize: 15, color: "#94a3b8",
//             }}>🔍</span>
//             <input
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search notes by title or tag…"
//               style={{
//                 width: "100%", padding: "10px 36px 10px 38px",
//                 border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14,
//                 outline: "none", background: "#f8fafc", boxSizing: "border-box",
//                 color: "#1e293b", transition: "border-color 0.2s",
//               }}
//               onFocus={e => (e.target.style.borderColor = "#2563eb")}
//               onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}
//             />
//             {search && (
//               <button onClick={() => setSearch("")} style={{
//                 position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
//                 background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16,
//               }}>✕</button>
//             )}
//           </div>

//           {/* Filter toggle */}
//           <button
//             onClick={() => setShowFilters(f => !f)}
//             style={{
//               display: "flex", alignItems: "center", gap: 6,
//               padding: "10px 14px", borderRadius: 10,
//               background: hasActiveFilters ? "#eff6ff" : "#f8fafc",
//               border: `1.5px solid ${hasActiveFilters ? "#2563eb" : "#e2e8f0"}`,
//               color: hasActiveFilters ? "#2563eb" : "#64748b",
//               fontWeight: 700, fontSize: 13, cursor: "pointer",
//               whiteSpace: "nowrap",
//             }}
//           >
//             ⚙ Filters{hasActiveFilters ? " •" : ""}
//           </button>

//           {hasActiveFilters && (
//             <button onClick={clearFilters} style={{
//               padding: "10px 14px", borderRadius: 10, background: "#fef2f2",
//               border: "1.5px solid #fecaca", color: "#dc2626",
//               fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
//             }}>✕ Clear</button>
//           )}
//         </div>

//         {/* Filter dropdowns (collapsible) */}
//         {showFilters && (
//           <div style={{
//             display: "flex", gap: 10, flexWrap: "wrap",
//             paddingTop: 12, marginTop: 12, borderTop: "1px solid #f1f5f9",
//           }}>
//             {/* Access filter */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//               <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
//                 Access
//               </label>
//               <select
//                 value={accessFilter}
//                 onChange={e => setAccessFilter(e.target.value)}
//                 style={{
//                   padding: "8px 12px", border: "1.5px solid #e2e8f0",
//                   borderRadius: 9, fontSize: 13, fontWeight: 600,
//                   color: "#1e293b", background: "#f8fafc",
//                   outline: "none", cursor: "pointer",
//                 }}
//               >
//                 <option value="all">All Notes</option>
//                 <option value="free">🆓 Free Only</option>
//                 <option value="owned">✓ My Library</option>
//                 <option value="locked">🔒 Locked</option>
//               </select>
//             </div>

//             {/* Price filter */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//               <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
//                 Price
//               </label>
//               <select
//                 value={priceFilter}
//                 onChange={e => setPriceFilter(e.target.value)}
//                 style={{
//                   padding: "8px 12px", border: "1.5px solid #e2e8f0",
//                   borderRadius: 9, fontSize: 13, fontWeight: 600,
//                   color: "#1e293b", background: "#f8fafc",
//                   outline: "none", cursor: "pointer",
//                 }}
//               >
//                 <option value="all">Any Price</option>
//                 <option value="free">Free</option>
//                 <option value="paid">Paid</option>
//               </select>
//             </div>

//             {/* Category filter */}
//             {categories.length > 0 && (
//               <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//                 <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
//                   Category
//                 </label>
//                 <select
//                   value={catFilter}
//                   onChange={e => setCatFilter(e.target.value)}
//                   style={{
//                     padding: "8px 12px", border: "1.5px solid #e2e8f0",
//                     borderRadius: 9, fontSize: 13, fontWeight: 600,
//                     color: "#1e293b", background: "#f8fafc",
//                     outline: "none", cursor: "pointer", minWidth: 140,
//                   }}
//                 >
//                   <option value="all">All Categories</option>
//                   {categories.map(c => (
//                     <option key={c.id} value={c.id}>📁 {c.name}</option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ── Error ───────────────────────────────────────────── */}
//       {loadError && (
//         <div style={{
//           padding: "14px 18px", borderRadius: 12, background: "#fef2f2",
//           border: "1.5px solid #fecaca", color: "#dc2626", fontSize: 14,
//           marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 12,
//         }}>
//           <span>⚠️ {loadError}</span>
//           <button onClick={load} style={{
//             padding: "6px 14px", borderRadius: 8, background: "#dc2626",
//             color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
//           }}>Retry</button>
//         </div>
//       )}

//       {/* ── Notes list ──────────────────────────────────────── */}
//       {loading ? (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
//         </div>
//       ) : notes.length === 0 && !loadError ? (
//         <div style={{
//           textAlign: "center", padding: "64px 24px", color: "#94a3b8",
//           border: "2px dashed #e2e8f0", borderRadius: 14, fontSize: 15,
//         }}>
//           <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
//           <p style={{ fontWeight: 700, margin: 0, color: "#64748b" }}>
//             {search ? `No notes found for "${search}"` : "No notes match your filters"}
//           </p>
//           {(search || hasActiveFilters) && (
//             <button onClick={clearFilters} style={{
//               marginTop: 16, padding: "8px 20px", borderRadius: 10,
//               background: "#2563eb", color: "#fff", border: "none",
//               fontWeight: 700, fontSize: 13, cursor: "pointer",
//             }}>Clear filters</button>
//           )}
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {notes.map(note => (
//             <NoteCard
//               key={note.id}
//               note={note}
//               onView={(url, title, allowDownload) => setViewer({ url, title, allowDownload })}
//               onBuy={setBuyNote}
//             />
//           ))}
//         </div>
//       )}

//       {/* ── Modals ──────────────────────────────────────────── */}
//       {viewer && (
//         <PdfViewer
//           url={viewer.url}
//           title={viewer.title}
//           allowDownload={viewer.allowDownload}
//           onClose={() => setViewer(null)}
//         />
//       )}
//       {buyNote && (
//         <PaymentModal
//           note={buyNote}
//           onClose={() => setBuyNote(null)}
//           onSuccess={updated => {
//             handleBuySuccess(updated);
//             setBuyNote(null);
//           }}
//         />
//       )}
//       {showOrders && (
//         <OrdersModal orders={orders} onClose={() => setShowOrders(false)} />
//       )}
//     </div>
//   );
// }












"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Purchase {
  id: string;
  orderId: string;
  paidAmount: number;
  discountApplied: number;
  purchasedAt: string;
  couponCode: string | null;
}

interface NoteItem {
  id: string;
  serialId: number;
  title: string;
  label: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  price: number;
  discountPercent: number | null;
  effectivePrice: number;
  isPurchased: boolean;
  locked: boolean;
  demoUrl: string | null;
  realUrl: string | null;
  purchase: Purchase | null;
  createdAt: string;
  _count: { purchases: number };
}

interface NotesPageProps {
  onToast?: (msg: string, type?: "success" | "error") => void;
}

declare global {
  interface Window { Razorpay: any; }
}

// ─── API helpers ──────────────────────────────────────────────────────────────
// All helpers now accept token as a parameter — no supabase calls inside components

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function fetchNotes(
  token: string,
  params: { search?: string; categoryId?: string; price?: string; access?: string }
): Promise<{ notes: NoteItem[]; total: number }> {
  const sp = new URLSearchParams();
  if (params.search)                              sp.set("search",     params.search);
  if (params.categoryId && params.categoryId !== "all") sp.set("categoryId", params.categoryId);
  if (params.price      && params.price      !== "all") sp.set("price",      params.price);
  if (params.access     && params.access     !== "all") sp.set("access",     params.access);

  const res  = await fetch(`/api/notes?${sp}`, { headers: authHeaders(token), cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to load notes");
  return { notes: json.notes ?? [], total: json.total ?? 0 };
}

async function fetchCategories(token: string): Promise<Category[]> {
  const res  = await fetch("/api/notes/categories", { headers: authHeaders(token), cache: "no-store" });
  const json = await res.json();
  return json.categories ?? [];
}

async function fetchMyOrders(token: string): Promise<Purchase[]> {
  const res  = await fetch("/api/notes/my-purchases", { headers: authHeaders(token), cache: "no-store" });
  const json = await res.json();
  return json.purchases ?? [];
}

async function createOrder(token: string, itemId: string, itemType: string, couponCode?: string) {
  const res = await fetch("/api/razorpay-order", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ itemId, itemType, couponCode }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to create order");
  return json;
}

async function verifyPayment(token: string, data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const res = await fetch("/api/razorpay-verify", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Verification failed");
  return json;
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src     = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────
// No changes needed here — no auth calls

function PdfViewer({ url, title, onClose, allowDownload }: {
  url: string; title: string; onClose: () => void; allowDownload: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 1100,
        height: "calc(100vh - 48px)", maxHeight: 900,
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", borderBottom: "1px solid #e5e7eb",
          background: "#f9fafb", flexShrink: 0, gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "#ef4444",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 14, color: "#fff", fontWeight: 800,
            }}>PDF</div>
            <span style={{
              fontWeight: 700, fontSize: 14, color: "#111827",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{title}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{
              padding: "7px 14px", borderRadius: 8, background: "#2563eb",
              color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>Open Tab ↗</a>
            {allowDownload && (
              <a href={url} download style={{
                padding: "7px 14px", borderRadius: 8, background: "#059669",
                color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none",
              }}>⬇ Download</a>
            )}
            <button onClick={onClose} style={{
              padding: "7px 14px", borderRadius: 8, background: "#f3f4f6",
              color: "#374151", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>✕ Close</button>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative", background: "#374151" }}>
          {loading && !error && (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, border: "3px solid #6b7280",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              <span style={{ color: "#d1d5db", fontSize: 13 }}>Loading PDF…</span>
            </div>
          )}
          {error ? (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#f9fafb", gap: 16, padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 48 }}>⚠️</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Could not display PDF in browser.</div>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{
                padding: "10px 24px", borderRadius: 10, background: "#2563eb",
                color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none",
              }}>Open in New Tab ↗</a>
            </div>
          ) : (
            <iframe key={url} src={url}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title={title}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
// Now receives token as a prop instead of calling supabase internally

function PaymentModal({ note, token, userEmail, onClose, onSuccess }: {
  note: NoteItem;
  token: string;           // ← passed from parent
  userEmail: string;       // ← passed from parent
  onClose: () => void;
  onSuccess: (updated: NoteItem) => void;
}) {
  const [couponCode,    setCouponCode]    = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; saved: number; discountPercent: number } | null>(null);
  const [couponError,   setCouponError]   = useState("");
  const [validating,    setValidating]    = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");

  const displayPrice = couponApplied
    ? Math.max(0, note.effectivePrice - couponApplied.saved)
    : note.effectivePrice;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidating(true);
    setCouponError("");
    try {
      const result = await createOrder(token, note.id, "note", couponCode.trim().toUpperCase());
      if (result.couponApplied) {
        setCouponApplied(result.couponApplied);
      } else if (result.free) {
        setCouponApplied({ code: couponCode.trim().toUpperCase(), saved: note.effectivePrice, discountPercent: 100 });
      } else {
        setCouponError("Coupon has no effect on this item.");
      }
    } catch (e: any) {
      setCouponError(e.message);
    } finally {
      setValidating(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Payment gateway could not load.");

      const order = await createOrder(token, note.id, "note", couponApplied?.code);

      if (order.free) {
        onSuccess({ ...note, isPurchased: true, locked: false });
        onClose();
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id:    order.orderId,
          amount:      order.amount,
          currency:    order.currency,
          name:        "My Ascento",
          description: note.title,
          prefill:     { email: userEmail },   // ← from prop, no supabase call
          theme:       { color: "#2563eb" },
          handler: async (response: any) => {
            try {
              const verified = await verifyPayment(token, {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              });
              onSuccess({
                ...note,
                isPurchased: true,
                locked: false,
                realUrl: verified.pdfUrl,
                purchase: {
                  id:              verified.purchaseId ?? "",
                  orderId:         response.razorpay_order_id,
                  paidAmount:      displayPrice,
                  discountApplied: note.price - displayPrice,
                  purchasedAt:     new Date().toISOString(),
                  couponCode:      couponApplied?.code ?? null,
                },
              });
              onClose();
              resolve();
            } catch (err: any) { reject(err); }
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
        });
        rzp.open();
      });
    } catch (e: any) {
      if (e.message !== "Payment cancelled.") setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 2001,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, boxSizing: "border-box",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460,
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)", overflow: "hidden",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
          padding: "24px 28px", color: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>📄</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
                Unlock Full Access
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2, lineHeight: 1.3 }}>
                {note.title}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>
          <div style={{
            background: "#f8fafc", borderRadius: 12, padding: "16px 18px",
            marginBottom: 20, border: "1px solid #e2e8f0",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Price Breakdown
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 6 }}>
              <span>Base price</span>
              <span style={{ fontWeight: 600 }}>₹{note.price}</span>
            </div>
            {note.discountPercent && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#059669", marginBottom: 6 }}>
                <span>Item discount ({note.discountPercent}%)</span>
                <span style={{ fontWeight: 600 }}>−₹{note.price - note.effectivePrice}</span>
              </div>
            )}
            {couponApplied && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#059669", marginBottom: 6 }}>
                <span>Coupon {couponApplied.code} ({couponApplied.discountPercent}%)</span>
                <span style={{ fontWeight: 600 }}>−₹{couponApplied.saved}</span>
              </div>
            )}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingTop: 10, marginTop: 6, borderTop: "1.5px dashed #e2e8f0",
            }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: "#1e293b" }}>Total to pay</span>
              <span style={{ fontWeight: 900, fontSize: 24, color: displayPrice === 0 ? "#059669" : "#2563eb" }}>
                {displayPrice === 0 ? "FREE 🎉" : `₹${displayPrice}`}
              </span>
            </div>
          </div>

          {!couponApplied ? (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                Have a coupon?
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  onKeyDown={e => { if (e.key === "Enter") handleApplyCoupon(); }}
                  style={{
                    flex: 1, padding: "10px 14px", border: "2px solid #e2e8f0",
                    borderRadius: 10, fontSize: 13, fontWeight: 700,
                    letterSpacing: 2, outline: "none", fontFamily: "monospace",
                    textTransform: "uppercase", color: "#1e293b", transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#2563eb")}
                  onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || validating}
                  style={{
                    padding: "10px 18px", borderRadius: 10,
                    background: couponCode.trim() ? "#1e3a5f" : "#f1f5f9",
                    color: couponCode.trim() ? "#fff" : "#94a3b8",
                    border: "none", fontWeight: 700, fontSize: 13,
                    cursor: couponCode.trim() ? "pointer" : "not-allowed",
                    whiteSpace: "nowrap", transition: "all 0.2s",
                  }}
                >{validating ? "…" : "Apply"}</button>
              </div>
              {couponError && (
                <div style={{
                  marginTop: 8, padding: "8px 12px", background: "#fef2f2",
                  border: "1px solid #fecaca", borderRadius: 8,
                  fontSize: 12, fontWeight: 600, color: "#dc2626",
                }}>⚠ {couponError}</div>
              )}
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", background: "#f0fdf4",
              border: "1.5px solid #86efac", borderRadius: 10, marginBottom: 18,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>
                ✓ <span style={{ fontFamily: "monospace" }}>{couponApplied.code}</span> — saved ₹{couponApplied.saved}
              </div>
              <button
                onClick={() => { setCouponApplied(null); setCouponCode(""); }}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16 }}>
                ✕
              </button>
            </div>
          )}

          {error && (
            <div style={{
              padding: "10px 14px", background: "#fef2f2", border: "1.5px solid #fecaca",
              borderRadius: 10, marginBottom: 16, color: "#dc2626", fontSize: 13, fontWeight: 600,
            }}>⚠ {error}</div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "13px 0", borderRadius: 12, background: "#f1f5f9",
              color: "#64748b", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>Cancel</button>
            <button onClick={handlePay} disabled={loading} style={{
              flex: 2, padding: "13px 0", borderRadius: 12,
              background: displayPrice === 0 ? "#059669" : "linear-gradient(135deg, #1e3a5f, #2563eb)",
              color: "#fff", border: "none", fontWeight: 800, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1, transition: "opacity 0.2s",
            }}>
              {loading ? "Processing…" : displayPrice === 0 ? "Unlock for Free 🎉" : `Pay ₹${displayPrice}`}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#94a3b8" }}>
            🔒 Secured by Razorpay · UPI, Cards, Net Banking
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Orders Modal — no changes needed ────────────────────────────────────────

function OrdersModal({ orders, onClose }: { orders: Purchase[]; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const totalSpent = orders.reduce((s, o) => s + o.paidAmount, 0);
  const totalSaved = orders.reduce((s, o) => s + o.discountApplied, 0);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 2001,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 780,
        maxHeight: "85vh", display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#1e293b" }}>🛒 My Orders</h2>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>
              {orders.length} purchases · ₹{totalSpent} spent · ₹{totalSaved} saved
            </p>
          </div>
          <button onClick={onClose} style={{
            padding: "8px 14px", borderRadius: 10, background: "#f1f5f9",
            border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b",
          }}>✕ Close</button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {orders.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
              <p style={{ fontSize: 15, fontWeight: 600 }}>No purchases yet</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                  {["Order ID", "Date", "Amount", "Discount", "Coupon", "Status"].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 800,
                      color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} style={{
                    borderBottom: i < orders.length - 1 ? "1px solid #f1f5f9" : "none",
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                        color: "#2563eb", background: "#eff6ff", padding: "3px 8px", borderRadius: 6,
                      }}>
                        {o.orderId ? o.orderId.slice(0, 16) + "…" : o.id.slice(0, 16) + "…"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>
                      {fmtDate(o.purchasedAt)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontWeight: 800, color: o.paidAmount === 0 ? "#059669" : "#1e293b", fontSize: 14 }}>
                        {o.paidAmount === 0 ? "Free" : `₹${o.paidAmount}`}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {o.discountApplied > 0
                        ? <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>−₹{o.discountApplied}</span>
                        : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {o.couponCode
                        ? <span style={{
                            fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                            color: "#d97706", background: "#fef3c7",
                            padding: "3px 8px", borderRadius: 6, border: "1px solid #fcd34d",
                          }}>{o.couponCode}</span>
                        : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 10px",
                        borderRadius: 20, background: "#dcfce7", color: "#15803d",
                      }}>✓ Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Note Card — no changes needed ───────────────────────────────────────────

function NoteCard({ note, onView, onBuy }: {
  note: NoteItem;
  onView: (url: string, title: string, allowDownload: boolean) => void;
  onBuy:  (n: NoteItem) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isPurchased = note.isPurchased;
  const hasDemo     = !!note.demoUrl;
  const hasReal     = !!note.realUrl;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${isPurchased ? "#86efac" : hovered ? "#bfdbfe" : "#e2e8f0"}`,
        borderRadius: 14, padding: "16px 20px",
        display: "flex", alignItems: "flex-start", gap: 16,
        transition: "all 0.15s", flexWrap: "wrap",
        boxShadow: hovered ? "0 8px 24px rgba(37,99,235,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
        cursor: "default",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0, marginTop: 2,
        background: isPurchased ? "#dcfce7" : "#eff6ff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: 11,
        color: isPurchased ? "#15803d" : "#2563eb",
        border: `1.5px solid ${isPurchased ? "#86efac" : "#bfdbfe"}`,
      }}>#{note.serialId}</div>

      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#1e293b" }}>{note.title}</span>
          {isPurchased && (
            <span style={{
              fontSize: 10, fontWeight: 800, background: "#dcfce7", color: "#15803d",
              padding: "2px 8px", borderRadius: 20, border: "1px solid #86efac", whiteSpace: "nowrap",
            }}>✓ Owned</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {note.price === 0 ? (
            <span style={{ padding: "3px 10px", borderRadius: 20, background: "#dcfce7", color: "#15803d", fontSize: 10, fontWeight: 800, border: "1px solid #86efac" }}>🆓 Free</span>
          ) : isPurchased ? (
            <span style={{ padding: "3px 10px", borderRadius: 20, background: "#dcfce7", color: "#15803d", fontSize: 10, fontWeight: 800, border: "1px solid #86efac" }}>
              ✓ ₹{note.purchase?.paidAmount ?? note.effectivePrice} paid
            </span>
          ) : (
            <span style={{ padding: "3px 10px", borderRadius: 20, background: "#eff6ff", color: "#2563eb", fontSize: 10, fontWeight: 800, border: "1px solid #bfdbfe" }}>
              {note.discountPercent
                ? <><s style={{ opacity: 0.5 }}>₹{note.price}</s> ₹{note.effectivePrice}</>
                : `₹${note.price}`}
            </span>
          )}
          {note.discountPercent && !isPurchased && (
            <span style={{ padding: "3px 8px", borderRadius: 20, background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 800, border: "1px solid #fcd34d" }}>
              {note.discountPercent}% OFF
            </span>
          )}
          {note.category && (
            <span style={{ padding: "3px 10px", borderRadius: 20, background: "#f5f3ff", color: "#6d28d9", fontSize: 10, fontWeight: 700, border: "1px solid #ddd6fe" }}>
              📁 {note.category.name}
            </span>
          )}
          {note.label && (
            <span style={{ padding: "3px 10px", borderRadius: 20, background: "#fefce8", color: "#92400e", fontSize: 10, fontWeight: 600, border: "1px solid #fde68a" }}>
              {note.label}
            </span>
          )}
          {hasDemo && (
            <span style={{ padding: "3px 8px", borderRadius: 8, background: "#eff6ff", color: "#1d4ed8", fontSize: 10, fontWeight: 700, border: "1px solid #bfdbfe" }}>👁 Preview</span>
          )}
          {hasReal && (
            <span style={{
              padding: "3px 8px", borderRadius: 8,
              background: isPurchased ? "#dcfce7" : "#f1f5f9",
              color: isPurchased ? "#15803d" : "#94a3b8",
              fontSize: 10, fontWeight: 700,
              border: `1px solid ${isPurchased ? "#86efac" : "#e2e8f0"}`,
            }}>📄 Full PDF</span>
          )}
          {note.purchase && (
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
              Purchased {fmtDate(note.purchase.purchasedAt)}
              {note.purchase.discountApplied > 0 && ` · saved ₹${note.purchase.discountApplied}`}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
        {hasDemo && (
          <button
            onClick={() => onView(note.demoUrl!, `${note.title} (Preview)`, false)}
            style={{ padding: "8px 14px", borderRadius: 9, background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#dbeafe"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#eff6ff"; }}
          >👁 Preview</button>
        )}
        {isPurchased && hasReal ? (
          <button
            onClick={() => onView(note.realUrl!, note.title, true)}
            style={{ padding: "8px 14px", borderRadius: 9, background: "#dcfce7", color: "#15803d", border: "1.5px solid #86efac", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#bbf7d0"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#dcfce7"; }}
          >📄 View Full</button>
        ) : !isPurchased && note.price > 0 ? (
          <button
            onClick={() => onBuy(note)}
            style={{ padding: "8px 16px", borderRadius: 9, background: hovered ? "linear-gradient(135deg, #1e3a5f, #2563eb)" : "#f1f5f9", color: hovered ? "#fff" : "#475569", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
          >🔒 Unlock ₹{note.effectivePrice}</button>
        ) : null}
        {isPurchased && hasReal && note.realUrl && (
          <a href={note.realUrl} download target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", borderRadius: 9, background: "#1e3a5f", color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >⬇ Download</a>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton — no changes ────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out infinite", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 14, width: "50%", borderRadius: 6, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 10, width: "30%", borderRadius: 6, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out 0.2s infinite" }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ height: 34, width: 80, borderRadius: 9, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 34, width: 100, borderRadius: 9, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out 0.15s infinite" }} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotesPage({ onToast }: NotesPageProps) {
  const { token, user } = useAuth(); // ← single source of truth

  const [notes,       setNotes]       = useState<NoteItem[]>([]);
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [orders,      setOrders]      = useState<Purchase[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [loadError,   setLoadError]   = useState("");

  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("all");
  const [priceFilter,  setPriceFilter]  = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [showFilters,  setShowFilters]  = useState(false);

  const [viewer,     setViewer]     = useState<{ url: string; title: string; allowDownload: boolean } | null>(null);
  const [buyNote,    setBuyNote]    = useState<NoteItem | null>(null);
  const [showOrders, setShowOrders] = useState(false);

  const owned  = notes.filter(n => n.isPurchased && n.price > 0).length;
  const free   = notes.filter(n => n.price === 0).length;
  const locked = notes.filter(n => !n.isPurchased && n.price > 0).length;
  const saved  = notes.reduce((s, n) => s + (n.purchase?.discountApplied ?? 0), 0);

  // ── Gate all fetches on token ─────────────────────────────────────────────
  useEffect(() => {
    if (!token) return; // ← never fires without token
    fetchCategories(token).then(setCategories).catch(() => {});
    fetchMyOrders(token).then(setOrders).catch(() => {});
  }, [token]); // ← re-runs if token changes (new user)

  const load = useCallback(async () => {
    if (!token) return; // ← guard
    setLoading(true);
    setLoadError("");
    try {
      const { notes: data } = await fetchNotes(token, {
        search:     search     || undefined,
        categoryId: catFilter    !== "all" ? catFilter    : undefined,
        price:      priceFilter  !== "all" ? priceFilter  : undefined,
        access:     accessFilter !== "all" ? accessFilter : undefined,
      });
      setNotes(data);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [token, search, catFilter, priceFilter, accessFilter]);

  useEffect(() => {
    if (!token) return; // ← guard
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search, token]);

  const handleBuySuccess = (updated: NoteItem) => {
    setNotes(ns => ns.map(n => n.id === updated.id ? updated : n));
    onToast?.(`✓ Unlocked: ${updated.title}`, "success");
    if (token) fetchMyOrders(token).then(setOrders).catch(() => {});
    setTimeout(load, 600);
  };

  const hasActiveFilters = catFilter !== "all" || priceFilter !== "all" || accessFilter !== "all";
  const clearFilters = () => { setCatFilter("all"); setPriceFilter("all"); setAccessFilter("all"); setSearch(""); };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 940, margin: "0 auto" }}>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1e293b" }}>📚 Notes & Study Materials</h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 13 }}>Study resources and PDFs from your teacher</p>
        </div>
        <button onClick={() => setShowOrders(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 10, background: "#1e3a5f", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
          🛒 My Orders {orders.length > 0 && (
            <span style={{ background: "#2563eb", padding: "1px 7px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{orders.length}</span>
          )}
        </button>
      </div>

      {!loading && notes.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          {[
            { label: "Free",   value: free,   color: "#059669", bg: "#dcfce7", border: "#86efac" },
            { label: "Owned",  value: owned,  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
            { label: "Locked", value: locked, color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
            ...(saved > 0 ? [{ label: "Total Saved", value: `₹${saved}`, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" }] : []),
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ fontWeight: 900, fontSize: 16, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#94a3b8" }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes by title or tag…"
              style={{ width: "100%", padding: "10px 36px 10px 38px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", background: "#f8fafc", boxSizing: "border-box", color: "#1e293b", transition: "border-color 0.2s" }}
              onFocus={e => (e.target.style.borderColor = "#2563eb")}
              onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>✕</button>
            )}
          </div>
          <button onClick={() => setShowFilters(f => !f)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 10, background: hasActiveFilters ? "#eff6ff" : "#f8fafc", border: `1.5px solid ${hasActiveFilters ? "#2563eb" : "#e2e8f0"}`, color: hasActiveFilters ? "#2563eb" : "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            ⚙ Filters{hasActiveFilters ? " •" : ""}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>✕ Clear</button>
          )}
        </div>

        {showFilters && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 12, marginTop: 12, borderTop: "1px solid #f1f5f9" }}>
            {[
              { label: "Access", value: accessFilter, onChange: setAccessFilter, options: [["all","All Notes"],["free","🆓 Free Only"],["owned","✓ My Library"],["locked","🔒 Locked"]] },
              { label: "Price",  value: priceFilter,  onChange: setPriceFilter,  options: [["all","Any Price"],["free","Free"],["paid","Paid"]] },
            ].map(f => (
              <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</label>
                <select value={f.value} onChange={e => f.onChange(e.target.value)} style={{ padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#1e293b", background: "#f8fafc", outline: "none", cursor: "pointer" }}>
                  {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            {categories.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Category</label>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#1e293b", background: "#f8fafc", outline: "none", cursor: "pointer", minWidth: 140 }}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>📁 {c.name}</option>)}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {loadError && (
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", fontSize: 14, marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>⚠️ {loadError}</span>
          <button onClick={load} style={{ padding: "6px 14px", borderRadius: 8, background: "#dc2626", color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : notes.length === 0 && !loadError ? (
        <div style={{ textAlign: "center", padding: "64px 24px", color: "#94a3b8", border: "2px dashed #e2e8f0", borderRadius: 14, fontSize: 15 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontWeight: 700, margin: 0, color: "#64748b" }}>
            {search ? `No notes found for "${search}"` : "No notes match your filters"}
          </p>
          {(search || hasActiveFilters) && (
            <button onClick={clearFilters} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 10, background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Clear filters</button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onView={(url, title, allowDownload) => setViewer({ url, title, allowDownload })}
              onBuy={setBuyNote}
            />
          ))}
        </div>
      )}

      {viewer && (
        <PdfViewer url={viewer.url} title={viewer.title} allowDownload={viewer.allowDownload} onClose={() => setViewer(null)} />
      )}

      {/* ← token and userEmail passed down — no supabase calls inside modal */}
      {buyNote && token && (
        <PaymentModal
          note={buyNote}
          token={token}
          userEmail={user?.email ?? ""}
          onClose={() => setBuyNote(null)}
          onSuccess={updated => { handleBuySuccess(updated); setBuyNote(null); }}
        />
      )}

      {showOrders && (
        <OrdersModal orders={orders} onClose={() => setShowOrders(false)} />
      )}
    </div>
  );
}