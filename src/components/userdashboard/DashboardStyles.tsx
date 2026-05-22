export default function DashboardStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

      /* ── Reset & Base ── */
      .ud-root *, .ud-root *::before, .ud-root *::after {
        box-sizing: border-box; margin: 0; padding: 0;
      }

      /* ══════════════════════════════════
         ROOT SHELL — fills the viewport
         regardless of parent layout
      ══════════════════════════════════ */
      .ud-root {
        position: fixed;
        inset: 0;
        display: flex;
        font-family: 'Nunito', sans-serif;
        background: #FFFDF7;
        z-index: 50;
        overflow: hidden;
      }

      /* ══════════════════════════════════
         SIDEBAR
      ══════════════════════════════════ */
      .ud-sidebar {
        width: 240px;
        background: #1A1A2E;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        overflow: hidden;
        box-shadow: 4px 0 24px rgba(0,0,0,0.18);
        z-index: 200;
        transition: transform 0.3s cubic-bezier(.4,0,.2,1);
      }
      .sidebar-logo {
        padding: 22px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        flex-shrink: 0;
      }
      .logo-icon {
        width: 40px; height: 40px; border-radius: 12px;
        background: linear-gradient(135deg,#FF6B6B,#FFB347);
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; flex-shrink: 0;
      }
      .logo-text { color: #fff; font-weight: 800; font-size: 17px; font-family: 'Fredoka One', cursive; }
      .logo-sub  { color: #FFB34799; font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }

      .sidebar-nav { flex: 1; overflow-y: auto; padding: 12px 0; }
      .sidebar-nav::-webkit-scrollbar { width: 3px; }
      .sidebar-nav::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 3px; }

      .nav-item {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 18px; margin: 2px 8px; border-radius: 12px;
        cursor: pointer; transition: all 0.15s;
        background: transparent; border: none; border-left: 3px solid transparent;
        font-family: 'Nunito', sans-serif; width: calc(100% - 16px);
      }
      .nav-item:hover { background: rgba(255,107,107,0.08); }
      .nav-item.active {
        background: linear-gradient(135deg,#FF6B6B22,#FFB34722);
        border-left-color: #FF6B6B;
      }
      .nav-icon  { font-size: 18px; flex-shrink: 0; }
      .nav-label { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.6); flex: 1; white-space: nowrap; }
      .nav-item.active .nav-label { color: #FF6B6B; font-weight: 700; }
      .nav-badge {
        background: #FF6B6B; color: #fff;
        border-radius: 10px; padding: 2px 7px;
        font-size: 11px; font-weight: 700;
      }

      .sidebar-user {
        padding: 14px 16px;
        border-top: 1px solid rgba(255,255,255,0.08);
        display: flex; align-items: center; gap: 10px; flex-shrink: 0;
      }
      .user-av {
        width: 36px; height: 36px; border-radius: 12px; flex-shrink: 0;
        background: linear-gradient(135deg,#FF6B6B,#FFB347);
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-weight: 800; font-size: 13px;
      }
      .user-name { color: #fff; font-weight: 700; font-size: 13px; }
      .user-role { color: #FFB34799; font-size: 11px; }

      /* Mobile overlay */
      .sidebar-overlay {
        display: none; position: fixed; inset: 0;
        background: rgba(0,0,0,0.5); z-index: 190;
      }
      .sidebar-overlay.visible { display: block; }

      /* ══════════════════════════════════
         MAIN AREA
      ══════════════════════════════════ */
      .ud-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

      .ud-topbar {
        height: 60px; background: #fff;
        border-bottom: 2px solid #FFF0E8;
        display: flex; align-items: center;
        padding: 0 24px; gap: 14px; flex-shrink: 0;
      }
      .menu-btn {
        background: none; border: none; cursor: pointer;
        font-size: 20px; color: #777; display: none;
        padding: 4px; border-radius: 8px;
      }
      .topbar-title {
        font-weight: 800; font-size: 17px; color: #1A1A2E;
        font-family: 'Fredoka One', cursive; flex: 1;
      }
      .topbar-pill {
        background: #FFF0F0; color: #FF6B6B;
        font-weight: 800; font-size: 12px;
        padding: 6px 14px; border-radius: 50px;
        border: 1.5px solid #FFD6D6; white-space: nowrap;
      }
      .topbar-notif {
        width: 34px; height: 34px; border-radius: 10px;
        background: #FFF0F0; border: 1.5px solid #FFD6D6;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; font-size: 16px; position: relative; flex-shrink: 0;
      }
      .notif-dot {
        width: 7px; height: 7px; background: #FF6B6B; border-radius: 50%;
        position: absolute; top: 5px; right: 5px;
      }

      /* Scroll container */
      .ud-scroll { flex: 1; overflow-y: auto; padding: 24px; }
      .ud-scroll::-webkit-scrollbar { width: 5px; }
      .ud-scroll::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 3px; }

      /* ══════════════════════════════════
         PAGE CONTENT COMMONS
      ══════════════════════════════════ */
      .page-content { display: flex; flex-direction: column; gap: 18px; }
      .page-header  { margin-bottom: 4px; }
      .page-title   { font-family: 'Fredoka One', cursive; font-size: 26px; color: #1A1A2E; }
      .page-sub     { font-size: 13px; color: #999; margin-top: 2px; }

      /* ══════════════════════════════════
         WELCOME BANNER
      ══════════════════════════════════ */
      .welcome-banner {
        background: linear-gradient(135deg,#FF6B6B,#FFB347);
        border-radius: 22px; padding: 28px 32px;
        display: flex; align-items: center; justify-content: space-between;
        box-shadow: 0 8px 32px rgba(255,107,107,0.3);
        overflow: hidden; position: relative;
      }
      .welcome-tag {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(255,255,255,0.2); border-radius: 50px;
        padding: 4px 14px; font-size: 11px; font-weight: 800;
        color: #fff; letter-spacing: 0.1em; text-transform: uppercase;
        margin-bottom: 10px;
      }
      .welcome-title {
        font-family: 'Fredoka One', cursive; font-size: clamp(20px,3vw,28px);
        color: #fff; line-height: 1.2; margin-bottom: 8px;
      }
      .welcome-title span { color: rgba(255,255,255,0.9); }
      .welcome-sub  { font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 600; line-height: 1.5; }
      .welcome-emoji { font-size: 64px; line-height: 1; flex-shrink: 0; }

      /* ══════════════════════════════════
         QUICK STATS
      ══════════════════════════════════ */
      .quick-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
      .quick-stat-card {
        background: var(--card-bg); border-radius: 18px; padding: 18px;
        border: 2px solid color-mix(in srgb, var(--accent) 20%, transparent);
        display: flex; gap: 14px; align-items: center;
        transition: transform 0.2s, box-shadow 0.2s; cursor: default;
      }
      .quick-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
      .qs-icon  { font-size: 28px; flex-shrink: 0; }
      .qs-label { font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
      .qs-value { font-family: 'Fredoka One', cursive; font-size: 22px; color: var(--accent); line-height: 1; }
      .qs-sub   { font-size: 11px; color: #999; margin-top: 3px; }

      /* ══════════════════════════════════
         SHARED CARD
      ══════════════════════════════════ */
      .dash-card {
        background: #fff; border-radius: 18px; padding: 20px;
        border: 1px solid #FFF0E8;
      }
      .card-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
      .card-title { font-size: 15px; font-weight: 800; color: #1A1A2E; }
      .card-sub   { font-size: 11px; color: #999; margin-top: 2px; }
      .card-action {
        background: none; border: none; cursor: pointer;
        font-size: 13px; font-weight: 700; color: #FF6B6B;
        font-family: 'Nunito', sans-serif;
      }

      /* Home layout */
      .home-mid    { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
      .home-bottom { display: grid; grid-template-columns: 1.2fr 1fr; gap: 18px; }

      /* Today's class */
      .today-class-box {
        display: flex; align-items: center; gap: 14px;
        background: #FFF0F0; border-radius: 14px;
        padding: 14px 16px; margin-bottom: 12px;
        border: 1.5px solid #FFD6D6; position: relative;
      }
      .today-dot {
        width: 10px; height: 10px; border-radius: 50%;
        background: #FF6B6B; flex-shrink: 0; animation: ud-pulse 2s infinite;
      }
      @keyframes ud-pulse {
        0%,100% { box-shadow: 0 0 0 0 #FF6B6B55; }
        50%      { box-shadow: 0 0 0 8px transparent; }
      }
      .today-info    { flex: 1; }
      .today-subject { font-weight: 800; color: #1A1A2E; font-size: 14px; }
      .today-meta    { font-size: 12px; color: #777; margin-top: 2px; }
      .today-live    {
        background: #FF6B6B; color: #fff; font-size: 9px;
        font-weight: 900; letter-spacing: 0.1em;
        padding: 3px 10px; border-radius: 50px;
      }
      .today-tip { font-size: 12px; color: #999; padding: 10px 14px; background: #FFFDF7; border-radius: 10px; }

      /* Announcement items */
      .ann-item {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 0; border-bottom: 1px solid #FFF0E8;
      }
      .ann-item:last-child { border-bottom: none; }
      .ann-dot    { width: 8px; height: 8px; border-radius: 50%; background: var(--ann-color); flex-shrink: 0; }
      .ann-body   { flex: 1; }
      .ann-title  { font-size: 13px; font-weight: 700; color: #1A1A2E; line-height: 1.3; }
      .ann-date   { font-size: 11px; color: #999; margin-top: 2px; }
      .ann-urgent {
        background: #FF6B6B; color: #fff; font-size: 9px;
        font-weight: 900; letter-spacing: 0.1em;
        padding: 3px 8px; border-radius: 50px; flex-shrink: 0;
      }

      /* Notes row */
      .notes-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
      .note-mini {
        background: #FFFDF7; border-radius: 14px; padding: 16px;
        border: 1.5px solid #FFF0E8; cursor: pointer; position: relative;
        transition: all 0.2s;
      }
      .note-mini:hover { transform: translateY(-2px); border-color: var(--note-color); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .note-mini-emoji { font-size: 24px; margin-bottom: 8px; }
      .note-mini-name  { font-size: 12px; font-weight: 700; color: #1A1A2E; line-height: 1.3; margin-bottom: 4px; }
      .note-mini-meta  { font-size: 10px; color: #999; }
      .note-new-dot    { width: 8px; height: 8px; background: #FF6B6B; border-radius: 50%; position: absolute; top: 10px; right: 10px; }

      /* Progress ring */
      .progress-card .progress-row { display: flex; gap: 20px; align-items: center; }
      .progress-ring-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
      .progress-svg  { width: 80px; height: 80px; }
      .ring-label    { font-size: 11px; font-weight: 700; color: #999; }
      .progress-bars { flex: 1; display: flex; flex-direction: column; gap: 10px; }
      .prog-bar-row  { display: flex; align-items: center; gap: 10px; }
      .prog-bar-label { font-size: 12px; font-weight: 700; color: #555; width: 60px; flex-shrink: 0; }
      .prog-bar-track { flex: 1; height: 6px; background: #FFF0E8; border-radius: 6px; overflow: hidden; }
      .prog-bar-fill  { height: 100%; border-radius: 6px; transition: width 1.2s cubic-bezier(.4,0,.2,1); }
      .prog-bar-pct   { font-size: 11px; font-weight: 700; color: #999; width: 32px; text-align: right; flex-shrink: 0; }

      /* Exam card inner */
      .exam-card-inner  { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 12px; }
      .exam-date-badge  {
        background: #FFB34720; border-radius: 12px; padding: 12px 14px;
        text-align: center; flex-shrink: 0; border: 1.5px solid #FFB34744;
      }
      .exam-month { font-size: 10px; font-weight: 800; color: #FFB347; letter-spacing: 0.1em; }
      .exam-day   { font-family: 'Fredoka One', cursive; font-size: 26px; color: #FFB347; line-height: 1; }
      .exam-info .exam-name { font-size: 15px; font-weight: 800; color: #1A1A2E; margin-bottom: 4px; }
      .exam-info .exam-meta { font-size: 12px; color: #999; margin-bottom: 6px; }
      .exam-topics { font-size: 12px; color: #555; font-weight: 600; line-height: 1.4; }
      .exam-days-left {
        font-size: 12px; font-weight: 700; color: #FFB347;
        background: #FFF8EE; padding: 8px 14px; border-radius: 10px;
        display: flex; align-items: center; gap: 6px;
        border: 1px solid #FFB34744;
      }

      /* ══════════════════════════════════
         ANNOUNCEMENTS PAGE
      ══════════════════════════════════ */
      .ann-list { display: flex; flex-direction: column; gap: 14px; }
      .ann-full-card {
        background: #fff; border-radius: 16px; padding: 20px;
        border: 2px solid var(--ann-color,#FFF0E8);
        display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
        border-left-width: 5px;
      }
      .ann-full-left  { flex: 1; }
      .ann-full-tag   { display: inline-block; font-size: 11px; font-weight: 800; padding: 3px 12px; border-radius: 50px; margin-bottom: 8px; }
      .ann-full-title { font-size: 15px; font-weight: 800; color: #1A1A2E; margin-bottom: 8px; }
      .ann-full-body  { font-size: 13px; color: #555; line-height: 1.6; font-weight: 600; margin-bottom: 10px; }
      .ann-full-date  { font-size: 11px; color: #999; }
      .ann-full-urgent {
        background: #FF6B6B; color: #fff; font-size: 10px; font-weight: 900;
        letter-spacing: 0.1em; padding: 4px 12px; border-radius: 50px;
        flex-shrink: 0; height: fit-content;
      }

      /* ══════════════════════════════════
         SCHEDULE PAGE
      ══════════════════════════════════ */
      .schedule-week { display: grid; grid-template-columns: repeat(6,1fr); gap: 12px; }
      .sched-day-card {
        background: #fff; border-radius: 16px; padding: 16px 14px;
        border: 2px solid #FFF0E8; min-height: 160px;
        display: flex; flex-direction: column; gap: 8px;
      }
      .sched-day-card.today-day { border-color: #FF6B6B33; background: #FFF5F5; }
      .sched-day-label { font-size: 12px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.1em; }
      .sched-day-card.today-day .sched-day-label { color: #FF6B6B; }
      .sched-class-info {
        background: color-mix(in srgb, var(--sched-color) 12%, white);
        border-radius: 10px; padding: 10px;
        border: 1px solid color-mix(in srgb, var(--sched-color) 25%, transparent);
        flex: 1; display: flex; flex-direction: column; gap: 4px;
      }
      .sched-subject  { font-size: 12px; font-weight: 800; color: #1A1A2E; line-height: 1.3; }
      .sched-time     { font-size: 11px; color: #777; font-weight: 600; }
      .sched-teacher, .sched-room { font-size: 10px; color: #999; }
      .sched-live-pill {
        background: #FF6B6B; color: #fff; font-size: 9px;
        font-weight: 900; padding: 3px 8px; border-radius: 50px;
        width: fit-content; margin-top: 4px; letter-spacing: 0.08em;
      }
      .sched-off { font-size: 12px; color: #ccc; font-weight: 700; margin-top: 8px; }
      .class-detail-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
      .class-detail-item { background: #FFFDF7; border-radius: 12px; padding: 14px; border: 1px solid #FFF0E8; }
      .cd-label { font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
      .cd-value { font-size: 13px; font-weight: 800; color: #1A1A2E; }

      /* ══════════════════════════════════
         NOTES PAGE
      ══════════════════════════════════ */
      .notes-filter { display: flex; gap: 8px; flex-wrap: wrap; }
      .filter-pill {
        padding: 6px 16px; border-radius: 50px; border: 2px solid #FFF0E8;
        background: transparent; color: #999; font-size: 13px; font-weight: 700;
        cursor: pointer; font-family: 'Nunito', sans-serif; transition: all 0.15s;
      }
      .filter-pill.active, .filter-pill:hover { background: #FF6B6B; border-color: #FF6B6B; color: #fff; }
      .notes-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
      .note-card {
        background: #fff; border-radius: 18px; padding: 20px;
        border: 2px solid #FFF0E8; cursor: pointer; position: relative;
        transition: all 0.25s; display: flex; flex-direction: column; gap: 8px;
      }
      .note-card:hover { border-color: var(--note-color); transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); }
      .note-new-badge {
        position: absolute; top: 12px; right: 12px;
        background: #FF6B6B; color: #fff; font-size: 9px; font-weight: 900;
        padding: 3px 8px; border-radius: 50px; letter-spacing: 0.1em;
      }
      .note-card-emoji { font-size: 32px; }
      .note-card-name  { font-size: 13px; font-weight: 800; color: #1A1A2E; line-height: 1.4; }
      .note-card-prog  { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
      .note-card-meta  { font-size: 11px; color: #999; }
      .note-card-btn   { margin-top: 6px; padding: 8px; border-radius: 10px; text-align: center; color: #fff; font-size: 12px; font-weight: 800; }

      /* ══════════════════════════════════
         ATTENDANCE PAGE
      ══════════════════════════════════ */
      .att-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
      .att-stat-box { border-radius: 16px; padding: 18px; text-align: center; border: 2px solid; }
      .att-stat-val   { font-family: 'Fredoka One', cursive; font-size: 28px; line-height: 1; margin-bottom: 4px; }
      .att-stat-label { font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 0.1em; }
      .att-list { display: flex; flex-direction: column; gap: 8px; }
      .att-row {
        display: flex; align-items: center; gap: 14px;
        padding: 12px 14px; border-radius: 12px;
        background: #FFFDF7; border: 1px solid #FFF0E8;
      }
      .att-date-col { width: 60px; flex-shrink: 0; }
      .att-date     { font-size: 13px; font-weight: 800; color: #1A1A2E; }
      .att-day      { font-size: 10px; color: #999; font-weight: 600; }
      .att-bar      { width: 2px; height: 28px; background: #FFF0E8; border-radius: 2px; flex-shrink: 0; }
      .att-subject  { flex: 1; font-size: 13px; color: #555; font-weight: 600; }
      .att-badge    { font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 50px; flex-shrink: 0; }
      .att-present  { background: #F0FFFE; color: #4ECDC4; }
      .att-absent   { background: #FFF0F0; color: #FF6B6B; }
      .att-late     { background: #FFF8EE; color: #FFB347; }

      /* ══════════════════════════════════
         EXAMS PAGE
      ══════════════════════════════════ */
      .exams-list { display: flex; flex-direction: column; gap: 14px; }
      .exam-full-card {
        background: #fff; border-radius: 18px; padding: 20px 24px;
        border: 2px solid #FFF0E8;
        display: flex; align-items: center; justify-content: space-between; gap: 20px;
      }
      .exam-full-card.exam-upcoming { border-color: #FFB34744; background: #FFFBF5; }
      .exam-full-left  { display: flex; gap: 16px; align-items: flex-start; }
      .efcard-date-box { border-radius: 12px; padding: 10px 14px; text-align: center; flex-shrink: 0; }
      .efcard-month    { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; }
      .efcard-day      { font-family: 'Fredoka One', cursive; font-size: 24px; line-height: 1; }
      .efcard-title    { font-size: 15px; font-weight: 800; color: #1A1A2E; margin-bottom: 4px; }
      .efcard-meta     { font-size: 12px; color: #999; margin-bottom: 6px; }
      .efcard-upcoming-tag {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 12px; font-weight: 700; color: #FFB347;
        background: #FFF8EE; padding: 4px 12px; border-radius: 50px;
        border: 1px solid #FFB34744;
      }
      .efcard-result { font-size: 13px; font-weight: 700; color: #555; }
      .efcard-grade  { display: inline-block; margin-top: 4px; font-size: 13px; font-weight: 800; }
      .efcard-score-circle {
        width: 60px; height: 60px; border-radius: 50%;
        border: 3px solid; display: flex; align-items: center; justify-content: center;
        font-size: 14px; flex-shrink: 0;
      }

      /* ══════════════════════════════════
         FEES PAGE
      ══════════════════════════════════ */
      .fee-alert {
        background: linear-gradient(135deg,#FF6B6B,#FFB347);
        border-radius: 16px; padding: 18px 22px;
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        box-shadow: 0 6px 20px rgba(255,107,107,0.3);
      }
      .fee-alert-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 3px; }
      .fee-alert-sub   { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 600; }
      .fee-pay-btn {
        background: #fff; color: #FF6B6B; border: none;
        font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 14px;
        padding: 10px 22px; border-radius: 50px; cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1); flex-shrink: 0;
      }
      .fee-list { display: flex; flex-direction: column; gap: 8px; }
      .fee-row {
        display: flex; align-items: center; gap: 14px;
        padding: 14px 16px; background: #FFFDF7;
        border-radius: 12px; border: 1px solid #FFF0E8; flex-wrap: wrap;
      }
      .fee-month        { font-size: 14px; font-weight: 800; color: #1A1A2E; flex: 1; min-width: 120px; }
      .fee-amount       { font-size: 15px; font-weight: 800; color: #1A1A2E; font-family: 'Fredoka One', cursive; }
      .fee-status-badge { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 50px; flex-shrink: 0; }
      .fee-paid         { background: #F0FFFE; color: #4ECDC4; }
      .fee-pending      { background: #FFF0F0; color: #FF6B6B; }
      .receipt-btn {
        background: none; border: 1.5px solid #FFF0E8;
        font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
        color: #999; padding: 4px 12px; border-radius: 50px; cursor: pointer;
        transition: all 0.15s;
      }
      .receipt-btn:hover { border-color: #FF6B6B; color: #FF6B6B; }

      /* ══════════════════════════════════
         PROFILE PAGE
      ══════════════════════════════════ */
      .profile-hero {
        text-align: center; padding: 32px 20px;
        background: linear-gradient(160deg,#FFF0F0,#FFFDF7);
        border-radius: 20px; border: 2px solid #FFD6D6;
      }
      .profile-avatar-big {
        width: 72px; height: 72px; border-radius: 22px;
        background: linear-gradient(135deg,#FF6B6B,#FFB347);
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 26px; font-weight: 800;
        margin: 0 auto 14px;
        box-shadow: 0 8px 24px rgba(255,107,107,0.3);
      }
      .profile-name      { font-family: 'Fredoka One', cursive; font-size: 22px; color: #1A1A2E; margin-bottom: 6px; }
      .profile-prog-badge {
        display: inline-block; background: #FF6B6B22; color: #FF6B6B;
        font-size: 12px; font-weight: 800; padding: 5px 16px; border-radius: 50px;
        border: 1.5px solid #FF6B6B44;
      }
      .profile-grid   { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
      .profile-field  { background: #fff; border-radius: 14px; padding: 16px; border: 1px solid #FFF0E8; }
      .pf-label { font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
      .pf-value { font-size: 13px; font-weight: 800; color: #1A1A2E; }
      .profile-actions { display: flex; gap: 12px; flex-wrap: wrap; }
      .profile-btn {
        padding: 11px 22px; border-radius: 50px; border: 2px solid #FFF0E8;
        background: #fff; color: #555; font-family: 'Nunito', sans-serif;
        font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s;
      }
      .profile-btn:hover       { border-color: #FF6B6B; color: #FF6B6B; }
      .profile-btn.danger:hover { border-color: #FF6B6B; background: #FF6B6B; color: #fff; }

      /* ══════════════════════════════════
         TOAST
      ══════════════════════════════════ */
      .ud-toast {
        position: fixed; bottom: 28px; right: 28px;
        background: linear-gradient(135deg,#FF6B6B,#FFB347);
        color: #fff; padding: 14px 22px; border-radius: 14px;
        font-weight: 700; font-size: 14px;
        box-shadow: 0 8px 24px rgba(255,107,107,0.4);
        z-index: 9999; animation: ud-toastIn 0.3s ease;
        font-family: 'Nunito', sans-serif;
      }
      @keyframes ud-toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

      /* ══════════════════════════════════
         MEDIA QUERIES
      ══════════════════════════════════ */
      @media (max-width: 1024px) {
        .quick-stats       { grid-template-columns: repeat(2,1fr); }
        .home-mid          { grid-template-columns: 1fr; }
        .home-bottom       { grid-template-columns: 1fr; }
        .notes-grid        { grid-template-columns: repeat(2,1fr); }
        .notes-row         { grid-template-columns: repeat(2,1fr); }
        .profile-grid      { grid-template-columns: repeat(2,1fr); }
        .schedule-week     { grid-template-columns: repeat(3,1fr); }
        .class-detail-grid { grid-template-columns: repeat(2,1fr); }
      }

      @media (max-width: 768px) {
        .menu-btn { display: flex; }
        .ud-sidebar {
          position: absolute; left: 0; top: 0; height: 100%;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
        }
        .ud-sidebar.open    { transform: translateX(0); }
        .welcome-emoji      { display: none; }
        .welcome-banner     { padding: 22px; }
        .welcome-title      { font-size: clamp(18px,5vw,24px); }
        .quick-stats        { grid-template-columns: repeat(2,1fr); gap: 10px; }
        .quick-stat-card    { padding: 14px; }
        .qs-value           { font-size: 18px; }
        .home-mid           { grid-template-columns: 1fr; gap: 14px; }
        .home-bottom        { grid-template-columns: 1fr; gap: 14px; }
        .notes-row          { grid-template-columns: 1fr; }
        .schedule-week      { grid-template-columns: repeat(2,1fr); }
        .notes-grid         { grid-template-columns: repeat(2,1fr); }
        .att-stats          { grid-template-columns: repeat(2,1fr); }
        .profile-grid       { grid-template-columns: repeat(2,1fr); }
        .class-detail-grid  { grid-template-columns: 1fr 1fr; }
        .ud-scroll          { padding: 16px; }
        .ud-topbar          { padding: 0 16px; }
        .topbar-pill        { display: none; }
        .exam-full-card     { flex-direction: column; gap: 12px; }
        .efcard-score-circle { align-self: flex-start; }
        .fee-row            { flex-direction: column; align-items: flex-start; gap: 8px; }
        .ud-toast           { bottom: 16px; right: 16px; left: 16px; text-align: center; }
      }

      @media (max-width: 480px) {
        .quick-stats        { grid-template-columns: 1fr 1fr; gap: 8px; }
        .qs-icon            { font-size: 22px; }
        .qs-value           { font-size: 16px; }
        .qs-label           { font-size: 9px; }
        .schedule-week      { grid-template-columns: 1fr 1fr; }
        .notes-grid         { grid-template-columns: 1fr; }
        .att-stats          { grid-template-columns: repeat(2,1fr); }
        .profile-grid       { grid-template-columns: 1fr 1fr; }
        .ann-full-card      { flex-direction: column; }
        .exam-full-left     { flex-direction: column; gap: 10px; }
        .page-title         { font-size: 22px; }
        .welcome-title      { font-size: 18px; }
        .welcome-sub        { font-size: 13px; }
        .welcome-banner     { padding: 18px 16px; }
        .dash-card          { padding: 16px; }
        .progress-row       { flex-direction: column; }
        .class-detail-grid  { grid-template-columns: 1fr; }
      }

      @media (max-width: 360px) {
        .quick-stats   { grid-template-columns: 1fr; }
        .att-stats     { grid-template-columns: 1fr 1fr; }
        .schedule-week { grid-template-columns: 1fr; }
        .ud-scroll     { padding: 12px; }
      }
    `}</style>
  );
}