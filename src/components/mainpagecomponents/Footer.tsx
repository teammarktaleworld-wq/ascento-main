"use client";

// ─────────────────────────────────────────────────────────────────
// /components/Footer.jsx  — Ascento Abacus
// Drop-in replacement for the inline footer in page.jsx
// ─────────────────────────────────────────────────────────────────

import Link from "next/link";

export default function Footer() {
  const navCols = [
    {
      title: "📚 Programs",
      links: [
        ["Abacus Mastery",  "/programs#prog-abacus-mastery"],
        ["Brain Gym",       "/programs#prog-brain-gym"],
        ["Vedic Maths",     "/programs#prog-vedic-maths"],
        ["Pre-Abacus",      "/programs#prog-pre-abacus"],
        ["Tuitions",        "/programs#prog-tuitions"],
      ],
    },
    {
      title: "🏫 Company",
      links: [
        ["About Us",   "/"],
        ["Our Team",   "/#team"],
        ["Gallery",    "/#gallery"],
        ["Contact",    "/contact"],
      ],
    },
    {
      title: "🤝 Franchise",
      links: [
        ["Why Partner?",       "/franchise"],
        ["Investment Info",    "/franchise"],
        ["Training & Support", "/franchise"],
        ["Apply Now",          "/franchise#enquiry"],
      ],
    },
  ];

  const socials = [
    ["🌐 ascento.in", "#"],
    ["📘 Facebook",   "#"],
    ["📸 Instagram",  "#"],
  ];

  const contactInfo = [
    ["📍", "Dwarka, New Delhi, India"],
    ["📧", "Ascentoabacus35@gmail.com"],
    ["📞", "+91 9810366417"],
  ];

  return (
    <>
      <style>{`
        .asc-footer {
          background: #1A1A2E;
          padding: 64px 0 32px;
          border-top: 1px solid rgba(255,255,255,.06);
          font-family: 'Nunito', 'Fredoka One', system-ui, sans-serif;
        }
        .asc-footer-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
        }
        .asc-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        @media (max-width: 900px) {
          .asc-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
          .asc-footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 520px) {
          .asc-footer-grid { grid-template-columns: 1fr; }
        }

        /* Brand */
        .asc-footer-logo {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .asc-footer-logo-icon {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #FF6B6B, #FFB347);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .asc-footer-logo-title {
          font-family: 'Fredoka One', cursive; font-size: 20px; color: white;
        }
        .asc-footer-logo-title span { color: #FF6B6B; }
        .asc-footer-logo-sub {
          font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,.3); margin-top: 1px;
        }
        .asc-footer-tagline {
          font-size: 14px; color: rgba(255,255,255,.4); line-height: 1.7; margin-bottom: 20px;
        }
        .asc-footer-contact-row {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: rgba(255,255,255,.4); font-weight: 700;
        }

        /* Columns */
        .asc-footer-col-title {
          font-size: 13px; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,.35); margin-bottom: 20px;
        }
        .asc-footer-col-list {
          list-style: none; display: flex; flex-direction: column; gap: 12px;
          padding: 0; margin: 0;
        }
        .asc-footer-col-link {
          font-size: 14px; color: rgba(255,255,255,.55);
          text-decoration: none; font-weight: 700; transition: color .2s;
          display: inline-block;
        }
        .asc-footer-col-link:hover { color: #FFB347; }

        /* Bottom bar */
        .asc-footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 28px; flex-wrap: wrap; gap: 12px;
        }
        .asc-footer-copy {
          font-size: 13px; color: rgba(255,255,255,.25); font-weight: 700;
        }
        .asc-footer-socials { display: flex; gap: 16px; }
        .asc-footer-social {
          font-size: 12px; color: rgba(255,255,255,.25);
          text-decoration: none; font-weight: 800; transition: color .2s;
        }
        .asc-footer-social:hover { color: #FFB347; }

        /* Newsletter strip */
        .asc-footer-newsletter {
          background: rgba(255,179,71,.08);
          border: 1.5px solid rgba(255,179,71,.18);
          border-radius: 20px;
          padding: 24px 28px;
          margin-bottom: 48px;
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
          flex-wrap: wrap;
        }
        .asc-footer-newsletter-text {
          font-size: 15px; font-weight: 800; color: white;
        }
        .asc-footer-newsletter-sub {
          font-size: 12px; color: rgba(255,255,255,.4); margin-top: 3px; font-weight: 700;
        }
        .asc-footer-nl-form {
          display: flex; gap: 0; border-radius: 50px; overflow: hidden;
          border: 2px solid rgba(255,179,71,.35); flex-shrink: 0;
        }
        .asc-footer-nl-input {
          background: rgba(255,255,255,.07); border: none; outline: none;
          color: white; font-family: inherit; font-size: 13px; font-weight: 700;
          padding: 10px 18px; min-width: 200px;
        }
        .asc-footer-nl-input::placeholder { color: rgba(255,255,255,.3); }
        .asc-footer-nl-btn {
          background: linear-gradient(135deg, #FFB347, #FFD700);
          border: none; cursor: pointer; padding: 10px 20px;
          font-family: inherit; font-size: 13px; font-weight: 900; color: #1A1A2E;
          transition: opacity .2s;
        }
        .asc-footer-nl-btn:hover { opacity: .88; }
        @media (max-width: 600px) {
          .asc-footer-newsletter { flex-direction: column; }
          .asc-footer-nl-form { width: 100%; }
          .asc-footer-nl-input { flex: 1; min-width: 0; }
        }
      `}</style>

      <footer className="asc-footer">
        <div className="asc-footer-inner">

          {/* Newsletter */}
          <div className="asc-footer-newsletter">
            <div>
              <div className="asc-footer-newsletter-text">📬 Stay in the loop with Ascento!</div>
              <div className="asc-footer-newsletter-sub">Latest updates, competition news & parenting tips — right to your inbox.</div>
            </div>
            <div className="asc-footer-nl-form">
              <input className="asc-footer-nl-input" type="email" placeholder="Your email address" />
              <button className="asc-footer-nl-btn">Subscribe →</button>
            </div>
          </div>

          {/* Main grid */}
          <div className="asc-footer-grid">

            {/* Brand column */}
            <div className="asc-footer-brand">
              <div className="asc-footer-logo">
                <div className="asc-footer-logo-icon">🧮</div>
                <div>
                  <div className="asc-footer-logo-title">Ascento <span>Abacus</span></div>
                  <div className="asc-footer-logo-sub">Brain Development Academy</div>
                </div>
              </div>
              <p className="asc-footer-tagline">
                India's favourite abacus & brain development programme for children aged 4–17. Empowering young minds since 2010.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {contactInfo.map(([icon, text]) => (
                  <div key={text} className="asc-footer-contact-row">
                    <span style={{ fontSize: 15 }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {navCols.map((col) => (
              <div key={col.title}>
                <div className="asc-footer-col-title">{col.title}</div>
                <ul className="asc-footer-col-list">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="asc-footer-col-link">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="asc-footer-bottom">
            <span className="asc-footer-copy">
              © {new Date().getFullYear()} Ascento Abacus. All rights reserved. Made with 💛 for young learners.
            </span>
            <div className="asc-footer-socials">
              {socials.map(([label, href]) => (
                <Link key={label} href={href} className="asc-footer-social">{label}</Link>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}