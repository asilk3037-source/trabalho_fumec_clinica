import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import iconApp from "./assets/icon-app.png";


// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
:root {
  --ink:#0B2D4E; --ink-2:#3D5A73; --ink-3:#7A96AD;
  --teal:#1A7A6E; --teal-light:#E8F5F3; --teal-mid:#2A9D8F;
  --sky:#1565C0; --sky-light:#E3F0FF;
  --bg:#FFFFFF; --bg-warm:#F7F5F2; --bg-card:#FFFFFF;
  --border:#E4E9EF; --border-2:#C8D5DF;
  --red:#C0392B; --red-bg:#FDF0EE;
  --green:#1A7A6E; --green-bg:#E8F5F3;
  --amber:#B45309; --amber-bg:#FFFBEB;
  --purple:#5B21B6; --purple-bg:#EDE9FE;
  --r:14px; --r-sm:8px; --r-xs:5px;
  --shadow-sm:0 1px 4px rgba(11,45,78,.06);
  --shadow-md:0 4px 20px rgba(11,45,78,.10);
  --shadow-lg:0 12px 48px rgba(11,45,78,.14);
  --font-head:'Plus Jakarta Sans',system-ui,sans-serif;
  --font-body:'Inter',system-ui,sans-serif;
  --nav-h:64px;
  --bot-nav-h:64px;
}
html { scroll-behavior:smooth; -webkit-font-smoothing:antialiased; }
body { font-family:var(--font-body); color:var(--ink); background:var(--ink); font-size:16px; line-height:1.6; min-height:100vh; }
.page-wrap { max-width:1160px; margin:0 auto; box-shadow:0 0 80px rgba(0,0,0,.35); overflow:hidden; }
.sec { padding:5rem 2.5rem; background:var(--bg); margin:0; }
.sec-alt { background:var(--bg-warm); }

/* ── NAV ─────────────────────────────────────────────────────── */
.nav { background:var(--ink); position:sticky; top:0; z-index:300; height:var(--nav-h); padding:0 1.5rem; display:flex; align-items:center; justify-content:space-between; border-bottom:none; }
.nav-logo { display:flex; align-items:center; gap:10px; cursor:pointer; text-decoration:none; }
.nav-logo-img { width:38px; height:38px; border-radius:10px; object-fit:cover; }
.nav-logo-text { display:flex; flex-direction:column; line-height:1; }
.nav-logo-text strong { font-family:var(--font-head); font-size:15px; font-weight:800; color:#fff; letter-spacing:.3px; }
.nav-logo-text span { font-size:10px; color:rgba(255,255,255,.5); letter-spacing:.5px; text-transform:uppercase; margin-top:2px; }
.nav-links { display:flex; gap:.25rem; list-style:none; align-items:center; }
.nav-link { color:rgba(255,255,255,.65); text-decoration:none; font-size:13.5px; font-weight:500; padding:6px 12px; border-radius:var(--r-xs); transition:all .18s; background:none; border:none; cursor:pointer; font-family:var(--font-body); }
.nav-link:hover { color:#fff; background:rgba(255,255,255,.07); }
.nav-cta { background:var(--teal); color:#fff !important; padding:8px 18px !important; border-radius:var(--r-sm) !important; font-weight:600 !important; font-size:13.5px !important; margin-left:8px; }
.nav-cta:hover { background:var(--teal-mid) !important; }
.nav-user-pill { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); border-radius:100px; padding:5px 14px 5px 8px; cursor:pointer; color:rgba(255,255,255,.9); font-size:13px; transition:background .18s; }
.nav-user-pill:hover { background:rgba(255,255,255,.14); }
.nav-user-avatar { width:26px; height:26px; border-radius:50%; background:var(--teal); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; font-family:var(--font-head); flex-shrink:0; overflow:hidden; }
.nav-user-avatar img { width:100%; height:100%; object-fit:cover; }

/* Hamburger (mobile only) */
.hamburger { display:none; flex-direction:column; justify-content:center; gap:5px; width:38px; height:38px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); border-radius:var(--r-sm); cursor:pointer; padding:8px; }
.hamburger span { display:block; height:2px; background:#fff; border-radius:2px; transition:all .22s; }
.hamburger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity:0; }
.hamburger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

/* Mobile Drawer */
.mobile-drawer { position:fixed; top:var(--nav-h); left:0; right:0; background:var(--ink); z-index:250; padding:1rem 1.5rem 1.5rem; display:flex; flex-direction:column; gap:4px; transform:translateY(-110%); transition:transform .28s cubic-bezier(.4,0,.2,1); border-bottom:2px solid var(--teal); }
.mobile-drawer.open { transform:translateY(0); }
.mob-link { color:rgba(255,255,255,.75); text-decoration:none; font-size:15px; font-weight:500; padding:11px 14px; border-radius:var(--r-sm); display:flex; align-items:center; gap:10px; transition:all .15s; background:none; border:none; cursor:pointer; font-family:var(--font-body); width:100%; text-align:left; }
.mob-link:hover,.mob-link.on { background:rgba(26,122,110,.2); color:#5EEAD4; }
.mob-cta { background:var(--teal); color:#fff !important; border-radius:var(--r-sm); font-weight:700; justify-content:center; margin-top:8px; padding:13px; }

/* Badge */
.badge { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; padding:2px 8px; border-radius:100px; }
.badge-pac { background:#DBEAFE; color:#1E40AF; }
.badge-psi { background:#D1FAE5; color:#065F46; }
.badge-sup { background:#EDE9FE; color:#5B21B6; }
.badge-pen { background:#FEF3C7; color:#92400E; }

/* ── HERO ────────────────────────────────────────────────────── */
.hero { background:var(--ink); padding:4rem 2.5rem 3.5rem; display:grid; grid-template-columns:1fr 400px; gap:3rem; align-items:center; position:relative; overflow:hidden; }
.hero::before { content:''; position:absolute; top:-80px; right:-80px; width:520px; height:520px; background:radial-gradient(circle,rgba(26,122,110,.22) 0%,transparent 70%); pointer-events:none; }
.hero-eyebrow { display:inline-flex; align-items:center; gap:7px; background:rgba(26,122,110,.18); border:1px solid rgba(26,122,110,.35); color:#5EEAD4; border-radius:100px; font-size:12px; font-weight:600; letter-spacing:.5px; padding:5px 14px; text-transform:uppercase; margin-bottom:1.5rem; }
.hero h1 { font-family:var(--font-head); font-size:36px; font-weight:800; color:#fff; line-height:1.18; margin-bottom:1rem; max-width:520px; letter-spacing:-.5px; }
.hero h1 em { font-style:normal; color:#5EEAD4; }
.hero-sub { color:rgba(255,255,255,.62); font-size:15px; line-height:1.65; max-width:440px; margin-bottom:1.75rem; }
.hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.hero-panel { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:2rem; backdrop-filter:blur(8px); }
.hero-panel-title { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,.4); margin-bottom:1.25rem; }
.hero-feat { display:flex; align-items:flex-start; gap:12px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,.07); }
.hero-feat:last-child { border-bottom:none; padding-bottom:0; }
.hero-feat-icon { width:40px; height:40px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:18px; }
.feat-teal { background:rgba(26,122,110,.25); } .feat-sky { background:rgba(21,101,192,.25); } .feat-amber { background:rgba(180,83,9,.2); }
.hero-feat-text strong { display:block; font-size:14px; font-weight:600; color:#fff; margin-bottom:2px; }
.hero-feat-text span { font-size:12.5px; color:rgba(255,255,255,.5); line-height:1.4; }

/* ── STRIP ───────────────────────────────────────────────────── */
.strip { background:var(--teal); padding:1.25rem 2.5rem; display:flex; justify-content:space-evenly; flex-wrap:wrap; gap:1rem; }
.strip-item { text-align:center; color:#fff; }
.strip-num { font-family:var(--font-head); font-size:22px; font-weight:800; }
.strip-label { font-size:12px; color:rgba(255,255,255,.75); margin-top:1px; }

/* ── SECTIONS ────────────────────────────────────────────────── */
.eyebrow { font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--teal); margin-bottom:10px; display:flex; align-items:center; gap:7px; }
.eyebrow::before { content:''; display:block; width:18px; height:2px; background:var(--teal); border-radius:2px; }
.sec-title { font-family:var(--font-head); font-size:28px; font-weight:800; color:var(--ink); margin-bottom:10px; line-height:1.25; letter-spacing:-.3px; }
.sec-sub { font-size:15px; color:var(--ink-2); line-height:1.7; }
.sec-head { margin-bottom:3rem; text-align:center; }
.sec-head .eyebrow { justify-content:center; }
.sec-head .sec-sub { max-width:580px; margin:0 auto; }

/* ── SERVICE CARDS ───────────────────────────────────────────── */
.services-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
.svc-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r); padding:1.75rem; transition:box-shadow .2s,transform .2s,border-color .2s; position:relative; overflow:hidden; display:flex; flex-direction:column; }
.svc-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--teal); transform:scaleX(0); transform-origin:left; transition:transform .25s; }
.svc-card:hover { box-shadow:var(--shadow-md); transform:translateY(-3px); border-color:var(--teal-light); }
.svc-card:hover::after { transform:scaleX(1); }
.svc-icon { width:52px; height:52px; border-radius:var(--r-sm); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:1.1rem; background:var(--teal-light); }
.svc-card h3 { font-family:var(--font-head); font-size:14.5px; font-weight:700; margin-bottom:7px; color:var(--teal); }
.svc-card p { font-size:13px; color:var(--ink-2); line-height:1.6; }

/* ── ABOUT ───────────────────────────────────────────────────── */
.about-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:start; }
.about-body p { font-size:15px; color:var(--ink-2); line-height:1.8; margin-bottom:1.1rem; }
.about-check { list-style:none; margin-top:1.5rem; display:flex; flex-direction:column; gap:8px; }
.about-check li { display:flex; align-items:center; gap:10px; font-size:14px; color:var(--ink-2); padding:10px 14px; background:var(--bg); border:1px solid var(--border); border-radius:var(--r-sm); }
.check-mark { width:20px; height:20px; border-radius:50%; background:var(--teal-light); color:var(--teal); display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; }
.pillar { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.5rem; margin-bottom:14px; display:flex; gap:14px; align-items:flex-start; transition:box-shadow .18s; }
.pillar:hover { box-shadow:var(--shadow-sm); }
.pillar-icon { font-size:24px; flex-shrink:0; margin-top:2px; }
.pillar h4 { font-family:var(--font-head); font-size:14.5px; font-weight:700; color:var(--ink); margin-bottom:5px; }
.pillar p { font-size:13px; color:var(--ink-2); line-height:1.6; }

/* ── RECURSOS ────────────────────────────────────────────────── */
.rec-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; }
.rec-card { border-radius:var(--r); overflow:hidden; border:1px solid var(--border); background:var(--bg-card); transition:box-shadow .2s; }
.rec-card:hover { box-shadow:var(--shadow-md); }
.rec-head { padding:1.5rem 1.5rem 1.25rem; }
.rec-head h3 { font-family:var(--font-head); font-size:15.5px; font-weight:700; color:#fff; margin-bottom:4px; }
.rec-head p { font-size:13px; color:rgba(255,255,255,.72); }
.rh-teal { background:linear-gradient(135deg,#1A7A6E,#2A9D8F); }
.rh-navy { background:linear-gradient(135deg,#1565C0,#1E88E5); }
.rh-plum { background:linear-gradient(135deg,#5B21B6,#7C3AED); }
.rec-body { padding:1.25rem 1.5rem; }
.rec-body ul { list-style:none; display:flex; flex-direction:column; gap:0; }
.rec-body ul li { font-size:13.5px; color:var(--ink-2); padding:9px 0; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:9px; }
.rec-body ul li:last-child { border-bottom:none; }
.rec-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.rd-teal { background:var(--teal); } .rd-navy { background:var(--sky); } .rd-plum { background:#7C3AED; }

/* ── CRISIS ──────────────────────────────────────────────────── */
.crisis-box { background:linear-gradient(135deg,#7F1D1D,#991B1B); border-radius:var(--r); padding:1.75rem 2rem; margin-top:2rem; display:flex; gap:1.25rem; align-items:flex-start; width:100%; }
.crisis-icon { font-size:28px; flex-shrink:0; margin-top:2px; }
.crisis-box h4 { font-family:var(--font-head); font-size:15.5px; font-weight:700; color:#fff; margin-bottom:6px; }
.crisis-box p { font-size:13.5px; color:rgba(255,255,255,.78); line-height:1.65; }
.crisis-box a { color:#FCA5A5; font-weight:600; text-decoration:none; }

/* ── FAQ ─────────────────────────────────────────────────────── */
.faq-wrap { max-width:700px; margin:0 auto; }
.faq-item { border-bottom:1px solid var(--border); }
.faq-q { width:100%; background:none; border:none; text-align:left; padding:1.15rem 0; font-size:15px; font-weight:600; color:var(--ink); cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-family:var(--font-body); gap:1rem; }
.faq-q:hover { color:var(--teal); }
.faq-chevron { width:22px; height:22px; border-radius:50%; background:var(--teal-light); color:var(--teal); display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; transition:transform .22s,background .18s; }
.faq-q:hover .faq-chevron { background:var(--teal); color:#fff; }
.faq-chevron.open { transform:rotate(180deg); }
.faq-a { font-size:14px; color:var(--ink-2); line-height:1.75; padding-bottom:1.1rem; }

/* ── CONTACT ─────────────────────────────────────────────────── */
.contact-grid { display:grid; grid-template-columns:1fr 1.3fr; gap:4rem; align-items:start; }
.cinfo-row { display:flex; align-items:flex-start; gap:13px; margin-bottom:1.25rem; }
.cinfo-ic { width:40px; height:40px; border-radius:var(--r-sm); background:var(--teal-light); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.cinfo-ic-text strong { display:block; font-size:13.5px; font-weight:600; color:var(--ink); }
.cinfo-ic-text span { font-size:13px; color:var(--ink-2); }
.warn-notice { background:var(--amber-bg); border:1px solid #FDE68A; border-radius:var(--r-sm); padding:1rem 1.25rem; font-size:13px; color:var(--amber); margin-top:1.5rem; line-height:1.6; }

/* ── FORM ────────────────────────────────────────────────────── */
.form-card { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:2rem; box-shadow:var(--shadow-sm); }
.fg { margin-bottom:1rem; }
.fg label { display:block; font-size:13px; font-weight:600; margin-bottom:5px; color:var(--ink); }
.fg input,.fg select,.fg textarea { width:100%; padding:10px 13px; border:1.5px solid var(--border); border-radius:var(--r-sm); font-size:16px; color:var(--ink); background:var(--bg); outline:none; transition:border-color .18s,box-shadow .18s; font-family:var(--font-body); }
.fg input:focus,.fg select:focus,.fg textarea:focus { border-color:var(--teal); box-shadow:0 0 0 3px rgba(26,122,110,.12); }
.fg textarea { height:108px; resize:vertical; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.form-btn { width:100%; background:var(--ink); color:#fff; border:none; padding:13px; border-radius:var(--r-sm); font-size:15px; font-weight:700; cursor:pointer; transition:background .18s; margin-top:4px; font-family:var(--font-head); }
.form-btn:hover { background:var(--teal); }
.form-btn:disabled { opacity:.6; cursor:not-allowed; }

/* ── FOOTER ──────────────────────────────────────────────────── */
footer { background:#07203A; color:rgba(255,255,255,.65); padding:3.5rem 2.5rem 1.75rem; }
.footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr; gap:3rem; margin-bottom:2.5rem; }
.footer-brand p { font-size:13.5px; line-height:1.7; margin-top:10px; max-width:280px; }
.footer-col h4 { font-family:var(--font-head); font-size:13px; font-weight:700; color:#fff; margin-bottom:1rem; text-transform:uppercase; letter-spacing:.5px; }
.footer-col ul { list-style:none; display:flex; flex-direction:column; gap:7px; }
.footer-col ul li a { font-size:13.5px; color:rgba(255,255,255,.55); text-decoration:none; transition:color .15s; }
.footer-col ul li a:hover { color:#fff; }
.footer-bot { border-top:1px solid rgba(255,255,255,.08); padding-top:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }
.footer-bot p { font-size:12px; }
.lgpd { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.6); font-size:11px; font-weight:600; padding:3px 11px; border-radius:100px; letter-spacing:.4px; }

/* ── MODAL ───────────────────────────────────────────────────── */
.overlay { position:fixed; inset:0; background:rgba(7,32,58,.65); backdrop-filter:blur(4px); z-index:400; display:flex; align-items:center; justify-content:center; padding:1rem; }
.modal { background:var(--bg); border-radius:20px; padding:2.25rem; width:100%; max-width:430px; box-shadow:var(--shadow-lg); position:relative; max-height:92vh; overflow-y:auto; }
.modal-x { position:absolute; top:1.1rem; right:1.1rem; background:var(--bg-warm); border:none; border-radius:50%; width:30px; height:30px; font-size:16px; cursor:pointer; color:var(--ink-2); display:flex; align-items:center; justify-content:center; transition:background .15s; }
.modal-x:hover { background:var(--border); }
.modal-logo { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:1.5rem; }
.modal-logo-img { width:38px; height:38px; border-radius:10px; object-fit:cover; }
.modal-logo-text { text-align:center; }
.modal-logo-text strong { font-family:var(--font-head); font-size:17px; font-weight:800; color:var(--ink); display:block; }
.modal-logo-text span { font-size:11px; color:var(--ink-3); }
.modal-tabs { display:flex; background:var(--bg-warm); border-radius:var(--r-sm); padding:4px; margin-bottom:1.5rem; gap:4px; }
.modal-tab { flex:1; padding:9px; text-align:center; font-size:13.5px; font-weight:600; cursor:pointer; border:none; background:transparent; color:var(--ink-2); border-radius:var(--r-xs); transition:all .18s; font-family:var(--font-body); }
.modal-tab.active { background:var(--bg); color:var(--ink); box-shadow:0 1px 4px rgba(11,45,78,.1); }
.role-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:1.25rem; }
.role-btn { padding:12px 6px; border:1.5px solid var(--border); border-radius:var(--r-sm); background:var(--bg); cursor:pointer; text-align:center; font-size:12.5px; font-weight:600; color:var(--ink-2); transition:all .18s; font-family:var(--font-body); }
.role-btn:hover { border-color:var(--teal); color:var(--teal); }
.role-btn.active { border-color:var(--teal); background:var(--teal-light); color:var(--teal); }
.role-btn .ri { display:block; font-size:22px; margin-bottom:5px; }

/* ── SPINNER ─────────────────────────────────────────────────── */
.spin { display:inline-block; width:15px; height:15px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:rot .65s linear infinite; }
@keyframes rot { to { transform:rotate(360deg); } }

/* ── SKELETON LOADERS ───────────────────────────────────────────── */
.skel { background:linear-gradient(90deg, var(--border) 25%, #EEF2F6 50%, var(--border) 75%); background-size:200% 100%; animation:shimmer 1.4s ease-in-out infinite; }
@keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

/* ── EMPTY STATE ────────────────────────────────────────────────── */
.empty-state { text-align:center; padding:3rem 1.5rem; background:var(--bg); border:1px dashed var(--border-2); border-radius:var(--r); }
.empty-state-icon { font-size:40px; margin-bottom:.75rem; opacity:.75; }
.empty-state-title { font-family:var(--font-head); font-size:15px; font-weight:700; color:var(--ink); margin-bottom:4px; }
.empty-state-sub { font-size:13px; color:var(--ink-2); max-width:380px; margin:0 auto; line-height:1.6; }

/* ── SIDEBAR NOTIFICATION DOTS ─────────────────────────────────── */
.sb-item-badge { background:#EF4444; color:#fff; font-size:10px; font-weight:700; border-radius:100px; padding:1px 6px; margin-left:auto; min-width:18px; text-align:center; line-height:1.4; }
.bot-nav-item-badge { position:absolute; top:2px; right:10px; background:#EF4444; color:#fff; font-size:9px; font-weight:700; border-radius:100px; padding:0 4px; min-width:14px; line-height:1.3; text-align:center; }


/* ── TOAST ───────────────────────────────────────────────────── */
.toast { position:fixed; bottom:24px; right:16px; z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
.toast-item { padding:12px 18px; border-radius:var(--r-sm); font-size:13.5px; font-weight:600; box-shadow:var(--shadow-lg); animation:slideIn .25s ease; pointer-events:auto; display:flex; align-items:center; gap:10px; min-width:260px; max-width:calc(100vw - 32px); }
.toast-ok { background:#065F46; color:#fff; }
.toast-err { background:#991B1B; color:#fff; }
.toast-info { background:var(--ink); color:#fff; }
@keyframes slideIn { from { transform:translateX(40px); opacity:0; } to { transform:translateX(0); opacity:1; } }

/* ── DASHBOARD SHELL ─────────────────────────────────────────── */
.dash { display:flex; min-height:calc(100vh - var(--nav-h)); }
.sidebar { width:252px; flex-shrink:0; background:var(--ink); display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,.06); }
.sb-user { padding:1.5rem 1.25rem 1.25rem; border-bottom:1px solid rgba(255,255,255,.07); display:flex; flex-direction:column; align-items:center; text-align:center; }
.sb-avatar-wrap { position:relative; margin-bottom:10px; }
.sb-avatar { width:60px; height:60px; border-radius:14px; background:var(--teal); color:#fff; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; font-family:var(--font-head); overflow:hidden; }
.sb-avatar img { width:100%; height:100%; object-fit:cover; }
.sb-avatar-edit { position:absolute; bottom:-4px; right:-4px; width:22px; height:22px; border-radius:50%; background:var(--teal); color:#fff; border:2px solid var(--ink); display:flex; align-items:center; justify-content:center; font-size:11px; cursor:pointer; transition:background .15s; }
.sb-avatar-edit:hover { background:var(--teal-mid); }
.sb-user h4 { font-family:var(--font-head); font-size:13.5px; font-weight:700; color:#fff; margin-bottom:3px; }
.sb-user span { font-size:12px; color:rgba(255,255,255,.45); }
.sb-nav { flex:1; padding:1rem 0; }
.sb-item { display:flex; align-items:center; gap:10px; padding:10px 1.25rem; font-size:13.5px; color:rgba(255,255,255,.6); cursor:pointer; transition:all .15s; border:none; background:none; width:100%; text-align:left; font-family:var(--font-body); border-radius:0; }
.sb-item:hover { background:rgba(255,255,255,.06); color:rgba(255,255,255,.9); }
.sb-item.on { background:rgba(26,122,110,.2); color:#5EEAD4; border-right:3px solid var(--teal-mid); }
.sb-item .si { font-size:16px; width:22px; text-align:center; }
.sb-foot { padding:1.25rem; border-top:1px solid rgba(255,255,255,.07); }
.dash-main { flex:1; background:var(--bg-warm); padding:2rem 2.5rem; overflow-y:auto; min-width:0; }
.dash-title { font-family:var(--font-head); font-size:22px; font-weight:800; color:var(--ink); margin-bottom:4px; }
.dash-sub { font-size:14px; color:var(--ink-2); margin-bottom:2rem; }

/* Bottom Nav (mobile dashboard) */
.bot-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--ink); border-top:1px solid rgba(255,255,255,.1); z-index:200; height:var(--bot-nav-h); padding:0 4px; }
.bot-nav-inner { display:flex; align-items:stretch; height:100%; overflow-x:auto; scrollbar-width:none; }
.bot-nav-inner::-webkit-scrollbar { display:none; }
.bot-nav-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; flex:1; min-width:52px; padding:6px 4px; cursor:pointer; border:none; background:none; color:rgba(255,255,255,.5); font-size:10px; font-weight:600; font-family:var(--font-body); transition:all .15s; border-top:2px solid transparent; white-space:nowrap; }
.bot-nav-item .bni { font-size:20px; line-height:1; }
.bot-nav-item.on { color:#5EEAD4; border-top-color:var(--teal-mid); }
.bot-nav-item:hover { color:rgba(255,255,255,.85); }

/* ── KPI / PANEL / TABLE ─────────────────────────────────────── */
.kpi-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:14px; margin-bottom:2rem; }
.kpi { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.25rem 1.5rem; }
.kpi-num { font-family:var(--font-head); font-size:30px; font-weight:800; color:var(--teal); line-height:1; }
.kpi-label { font-size:12.5px; color:var(--ink-2); margin-top:5px; }
.panel { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.5rem; margin-bottom:1.5rem; }
.panel-title { font-family:var(--font-head); font-size:15.5px; font-weight:700; color:var(--ink); margin-bottom:1.25rem; display:flex; align-items:center; gap:8px; }
.tw { overflow-x:auto; -webkit-overflow-scrolling:touch; }
table { width:100%; border-collapse:collapse; font-size:13.5px; min-width:480px; }
th { text-align:left; padding:9px 12px; background:var(--bg-warm); font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-2); border-bottom:1px solid var(--border); }
td { padding:12px; border-bottom:1px solid var(--border); color:var(--ink); vertical-align:middle; }
tr:last-child td { border-bottom:none; }
tr:hover td { background:#FAFBFC; }

/* ── STATUS BADGES ───────────────────────────────────────────── */
.st { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11.5px; font-weight:700; letter-spacing:.3px; white-space:nowrap; }
.st-confirmado { background:#D1FAE5; color:#065F46; }
.st-pendente { background:#FEF3C7; color:#92400E; }
.st-cancelado { background:#FEE2E2; color:#991B1B; }
.st-concluido { background:#EDE9FE; color:#5B21B6; }
.st-inativo { background:#F3F4F6; color:#6B7280; }
.st-ativo { background:#D1FAE5; color:#065F46; }
.st-aguardando { background:#FEF3C7; color:#92400E; }

/* ── CALENDAR ────────────────────────────────────────────────── */
.cal-wrap { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
.cal { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.25rem; }
.cal-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
.cal-hdr h3 { font-family:var(--font-head); font-size:15.5px; font-weight:700; color:var(--ink); }
.cal-nav-btn { background:var(--bg-warm); border:1px solid var(--border); border-radius:var(--r-xs); width:30px; height:30px; cursor:pointer; font-size:15px; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.cal-nav-btn:hover { background:var(--border); }
.cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
.cal-dn { text-align:center; font-size:10.5px; font-weight:700; color:var(--ink-3); padding:4px 0; text-transform:uppercase; }
.cd { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:12.5px; border-radius:var(--r-xs); cursor:pointer; transition:all .12s; font-weight:500; }
.cd:hover:not(.cd-empty):not(.cd-past) { background:var(--teal-light); color:var(--teal); }
.cd-today { background:var(--teal); color:#fff; font-weight:700; }
.cd-selected { background:var(--ink); color:#fff; font-weight:700; }
.cd-past { color:#CBD5DC; cursor:default; }
.cd-empty { cursor:default; }
.slots { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:1rem; }
.slot { padding:9px 6px; text-align:center; border:1.5px solid var(--border); border-radius:var(--r-sm); font-size:13px; cursor:pointer; transition:all .12s; font-weight:500; }
.slot:hover:not(.slot-taken) { border-color:var(--teal); background:var(--teal-light); color:var(--teal); }
.slot-sel { background:var(--teal); color:#fff; border-color:var(--teal); }
.slot-taken { background:var(--bg-warm); color:#C0C8D0; cursor:default; font-size:12px; }

/* ── AVAILABILITY GRID (psicólogo agenda) ──────────────────────── */
.avail-grid { overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid var(--border); border-radius:var(--r-sm); }
.avail-row { display:grid; grid-template-columns:84px repeat(8,minmax(56px,1fr)); }
.avail-row:not(:last-child) { border-bottom:1px solid var(--border); }
.avail-head { background:var(--bg-warm); position:sticky; top:0; z-index:2; }
.avail-head .avail-h { padding:10px 4px; text-align:center; font-size:11px; font-weight:700; color:var(--ink-2); text-transform:uppercase; letter-spacing:.3px; border-left:1px solid var(--border); }
.avail-day { padding:10px 12px; font-size:13px; font-weight:700; color:var(--ink); display:flex; align-items:center; position:sticky; left:0; background:var(--bg); z-index:1; border-right:1px solid var(--border); }
.avail-head .avail-day { background:var(--bg-warm); }
.avail-cell { border:none; border-left:1px solid var(--border); background:var(--bg); cursor:pointer; aspect-ratio:1; min-height:46px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; transition:all .12s; color:var(--ink-3); font-size:14px; font-weight:700; padding:2px; }
.avail-cell:hover { background:var(--teal-light); }
.avail-cell.on { background:var(--teal); color:#fff; }
.avail-cell.on:hover { background:var(--teal-mid); }
.avail-cell-label { font-size:9.5px; font-weight:600; opacity:.7; }
.avail-cell.on .avail-cell-label { opacity:.85; }

/* ── CHIPS / ALERTS ──────────────────────────────────────────── */
.chip { display:inline-block; padding:3px 10px; border-radius:100px; font-size:12px; font-weight:600; background:var(--teal-light); color:var(--teal); }
.al { border-radius:var(--r-sm); padding:1rem 1.25rem; font-size:13.5px; margin-bottom:1rem; line-height:1.5; }
.al-info { background:var(--sky-light); color:#1E3A5F; border:1px solid #BFDBFE; }
.al-ok { background:var(--green-bg); color:var(--green); border:1px solid #A7D7D2; }
.al-warn { background:var(--amber-bg); color:var(--amber); border:1px solid #FDE68A; }
.al-err { background:var(--red-bg); color:var(--red); border:1px solid #F5C6C2; }

/* ── PROFILE ─────────────────────────────────────────────────── */
.prof-card { display:flex; align-items:center; gap:1.5rem; background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.5rem; margin-bottom:1.5rem; flex-wrap:wrap; }
.prof-av { width:80px; height:80px; border-radius:16px; background:var(--teal); color:#fff; display:flex; align-items:center; justify-content:center; font-size:34px; font-weight:800; font-family:var(--font-head); overflow:hidden; flex-shrink:0; }
.prof-av img { width:100%; height:100%; object-fit:cover; }
.prof-info h3 { font-family:var(--font-head); font-size:18px; font-weight:800; color:var(--ink); margin-bottom:3px; }
.prof-info p { font-size:13.5px; color:var(--ink-2); }

/* ── FEEDBACK ────────────────────────────────────────────────── */
.fb-card { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.25rem; margin-bottom:1rem; }
.fb-hdr { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:7px; flex-wrap:wrap; gap:6px; }
.fb-hdr h4 { font-family:var(--font-head); font-size:14.5px; font-weight:700; color:var(--ink); }
.fb-hdr span { font-size:12px; color:var(--ink-3); }
.fb-text { font-size:13.5px; color:var(--ink-2); line-height:1.65; }
.stars { color:#F59E0B; font-size:15px; margin-top:5px; letter-spacing:1px; }

/* ── NOTIF ───────────────────────────────────────────────────── */
.notif-count { background:#EF4444; color:#fff; font-size:10px; font-weight:700; border-radius:100px; padding:1px 6px; margin-left:4px; }

/* ── USER MGMT ───────────────────────────────────────────────── */
.user-card { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.25rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:12px; flex-wrap:wrap; }
.user-card-left { display:flex; align-items:center; gap:12px; min-width:0; }
.user-av-sm { width:44px; height:44px; border-radius:12px; background:var(--teal); color:#fff; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; font-family:var(--font-head); flex-shrink:0; overflow:hidden; }
.user-av-sm img { width:100%; height:100%; object-fit:cover; }
.user-info-name { font-family:var(--font-head); font-size:14px; font-weight:700; color:var(--ink); }
.user-info-sub { font-size:12.5px; color:var(--ink-3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px; }
.user-card-actions { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }

/* ── MESSAGES ────────────────────────────────────────────────── */
.msg-card { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.25rem; margin-bottom:12px; cursor:pointer; transition:box-shadow .18s; }
.msg-card:hover { box-shadow:var(--shadow-sm); }
.msg-card.unread { border-left:3px solid var(--teal); }
.msg-card-hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; gap:8px; }
.msg-card-from { font-family:var(--font-head); font-size:14px; font-weight:700; color:var(--ink); }
.msg-card-time { font-size:12px; color:var(--ink-3); white-space:nowrap; }
.msg-card-subject { font-size:13px; font-weight:600; color:var(--ink-2); margin-bottom:4px; }
.msg-card-preview { font-size:13px; color:var(--ink-3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

/* ── BUTTONS ─────────────────────────────────────────────────── */
.btn { display:inline-flex; align-items:center; gap:7px; padding:12px 26px; border-radius:var(--r-sm); font-size:14.5px; font-weight:600; cursor:pointer; border:none; transition:all .18s; font-family:var(--font-body); text-decoration:none; line-height:1; white-space:nowrap; }
.btn:disabled { opacity:.55; cursor:not-allowed; }
.btn-teal { background:var(--teal); color:#fff; }
.btn-teal:hover { background:var(--teal-mid); transform:translateY(-1px); box-shadow:0 4px 14px rgba(26,122,110,.4); }
.btn-ghost { background:rgba(255,255,255,.08); color:rgba(255,255,255,.85); border:1px solid rgba(255,255,255,.18); }
.btn-ghost:hover { background:rgba(255,255,255,.14); }
.btn-outline { background:transparent; color:var(--ink); border:1.5px solid var(--border-2); }
.btn-outline:hover { background:var(--bg-warm); }
.btn-danger { background:var(--red-bg); color:var(--red); border:1px solid #F5C6C2; }
.btn-danger:hover { background:#FADBD8; }
.btn-success { background:var(--green-bg); color:var(--green); border:1px solid #A7D7D2; }
.btn-success:hover { background:#C5EBE8; }
.btn-sm { padding:7px 14px; font-size:12.5px; border-radius:var(--r-xs); }

/* ══════════════════════════════════════════════════════════════
   RESPONSIVE — MOBILE FIRST
══════════════════════════════════════════════════════════════ */

/* Tablet 900px */
@media(max-width:900px) {
  .services-grid { grid-template-columns:repeat(2,1fr); }
  .hero { grid-template-columns:1fr; gap:2rem; padding:3rem 1.5rem 2.5rem; }
  .hero-panel { display:none; }
  .hero h1 { font-size:30px; }
  .about-grid { grid-template-columns:1fr; gap:2.5rem; }
  .contact-grid { grid-template-columns:1fr; gap:2rem; }
  .footer-grid { grid-template-columns:1fr 1fr; gap:2rem; }
  .cal-wrap { grid-template-columns:1fr; }
  .dash-main { padding:1.5rem; }
}

/* Mobile 640px */
@media(max-width:640px) {
  .nav { padding:0 1rem; height:56px; }
  :root { --nav-h:56px; }
  .nav-logo-text span { display:none; }
  .hide-m { display:none !important; }
  .hamburger { display:flex; }

  .sec { padding:3rem 1.25rem; }
  .hero { padding:2.5rem 1.25rem 2rem; }
  .hero-eyebrow { font-size:10.5px; padding:4px 10px; }
  .hero h1 { font-size:26px; margin-bottom:.75rem; }
  .hero-sub { font-size:14px; }
  .hero-actions { flex-direction:column; }
  .hero-actions .btn { width:100%; justify-content:center; }

  .strip { padding:.9rem 1rem; gap:.5rem; }
  .strip-num { font-size:18px; }
  .strip-label { font-size:11px; }

  .services-grid { grid-template-columns:1fr 1fr; gap:12px; }
  .svc-card { padding:1.25rem; }
  .svc-icon { width:42px; height:42px; font-size:20px; }
  .svc-card h3 { font-size:13px; }
  .svc-card p { font-size:12px; }

  .sec-title { font-size:23px; }
  .rec-grid { grid-template-columns:1fr; }
  .crisis-box { flex-direction:column; gap:.75rem; padding:1.25rem; }
  .faq-wrap { max-width:100%; }
  .form-row { grid-template-columns:1fr; }
  .footer-grid { grid-template-columns:1fr; gap:1.5rem; }
  .footer-brand p { max-width:100%; }

  /* Dashboard mobile */
  .sidebar { display:none; }
  .dash { display:block; }
  .dash-main { padding:1rem; padding-bottom:calc(var(--bot-nav-h) + 1rem); min-height:calc(100vh - var(--nav-h)); }
  .bot-nav { display:flex; }
  .kpi-row { grid-template-columns:1fr 1fr; gap:10px; }
  .kpi { padding:1rem; }
  .kpi-num { font-size:24px; }
  .panel { padding:1rem; }
  .panel-title { font-size:14px; }
  .user-card { padding:1rem .75rem; }
  .user-info-sub { max-width:160px; }
  .user-card-actions { gap:6px; }
  .btn-sm { padding:6px 10px; font-size:11.5px; }
  .toast { bottom:calc(var(--bot-nav-h) + 12px); right:12px; }
  .toast-item { min-width:0; width:calc(100vw - 24px); }
  .cal-wrap { grid-template-columns:1fr; }

  /* Dashboard top nav on mobile - hide name/badge, keep avatar + Sair compact */
  .nav-user-pill { padding:4px; gap:0; background:none; border:none; }
  .nav-user-pill span:not(.badge) { display:none; }
  .nav-user-pill .badge { display:none; }
  .nav-user-avatar { width:32px; height:32px; font-size:13px; }
  .dash-main .nav-link { padding:6px 10px; font-size:12.5px; }

  /* Availability grid mobile */
  .avail-row { grid-template-columns:64px repeat(8,minmax(48px,1fr)); }
  .avail-day { padding:8px; font-size:12px; }
  .avail-head .avail-h { padding:8px 2px; font-size:10px; }
  .avail-cell { min-height:40px; font-size:12px; }
  .avail-cell-label { font-size:8.5px; }

  /* Modal on mobile */
  .overlay { align-items:flex-end; padding:0; }
  .modal { border-radius:20px 20px 0 0; max-height:90vh; padding:1.75rem 1.25rem; }
}

/* Very small 380px */
@media(max-width:380px) {
  .services-grid { grid-template-columns:1fr; }
  .hero h1 { font-size:22px; }
  .kpi-row { grid-template-columns:1fr 1fr; }
}
`;

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo({ size = 34, light = false }) {
  return (
    <img
      src={iconApp}
      alt="FUMEC"
      width={size}
      height={size}
      className="nav-logo-img"
      style={{
        borderRadius: 10,
        objectFit: "cover",
        outline: light ? "1.5px solid rgba(255,255,255,.15)" : "none",
      }}
    />
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmtH(h) { return h ? h.slice(0,5) : "—"; }
function fmt(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function Spin() { return <span className="spin"/>; }

// ─── AVATAR (cor consistente por nome) ───────────────────────────────────────
const AVATAR_PALETTE = [
  "#1A7A6E", "#1565C0", "#7C3AED", "#B45309", "#BE185D",
  "#0E7490", "#4D7C0F", "#9333EA", "#C2410C", "#0F766E",
];
function colorForName(name) {
  if (!name) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}
/** Avatar com cor consistente derivada do nome. Aceita className para herdar tamanho/forma do CSS existente. */
function Avatar({ name, url, className = "", style = {} }) {
  if (url) return <div className={className} style={style}><img src={url} alt=""/></div>;
  return (
    <div className={className} style={{ ...style, background: colorForName(name) }}>
      {(name || "?")[0]?.toUpperCase()}
    </div>
  );
}

// ─── SKELETON LOADERS ─────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 14, r = 6, style = {} }) {
  return <div className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}
/** Skeleton de uma linha de KPI */
function SkeletonKPI() {
  return (
    <div className="kpi">
      <Skeleton w={48} h={28} r={6} style={{ marginBottom: 8 }} />
      <Skeleton w="70%" h={11} />
    </div>
  );
}
/** Skeleton de linha de tabela */
function SkeletonRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}><Skeleton h={12} w={i === 0 ? "60%" : "75%"} /></td>
      ))}
    </tr>
  );
}
/** Skeleton de card de usuário/mensagem */
function SkeletonCard() {
  return (
    <div className="user-card">
      <div className="user-card-left">
        <Skeleton w={44} h={44} r={12} />
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <Skeleton w={130} h={13} />
          <Skeleton w={90} h={11} />
        </div>
      </div>
      <Skeleton w={80} h={28} r={8} />
    </div>
  );
}
/** Bloco padrão de carregamento — substitui o antigo "al al-info Carregando..." */
function Loading({ rows = 3, kind = "cards" }) {
  if (kind === "kpi") {
    return (
      <div className="kpi-row">
        {Array.from({ length: rows }).map((_, i) => <SkeletonKPI key={i} />)}
      </div>
    );
  }
  if (kind === "table") {
    return (
      <div className="panel">
        <div className="tw"><table>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table></div>
      </div>
    );
  }
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
/** Estado vazio ilustrado com ícone grande, texto e CTA opcional */
function EmptyState({ icon = "📭", title, subtitle, ctaLabel, onCta }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      {title && <div className="empty-state-title">{title}</div>}
      {subtitle && <div className="empty-state-sub">{subtitle}</div>}
      {ctaLabel && onCta && (
        <button className="btn btn-teal btn-sm" style={{marginTop:14}} onClick={onCta}>{ctaLabel}</button>
      )}
    </div>
  );
}


// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
let _setToasts = null;
function useToastSetup() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;
  return toasts;
}
function toast(msg, type = "ok") {
  if (!_setToasts) return;
  const id = Date.now();
  _setToasts(p => [...p, { id, msg, type }]);
  setTimeout(() => _setToasts(p => p.filter(t => t.id !== id)), 3500);
}
function Toasts() {
  const toasts = useToastSetup();
  return (
    <div className="toast">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]       = useState("home");
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [modal, setModal]     = useState(false);
  const [tab, setTab]         = useState("login");
  const [role, setRole]       = useState("paciente");
  const [faq, setFaq]         = useState(null);
  const [busy, setBusy]       = useState(false);
  const [err, setErr]         = useState("");
  const [contactBusy, setContactBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [lEmail, setLE] = useState(""); const [lPass, setLP] = useState("");
  const [rName, setRN]  = useState(""); const [rEmail, setRE] = useState("");
  const [rPass, setRP]  = useState(""); const [rMat, setRM]   = useState("");
  const [rCrp, setRC]   = useState("");

  // Contact form state
  const [cNome, setCNome] = useState("");
  const [cMat, setCMat]   = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cAssunto, setCAssunto] = useState("");
  const [cMsg, setCMsg]   = useState("");

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) { setUser(session.user); await loadProfile(session.user.id); setPage("dashboard"); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (ev, ses) => {
      if (ev === "SIGNED_OUT") { setUser(null); setProfile(null); setPage("home"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(uid) {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (data) setProfile(data);
  }

  async function doLogin() {
    setErr(""); setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: lEmail, password: lPass });
    if (error) { setErr("E-mail ou senha incorretos."); setBusy(false); return; }
    setUser(data.user); await loadProfile(data.user.id);
    setBusy(false); setModal(false); setPage("dashboard");
    toast("✅ Bem-vindo(a)!");
  }

  async function doRegister() {
    setErr("");
    if (!rName || !rEmail || !rPass) { setErr("Preencha todos os campos obrigatórios."); return; }
    if (rPass.length < 6) { setErr("Senha deve ter pelo menos 6 caracteres."); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({ email: rEmail, password: rPass });
    if (error) { setErr(error.message); setBusy(false); return; }

    const statusInicial = role === "paciente" ? "ativo" : "pendente_aprovacao";
    const { error: profErr } = await supabase.from("profiles").insert({
      id: data.user.id, nome: rName, email: rEmail, tipo: role,
      matricula: rMat || null, crp: rCrp || null, status: statusInicial,
    });

    // Se falhou por coluna status não existir, tenta sem ela
    if (profErr) {
      await supabase.from("profiles").insert({
        id: data.user.id, nome: rName, email: rEmail, tipo: role,
        matricula: rMat || null, crp: rCrp || null,
      });
    }

    await loadProfile(data.user.id);
    setUser(data.user); setBusy(false); setModal(false);

    if (role === "paciente") {
      setPage("dashboard");
      toast("✅ Conta criada com sucesso!");
    } else if (role === "psicologo") {
      toast("⏳ Conta criada! Aguardando aprovação de um supervisor para liberar seus atendimentos.", "info");
    } else {
      toast("⏳ Conta criada! Aguardando aprovação de um supervisor já cadastrado.", "info");
    }
  }

  async function logout() { await supabase.auth.signOut(); }

  async function sendContact(e) {
    if (e) e.preventDefault();
    if (!cNome || !cEmail || !cAssunto || !cMsg) { toast("Preencha todos os campos obrigatórios.", "err"); return; }
    setContactBusy(true);
    const { error } = await supabase.from("contatos").insert({
      nome: cNome, matricula: cMat || null, email: cEmail,
      assunto: cAssunto, mensagem: cMsg, lida: false,
    });
    setContactBusy(false);
    if (error) {
      if (error.code === "42P01") toast("⚠️ Execute a migration SQL para habilitar o Fale Conosco.", "err");
      else toast("Erro ao enviar. Tente novamente.", "err");
      return;
    }
    setCNome(""); setCMat(""); setCEmail(""); setCAssunto(""); setCMsg("");
    toast("✅ Mensagem enviada! Retornaremos em breve.");
  }

  if (page === "dashboard" && user && profile) {
    if (profile.status === "pendente_aprovacao") {
      const isPsi = profile.tipo === "psicologo";
      return (
        <div className="page-wrap">
          <style>{CSS}</style>
          <Toasts/>
          <nav className="nav">
            <a className="nav-logo"><Logo size={34} light/><div className="nav-logo-text"><strong>FUMEC</strong><span>Clínica Escola · Psicologia</span></div></a>
            <ul className="nav-links"><li><button className="nav-link" onClick={logout}>Sair →</button></li></ul>
          </nav>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - var(--nav-h))",padding:"1.25rem",background:"var(--bg-warm)"}}>
            <div style={{textAlign:"center",maxWidth:480,width:"100%",background:"var(--bg)",borderRadius:"var(--r)",padding:"2.5rem 1.5rem",boxShadow:"var(--shadow-md)"}}>
              <div style={{fontSize:56,marginBottom:"1rem"}}>⏳</div>
              <h2 style={{fontFamily:"var(--font-head)",fontSize:22,marginBottom:"1rem",color:"var(--ink)"}}>Aguardando aprovação</h2>
              <p style={{color:"var(--ink-2)",marginBottom:"0.5rem",lineHeight:1.7,fontSize:14}}>
                {isPsi
                  ? "Sua conta de psicólogo(a) foi criada e está aguardando ativação por um supervisor."
                  : "Sua conta de supervisor foi criada e está aguardando aprovação de outro supervisor já cadastrado."
                }
              </p>
              <p style={{color:"var(--ink-3)",fontSize:12.5,marginBottom:"2rem"}}>
                {isPsi ? "Você poderá fazer login e gerenciar sua agenda assim que for ativado." : "Você terá acesso completo ao painel assim que for aprovado."}
              </p>
              <div style={{background:"var(--teal-light)",borderRadius:"var(--r-sm)",padding:"0.85rem",marginBottom:"1.5rem",fontSize:12.5,color:"var(--teal)",wordBreak:"break-all"}}>
                📧 Logado como: <strong>{profile.email}</strong>
              </div>
              <button className="btn btn-outline" onClick={logout}>Sair da conta</button>
            </div>
          </div>
        </div>
      );
    }
    return <Dashboard user={user} profile={profile} onLogout={logout} onProfileUpdate={setProfile} />;
  }

  const FAQS = [
    ["Quem pode ser atendido?", "Prioritariamente estudantes matriculados na FUMEC. Conforme disponibilidade, a comunidade externa também pode ser atendida."],
    ["O atendimento é gratuito?", "Sim, totalmente gratuito para estudantes da FUMEC."],
    ["O que acontece na primeira consulta?", "Realizamos uma entrevista de acolhimento para entender sua situação e indicar o melhor caminho."],
    ["Minhas informações ficam em sigilo?", "Sim. Todos os atendimentos seguem o Código de Ética do CFP, que garante sigilo absoluto das sessões."],
    ["Preciso ter diagnóstico para ser atendido?", "Não. Se você está passando por dificuldades emocionais ou quer se conhecer melhor, já é motivo suficiente para buscar apoio."],
  ];

  return (
    <div className="page-wrap">
      <style>{CSS}</style>
      <Toasts/>
      {/* NAV */}
      <nav className="nav">
        <a className="nav-logo">
          <Logo size={34} light/>
          <div className="nav-logo-text"><strong>FUMEC</strong><span>Clínica Escola · Psicologia</span></div>
        </a>
        <ul className="nav-links">
          {[["#inicio","Início"],["#sobre","Sobre"],["#servicos","Serviços"],["#faq","Dúvidas"],["#contato","Fale Conosco"]].map(([h,l]) => (
            <li key={l} className="hide-m"><a href={h} className="nav-link">{l}</a></li>
          ))}
          <li className="hide-m"><button className="nav-link nav-cta" onClick={() => setModal(true)}>Entrar / Cadastrar</button></li>
          <li>
            <div className={`hamburger ${menuOpen?"open":""}`} onClick={() => setMenuOpen(o=>!o)} aria-label="Menu">
              <span/><span/><span/>
            </div>
          </li>
        </ul>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${menuOpen?"open":""}`}>
        {[["#inicio","🏠","Início"],["#sobre","ℹ️","Sobre"],["#servicos","🧠","Serviços"],["#faq","❓","Dúvidas"],["#contato","✉️","Fale Conosco"]].map(([h,ic,l]) => (
          <a key={l} href={h} className="mob-link" onClick={() => setMenuOpen(false)}><span>{ic}</span>{l}</a>
        ))}
        <button className="mob-link mob-cta" onClick={() => { setModal(true); setMenuOpen(false); }}>Entrar / Cadastrar</button>
      </div>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div>
          <div className="hero-eyebrow">🏛️ Universidade FUMEC — Belo Horizonte</div>
          <h1>Cuidar da sua mente é parte da <em>sua formação</em></h1>
          <p className="hero-sub">A Clínica Escola de Psicologia oferece atendimento gratuito, ético e humanizado para estudantes que precisam de apoio emocional e psicológico.</p>
          <div className="hero-actions">
            <button className="btn btn-teal" onClick={() => setModal(true)}>📅 Agendar consulta</button>
            <a href="#sobre" className="btn btn-ghost">Conheça a clínica →</a>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-title">Por que escolher nossa clínica</div>
          {[
            ["feat-teal","💙","Atendimento 100% gratuito","Para todos os estudantes matriculados na FUMEC."],
            ["feat-sky","🔒","Sigilo garantido por lei","Ética profissional conforme o Código de Ética do CFP."],
            ["feat-amber","🎓","Supervisionado por especialistas","Estagiários orientados por psicólogos experientes."],
          ].map(([cls,ic,t,s]) => (
            <div className="hero-feat" key={t}>
              <div className={`hero-feat-icon ${cls}`}>{ic}</div>
              <div className="hero-feat-text"><strong>{t}</strong><span>{s}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* STRIP */}
      <div className="strip">
        {[["100%","Gratuito para estudantes"],["LGPD","Dados protegidos por lei"],["CFP","Regido pelo Código de Ética"],["BH","Belo Horizonte · MG"]].map(([n,l]) => (
          <div className="strip-item" key={n}><div className="strip-num">{n}</div><div className="strip-label">{l}</div></div>
        ))}
      </div>

      {/* SERVIÇOS */}
      <section className="sec" id="servicos">
        <div className="sec-head">
          <div className="eyebrow">O que oferecemos</div>
          <h2 className="sec-title">Serviços disponíveis</h2>
          <p className="sec-sub">Recursos desenvolvidos para apoiar o estudante em todas as etapas da vida acadêmica e emocional.</p>
        </div>
        <div className="services-grid">
          {[
            ["🧠","Atendimento individual","Sessões de psicoterapia conduzidas por estagiários supervisionados."],
            ["📅","Agendamento online","Marque sua consulta a qualquer hora diretamente pela plataforma."],
            ["🤝","Entrevista de acolhimento","Conversa inicial para entender sua necessidade e indicar o caminho certo."],
            ["👥","Grupos e oficinas","Encontros em grupo sobre autoestima, gestão emocional e vida acadêmica."],
            ["📚","Conteúdos de apoio","Materiais sobre ansiedade, depressão e saúde mental estudantil."],
            ["🔒","Sigilo total","Todas as informações tratadas com confidencialidade absoluta."],
            ["🎓","Formação supervisionada","Estagiários orientados por psicólogos com CRP ativo durante todo o atendimento."],
            ["💬","Acompanhamento contínuo","Sessões regulares para evolução e suporte emocional ao longo da vida acadêmica."],
          ].map(([ic,t,d]) => (
            <div className="svc-card" key={t}>
              <div className="svc-icon">{ic}</div>
              <h3>{t}</h3><p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section className="sec sec-alt" id="sobre">
        <div className="sec-head">
          <div className="eyebrow">Quem somos</div>
          <h2 className="sec-title">A Clínica Escola de Psicologia</h2>
        </div>
        <div className="about-grid">
          <div className="about-body">
            <p>A Clínica Escola de Psicologia da Universidade FUMEC existe para cuidar das pessoas enquanto forma profissionais. Todos os atendimentos são conduzidos por estudantes avançados de Psicologia, com supervisão direta de professores experientes e registrados no CRP.</p>
            <p>Mais do que um serviço clínico, somos um espaço seguro de escuta, acolhimento e cuidado — onde cada sessão é levada a sério e cada pessoa é tratada com ética e respeito.</p>
            <ul className="about-check">
              {["Vinculada à Universidade FUMEC","Supervisionada por psicólogos CRP ativos","Segue integralmente o Código de Ética do CFP","Atendimento presencial em Belo Horizonte","Plataforma digital desenvolvida por alunos de SI"].map(i => (
                <li key={i}><div className="check-mark">✓</div>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            {[["🎯","Missão","Promover saúde mental e bem-estar para estudantes da FUMEC por meio de atendimento psicológico acessível, gratuito e eticamente orientado."],
              ["👁","Visão","Tornar-se referência em apoio psicológico universitário em Belo Horizonte, integrando tecnologia, cuidado humano e formação de qualidade."],
              ["💎","Valores","Ética, sigilo, acolhimento, responsabilidade, inclusão e respeito à diversidade de cada pessoa atendida."],
            ].map(([ic,t,d]) => (
              <div className="pillar" key={t}>
                <div className="pillar-icon">{ic}</div>
                <div><h4>{t}</h4><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section className="sec" id="recursos">
        <div className="sec-head">
          <div className="eyebrow">Informação e apoio</div>
          <h2 className="sec-title">Recursos de saúde mental</h2>
          <p className="sec-sub">Conteúdos para você se informar, se reconhecer e dar o primeiro passo.</p>
        </div>
        <div className="rec-grid">
          {[
            ["rh-teal","rd-teal","😰 Ansiedade e Estresse","Como identificar e lidar",["O que é ansiedade?","Sinais de alerta","Técnicas de respiração","Quando buscar ajuda"]],
            ["rh-navy","rd-navy","😔 Depressão","Informação e acolhimento",["Tristeza vs. depressão","Sintomas mais comuns","Como apoiar alguém","Tratamentos disponíveis"]],
            ["rh-plum","rd-plum","📖 Vida Acadêmica","Saúde mental na faculdade",["Síndrome do impostor","Procrastinação e foco","Gestão do tempo","Equilíbrio estudo e vida"]],
          ].map(([hcls,dcls,t,s,items]) => (
            <div className="rec-card" key={t}>
              <div className={`rec-head ${hcls}`}><h3>{t}</h3><p>{s}</p></div>
              <div className="rec-body"><ul>{items.map(i => <li key={i}><span className={`rec-dot ${dcls}`}></span>{i}</li>)}</ul></div>
            </div>
          ))}
        </div>
        <div className="crisis-box">
          <div className="crisis-icon">🆘</div>
          <div>
            <h4>Está em crise agora? Você não precisa enfrentar isso sozinho.</h4>
            <p>
              <strong>CVV — Centro de Valorização da Vida:</strong> ligue <strong>188</strong> (24 horas, gratuito) ou acesse <a href="https://cvv.org.br" target="_blank" rel="noreferrer">cvv.org.br</a>.<br/>
              <strong>CAPS:</strong> Centro de Atenção Psicossocial — serviço público e gratuito na sua cidade.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec sec-alt" id="faq">
        <div className="sec-head">
          <div className="eyebrow">Perguntas frequentes</div>
          <h2 className="sec-title">Dúvidas comuns</h2>
        </div>
        <div className="faq-wrap">
          {FAQS.map(([q, a], i) => (
            <div className="faq-item" key={q}>
              <button className="faq-q" onClick={() => setFaq(faq === i ? null : i)}>
                {q}
                <span className={`faq-chevron ${faq===i?"open":""}`}>▾</span>
              </button>
              {faq === i && <div className="faq-a">{a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FALE CONOSCO */}
      <section className="sec" id="contato">
        <div className="sec-head">
          <div className="eyebrow">Fale conosco</div>
          <h2 className="sec-title">Entre em contato</h2>
        </div>
        <div className="contact-grid">
          <div>
            <h3 style={{fontFamily:"var(--font-head)",fontSize:18,fontWeight:700,marginBottom:"1.5rem",color:"var(--ink)"}}>Informações de contato</h3>
            {[["📍","Endereço","Universidade FUMEC — Belo Horizonte, MG"],["✉️","E-mail","clinicaescola@fumec.br"],["🕐","Horário de funcionamento","Segunda a sexta, das 8h às 18h"]].map(([ic,l,v]) => (
              <div className="cinfo-row" key={l}>
                <div className="cinfo-ic">{ic}</div>
                <div className="cinfo-ic-text"><strong>{l}</strong><span>{v}</span></div>
              </div>
            ))}
            <div className="warn-notice">⚠️ <strong>Atenção:</strong> Esta não é uma linha de crise. Em situação de emergência, ligue <strong>188 (CVV)</strong> ou vá ao pronto-socorro mais próximo.</div>
          </div>
          <div className="form-card">
            <div className="fg form-row">
              <div><label>Nome *</label><input value={cNome} onChange={e=>setCNome(e.target.value)} placeholder="Seu nome completo"/></div>
              <div><label>Matrícula</label><input value={cMat} onChange={e=>setCMat(e.target.value)} placeholder="20240001"/></div>
            </div>
            <div className="fg"><label>E-mail *</label><input type="email" value={cEmail} onChange={e=>setCEmail(e.target.value)} placeholder="seu@fumec.edu.br"/></div>
            <div className="fg"><label>Assunto *</label>
              <select value={cAssunto} onChange={e=>setCAssunto(e.target.value)}>
                <option value="">Selecione...</option>
                <option>Agendamento</option>
                <option>Dúvidas gerais</option>
                <option>Informações sobre o serviço</option>
                <option>Outro</option>
              </select>
            </div>
            <div className="fg"><label>Mensagem *</label><textarea value={cMsg} onChange={e=>setCMsg(e.target.value)} placeholder="Como podemos ajudar?"/></div>
            <button className="form-btn" onClick={sendContact} disabled={contactBusy}>
              {contactBusy ? <><Spin/> Enviando...</> : "Enviar mensagem"}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="nav-logo" style={{textDecoration:"none"}}>
              <Logo size={32} light/>
              <div className="nav-logo-text"><strong>FUMEC</strong><span style={{color:"rgba(255,255,255,.4)"}}>Clínica Escola · Psicologia</span></div>
            </a>
            <p>Plataforma desenvolvida como projeto extensionista por estudantes de Sistemas de Informação da FUMEC, 2026.</p>
          </div>
          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>{["Início","Serviços","Sobre","Recursos","Dúvidas","Fale Conosco"].map(i=><li key={i}><a href="#">{i}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>Links úteis</h4>
            <ul>
              <li><a href="https://www.fumec.br" target="_blank" rel="noreferrer">Site oficial da FUMEC</a></li>
              <li><a href="https://cvv.org.br" target="_blank" rel="noreferrer">CVV — Ligue 188</a></li>
              <li><a href="https://cfp.org.br" target="_blank" rel="noreferrer">Conselho Federal de Psicologia</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <p>© 2026 Universidade FUMEC · Todos os direitos reservados</p>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span className="lgpd">🔒 LGPD Conforme</span>
            <a href="#" style={{color:"rgba(255,255,255,.4)",fontSize:12}}>Política de privacidade</a>
          </div>
        </div>
      </footer>

      {/* MODAL LOGIN/CADASTRO */}
      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setModal(false)}>✕</button>
            <div className="modal-logo">
              <Logo size={38}/>
              <div className="modal-logo-text"><strong>FUMEC</strong><span>Clínica Escola de Psicologia</span></div>
            </div>
            <div className="modal-tabs">
              <button className={`modal-tab ${tab==="login"?"active":""}`} onClick={() => {setTab("login");setErr("");}}>Entrar na conta</button>
              <button className={`modal-tab ${tab==="reg"?"active":""}`}   onClick={() => {setTab("reg");setErr("");}}>Criar conta</button>
            </div>
            {tab === "login" ? (
              <>
                <div className="fg"><label>E-mail</label><input type="email" value={lEmail} onChange={e=>setLE(e.target.value)} placeholder="seu@email.com"/></div>
                <div className="fg"><label>Senha</label><input type="password" value={lPass} onChange={e=>setLP(e.target.value)} placeholder="••••••" onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
                {err && <div className="msg-err">⚠️ {err}</div>}
                <button className="form-btn" onClick={doLogin} disabled={busy}>{busy?<><Spin/> Entrando...</>:"Entrar"}</button>
              </>
            ) : (
              <>
                <p style={{fontSize:13,color:"var(--ink-2)",marginBottom:"1rem"}}>Selecione o tipo de conta:</p>
                <div className="role-grid">
                  {[["paciente","🙋","Paciente"],["psicologo","🧑‍⚕️","Psicólogo"],["supervisor","👩‍🏫","Supervisor"]].map(([v,ic,l]) => (
                    <button key={v} className={`role-btn ${role===v?"active":""}`} onClick={() => setRole(v)}>
                      <span className="ri">{ic}</span>{l}
                    </button>
                  ))}
                </div>
                {role === "supervisor" && (
                  <div className="al al-warn" style={{marginBottom:"1rem"}}>
                    ⚠️ Contas de supervisor precisam ser aprovadas por outro supervisor já cadastrado antes do primeiro acesso.
                  </div>
                )}
                <div className="fg"><label>Nome completo *</label><input value={rName} onChange={e=>setRN(e.target.value)} placeholder="Seu nome"/></div>
                <div className="fg"><label>E-mail *</label><input type="email" value={rEmail} onChange={e=>setRE(e.target.value)} placeholder="seu@fumec.edu.br"/></div>
                {role==="paciente"  && <div className="fg"><label>Matrícula FUMEC</label><input value={rMat} onChange={e=>setRM(e.target.value)} placeholder="20240001"/></div>}
                {role!=="paciente"  && <div className="fg"><label>CRP</label><input value={rCrp} onChange={e=>setRC(e.target.value)} placeholder="04/12345"/></div>}
                <div className="fg"><label>Senha * (mín. 6 caracteres)</label><input type="password" value={rPass} onChange={e=>setRP(e.target.value)} placeholder="••••••"/></div>
                {err && <div className="msg-err">⚠️ {err}</div>}
                <button className="form-btn" onClick={doRegister} disabled={busy}>{busy?<><Spin/> Criando conta...</>:"Criar minha conta"}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD SHELL ─────────────────────────────────────────────────────────
function Dashboard({ user, profile, onLogout, onProfileUpdate }) {
  const [aba, setAba] = useState("inicio");
  const MENUS = {
    paciente:   [{id:"inicio",ic:"🏠",l:"Início"},{id:"perfil",ic:"👤",l:"Meu Perfil"},{id:"agendar",ic:"📅",l:"Agendar Consulta"},{id:"consultas",ic:"📋",l:"Minhas Consultas"}],
    psicologo:  [{id:"inicio",ic:"🏠",l:"Início"},{id:"perfil",ic:"👤",l:"Meu Perfil"},{id:"agenda",ic:"📅",l:"Minha Agenda"},{id:"atendimentos",ic:"📋",l:"Atendimentos"},{id:"feedbacks",ic:"💬",l:"Feedbacks Recebidos"}],
    supervisor: [{id:"inicio",ic:"🏠",l:"Início"},{id:"perfil",ic:"👤",l:"Meu Perfil"},{id:"usuarios",ic:"👥",l:"Gestão de Usuários"},{id:"todos",ic:"📊",l:"Todos Atendimentos"},{id:"gerenciar",ic:"⚙️",l:"Gerenciar Agenda"},{id:"feedback",ic:"✍️",l:"Dar Feedback"},{id:"mensagens",ic:"✉️",l:"Fale Conosco"}],
  };
  const LABELS = {paciente:"Paciente",psicologo:"Psicólogo(a)",supervisor:"Supervisor(a)"};
  const BADGES = {paciente:"badge-pac",psicologo:"badge-psi",supervisor:"badge-sup"};
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || null);
  const fileRef = useRef();

  // Badges de notificação no menu (apenas supervisor)
  const [pendingCounts, setPendingCounts] = useState({ usuarios: 0, agenda: 0, mensagens: 0 });
  useEffect(() => {
    if (profile.tipo !== "supervisor") return;
    let cancelled = false;
    async function loadCounts() {
      const [{ count: usuariosCount }, { count: agendaCount }, { count: msgCount }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true })
          .in("tipo", ["supervisor", "psicologo"]).eq("status", "pendente_aprovacao"),
        supabase.from("agendamentos").select("id", { count: "exact", head: true }).eq("status", "pendente"),
        supabase.from("contatos").select("id", { count: "exact", head: true }).eq("lida", false),
      ]);
      if (cancelled) return;
      setPendingCounts({
        usuarios: usuariosCount || 0,
        agenda: agendaCount || 0,
        mensagens: msgCount || 0,
      });
    }
    loadCounts();
    return () => { cancelled = true; };
  }, [profile.tipo, aba]); // re-checa ao trocar de aba (ex: após aprovar/responder)

  const BADGE_COUNTS = {
    usuarios: pendingCounts.usuarios,
    gerenciar: pendingCounts.agenda,
    mensagens: pendingCounts.mensagens,
  };

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { toast("Erro ao enviar imagem.", "err"); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    setAvatarUrl(publicUrl + "?t=" + Date.now());
    onProfileUpdate({ ...profile, avatar_url: publicUrl });
    toast("✅ Foto atualizada!");
  }

  return (
    <div>
      <style>{CSS}</style>
      <Toasts/>
      <nav className="nav">
        <a className="nav-logo">
          <Logo size={32} light/>
          <div className="nav-logo-text"><strong>FUMEC</strong><span>Clínica Escola · Psicologia</span></div>
        </a>
        <ul className="nav-links">
          <li>
            <div className="nav-user-pill">
              <Avatar className="nav-user-avatar" name={profile.nome} url={avatarUrl}/>
              <span style={{fontSize:13,color:"rgba(255,255,255,.85)"}}>{profile.nome.split(" ")[0]}</span>
              <span className={`badge ${BADGES[profile.tipo]}`}>{LABELS[profile.tipo]}</span>
            </div>
          </li>
          <li><button className="nav-link" onClick={onLogout}>Sair →</button></li>
        </ul>
      </nav>
      <div className="dash">
        <aside className="sidebar">
          <div className="sb-user">
            <div className="sb-avatar-wrap">
              <Avatar className="sb-avatar" name={profile.nome} url={avatarUrl}/>
              <div className="sb-avatar-edit" onClick={() => fileRef.current?.click()} title="Trocar foto">📷</div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarUpload}/>
            </div>
            <h4>{profile.nome}</h4>
            <span>{LABELS[profile.tipo]}</span>
          </div>
          <nav className="sb-nav">
            {(MENUS[profile.tipo]||[]).map(m => {
              const badge = BADGE_COUNTS[m.id] || 0;
              return (
                <button key={m.id} className={`sb-item ${aba===m.id?"on":""}`} onClick={() => setAba(m.id)}>
                  <span className="si">{m.ic}</span>{m.l}
                  {badge > 0 && <span className="sb-item-badge">{badge > 99 ? "99+" : badge}</span>}
                </button>
              );
            })}
          </nav>
          <div className="sb-foot">
            <button className="btn btn-sm btn-danger" style={{width:"100%"}} onClick={onLogout}>🚪 Sair da conta</button>
          </div>
        </aside>

        {/* BOTTOM NAV — mobile only */}
        <nav className="bot-nav">
          <div className="bot-nav-inner">
            {(MENUS[profile.tipo]||[]).map(m => {
              const badge = BADGE_COUNTS[m.id] || 0;
              return (
                <button key={m.id} className={`bot-nav-item ${aba===m.id?"on":""}`} onClick={() => setAba(m.id)} style={{position:"relative"}}>
                  <span className="bni">{m.ic}</span>
                  <span>{m.l.split(" ")[0]}</span>
                  {badge > 0 && <span className="bot-nav-item-badge">{badge > 9 ? "9+" : badge}</span>}
                </button>
              );
            })}
            <button className="bot-nav-item" onClick={onLogout}>
              <span className="bni">🚪</span>
              <span>Sair</span>
            </button>
          </div>
        </nav>
        <main className="dash-main">
          {profile.tipo==="paciente"   && <DashPac  aba={aba} setAba={setAba} profile={profile} uid={user.id} onPU={onProfileUpdate} avatarUrl={avatarUrl}/>}
          {profile.tipo==="psicologo"  && <DashPsi  aba={aba} setAba={setAba} profile={profile} uid={user.id} onPU={onProfileUpdate} avatarUrl={avatarUrl}/>}
          {profile.tipo==="supervisor" && <DashSup  aba={aba} setAba={setAba} profile={profile} uid={user.id} onPU={onProfileUpdate} avatarUrl={avatarUrl}/>}
        </main>
      </div>
    </div>
  );
}

// ─── PACIENTE ────────────────────────────────────────────────────────────────
function DashPac({ aba, setAba, profile, uid, onPU, avatarUrl }) {
  const [consultas, setConsultas] = useState([]);
  const [psicos, setPsicos]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [nome, setNome]           = useState(profile.nome);
  const [mat, setMat]             = useState(profile.matricula||"");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const {data:ag} = await supabase.from("agendamentos").select("*").eq("paciente_id",uid).order("data",{ascending:true});
      const {data:ps} = await supabase.from("profiles").select("id,nome,crp").eq("tipo","psicologo").eq("status","ativo");
      setConsultas(ag||[]); setPsicos(ps||[]); setLoading(false);
    })();
  }, [uid]);

  async function salvar() {
    const {data,error} = await supabase.from("profiles").update({nome,matricula:mat}).eq("id",uid).select().single();
    if (error) { toast("Erro ao salvar.", "err"); return; }
    if (data) { onPU(data); toast("✅ Perfil atualizado com sucesso!"); }
  }

  if (aba==="perfil") return (
    <div>
      <div className="dash-title">👤 Meu Perfil</div>
      <div className="dash-sub">Suas informações pessoais</div>
      <div className="prof-card">
        <div className="prof-av-wrap">
          <Avatar className="prof-av" name={profile.nome} url={avatarUrl}/>
        </div>
        <div className="prof-info"><h3>{profile.nome}</h3><p>{profile.email}{profile.matricula&&` · Matrícula: ${profile.matricula}`}</p><br/><span className="chip">Paciente</span></div>
      </div>
      <div className="panel">
        <div className="panel-title">✏️ Editar dados</div>
        <div className="fg"><label>Nome</label><input value={nome} onChange={e=>setNome(e.target.value)}/></div>
        <div className="fg"><label>Matrícula</label><input value={mat} onChange={e=>setMat(e.target.value)} placeholder="20240001"/></div>
        <button className="btn btn-teal btn-sm" onClick={salvar}>Salvar alterações</button>
      </div>
    </div>
  );

  if (aba==="agendar") return <TelaAgendar uid={uid} profile={profile} psicos={psicos} onAgendado={ag=>setConsultas(c=>[...c,ag])}/>;

  if (aba==="consultas") return (
    <div>
      <div className="dash-title">📋 Minhas Consultas</div>
      <div className="dash-sub">Histórico e próximas sessões</div>
      {loading ? <Loading kind="table" rows={4} /> :
       consultas.length===0 ? (
         <EmptyState
           icon="🗓️"
           title="Nenhuma consulta agendada ainda"
           subtitle="Que tal marcar sua primeira sessão? É rápido e totalmente gratuito para estudantes da FUMEC."
           ctaLabel="📅 Agendar consulta"
           onCta={() => setAba("agendar")}
         />
       ) :
        <div className="panel">
          <div className="tw"><table>
            <thead><tr><th>Data</th><th>Horário</th><th>Psicólogo(a)</th><th>Sessão</th><th>Status</th></tr></thead>
            <tbody>{consultas.map(a=>(
              <tr key={a.id}><td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.psicologo_nome||"—"}</td>
                <td>#{a.sessao_numero}</td><td><span className={`st st-${a.status}`}>{a.status}</span></td></tr>
            ))}</tbody>
          </table></div>
        </div>
      }
    </div>
  );

  const conf = consultas.filter(a=>a.status==="confirmado").length;
  const pend = consultas.filter(a=>a.status==="pendente").length;
  const conc = consultas.filter(a=>a.status==="concluido").length;
  const prox = consultas.filter(a=>a.status!=="concluido"&&a.status!=="cancelado");

  return (
    <div>
      <div className="dash-title">Olá, {profile.nome.split(" ")[0]}! 👋</div>
      <div className="dash-sub">Bem-vindo(a) à sua área de paciente</div>
      {loading ? <>
        <Loading kind="kpi" rows={3} />
        <Loading kind="table" rows={3} />
      </> : <>
        <div className="kpi-row">
          <div className="kpi"><div className="kpi-num">{conf}</div><div className="kpi-label">Consultas confirmadas</div></div>
          <div className="kpi"><div className="kpi-num">{pend}</div><div className="kpi-label">Aguardando confirmação</div></div>
          <div className="kpi"><div className="kpi-num">{conc}</div><div className="kpi-label">Sessões realizadas</div></div>
        </div>
        <div className="panel">
          <div className="panel-title">📅 Próximas consultas</div>
          {prox.length===0 ? (
            <EmptyState
              icon="🗓️"
              title="Nenhuma consulta agendada"
              subtitle="Marque sua primeira sessão com um de nossos psicólogos."
              ctaLabel="📅 Agendar consulta"
              onCta={() => setAba("agendar")}
            />
          ) :
            <div className="tw"><table>
              <thead><tr><th>Data</th><th>Horário</th><th>Psicólogo(a)</th><th>Status</th></tr></thead>
              <tbody>{prox.slice(0,5).map(a=>(
                <tr key={a.id}><td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.psicologo_nome||"—"}</td>
                  <td><span className={`st st-${a.status}`}>{a.status}</span></td></tr>
              ))}</tbody>
            </table></div>
          }
        </div>
        <div className="al al-warn">⚠️ Em caso de crise, ligue para o <strong>CVV: 188</strong> (24h, gratuito)</div>
      </>}
    </div>
  );
}

// ─── AGENDAMENTO ─────────────────────────────────────────────────────────────
function TelaAgendar({ uid, profile, psicos, onAgendado }) {
  const hoje = new Date();
  const [mes, setMes]       = useState(hoje.getMonth());
  const [ano, setAno]       = useState(hoje.getFullYear());
  const [dia, setDia]       = useState(null);
  const [hora, setHora]     = useState(null);
  const [psico, setPsico]   = useState(psicos[0]?.id||"");
  const [ocupados, setOc]   = useState([]);
  const [disponivel, setDisp] = useState([]);
  const [salvando, setSalv] = useState(false);
  const [ok, setOk]         = useState(null);

  const HORAS = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"];
  const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  useEffect(() => {
    if (!dia||!psico) return;
    const ds = `${ano}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
    supabase.from("agendamentos").select("hora").eq("psicologo_id",psico).eq("data",ds).neq("status","cancelado")
      .then(({data}) => setOc((data||[]).map(r=>r.hora.slice(0,5))));
    // Fetch disponibilidade se existir (silencia erro se tabela não criada ainda)
    const diaSemana = new Date(ano,mes,dia).getDay();
    const diasNomes = ["domingo","segunda","terca","quarta","quinta","sexta","sabado"];
    supabase.from("disponibilidade").select("horas").eq("psicologo_id",psico).eq("dia",diasNomes[diaSemana]).maybeSingle()
      .then(({data, error}) => {
        if (error || !data?.horas?.length) setDisp(HORAS);
        else setDisp(data.horas);
      });
  }, [dia, psico, mes, ano]);

  const diasNoMes = new Date(ano,mes+1,0).getDate();
  const primDia   = new Date(ano,mes,1).getDay();
  const dias = [];
  for(let i=0;i<primDia;i++) dias.push(null);
  for(let d=1;d<=diasNoMes;d++) dias.push(d);

  const isPast  = d => new Date(ano,mes,d) < new Date(hoje.getFullYear(),hoje.getMonth(),hoje.getDate());
  const isToday = d => d===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear();

  async function confirmar() {
    if (!dia||!hora||!psico) return;
    setSalv(true);
    const ds = `${ano}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
    const pnome = psicos.find(p=>p.id===psico)?.nome||"";
    const {count} = await supabase.from("agendamentos").select("*",{count:"exact",head:true}).eq("paciente_id",uid);
    const {data,error} = await supabase.from("agendamentos").insert({
      paciente_id:uid, psicologo_id:psico, paciente_nome:profile.nome,
      psicologo_nome:pnome, data:ds, hora, status:"pendente", sessao_numero:(count||0)+1,
    }).select().single();
    setSalv(false);
    if (!error&&data) { setOk(data); onAgendado(data); toast("✅ Consulta agendada com sucesso!"); }
    else toast("Erro ao agendar. Tente novamente.", "err");
  }

  if (ok) return (
    <div>
      <div className="dash-title">📅 Agendar Consulta</div>
      <div className="al al-ok" style={{fontSize:15,padding:"1.5rem",lineHeight:2}}>
        ✅ <strong>Consulta agendada com sucesso!</strong><br/>
        📅 Data: <strong>{fmt(ok.data)}</strong> · 🕐 <strong>{fmtH(ok.hora)}</strong><br/>
        🧑‍⚕️ Psicólogo(a): <strong>{ok.psicologo_nome}</strong><br/>
        ⏳ Aguardando confirmação do supervisor.
      </div>
      <button className="btn btn-teal btn-sm" onClick={()=>{setOk(null);setDia(null);setHora(null);}}>Agendar outro horário</button>
    </div>
  );

  return (
    <div>
      <div className="dash-title">📅 Agendar Consulta</div>
      <div className="dash-sub">Escolha o profissional, o dia e o horário disponível</div>
      {psicos.length===0
        ? <EmptyState
            icon="🧑‍⚕️"
            title="Nenhum psicólogo disponível no momento"
            subtitle="Nossa equipe está organizando os profissionais ativos. Tente novamente em breve ou acompanhe pelo Fale Conosco."
          />
        : <>
          <div className="panel">
            <div className="panel-title">🧑‍⚕️ Escolha o psicólogo(a)</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {psicos.map(p=>(
                <button key={p.id} onClick={()=>{setPsico(p.id);setDia(null);setHora(null);}} className="btn btn-sm" style={{
                  background:psico===p.id?"var(--ink)":"var(--bg-warm)",
                  color:psico===p.id?"#fff":"var(--ink)",
                  border:`1.5px solid ${psico===p.id?"var(--ink)":"var(--border)"}`,
                }}>{p.nome}{p.crp&&` · CRP ${p.crp}`}</button>
              ))}
            </div>
          </div>
          <div className="cal-wrap">
            <div className="cal">
              <div className="cal-hdr">
                <button className="cal-nav-btn" onClick={()=>{if(mes===0){setMes(11);setAno(y=>y-1);}else setMes(m=>m-1);}}>‹</button>
                <h3>{MESES[mes]} {ano}</h3>
                <button className="cal-nav-btn" onClick={()=>{if(mes===11){setMes(0);setAno(y=>y+1);}else setMes(m=>m+1);}}>›</button>
              </div>
              <div className="cal-grid">
                {["D","S","T","Q","Q","S","S"].map((d,i)=><div className="cal-dn" key={i}>{d}</div>)}
                {dias.map((d,i)=>(
                  <div key={i} className={`cd${!d?" cd-empty":""}${d&&isToday(d)&&dia!==d?" cd-today":""}${d&&dia===d?" cd-selected":""}${d&&isPast(d)?" cd-past":""}`}
                    onClick={()=>d&&!isPast(d)&&(setDia(d),setHora(null))}>{d||""}</div>
                ))}
              </div>
            </div>
            <div className="cal">
              <div className="cal-hdr"><h3>{dia?`${dia}/${mes+1} — Horários`:"Selecione um dia"}</h3></div>
              {!dia ? <div className="al al-info" style={{marginTop:8}}>Clique em um dia no calendário para ver os horários disponíveis.</div>
               : <>
                  <div className="slots">
                    {(disponivel.length>0?disponivel:HORAS).map(h=>{
                      const oc = ocupados.includes(h);
                      return <div key={h} className={`slot${oc?" slot-taken":""}${hora===h?" slot-sel":""}`}
                        onClick={()=>!oc&&setHora(h)}>{h}{oc?" · ocupado":""}</div>;
                    })}
                  </div>
                  {hora && (
                    <div style={{marginTop:"1rem"}}>
                      <div className="al al-ok" style={{marginBottom:"1rem"}}>✅ <strong>{dia}/{mes+1} às {hora}</strong></div>
                      <button className="btn btn-teal" style={{width:"100%"}} onClick={confirmar} disabled={salvando}>
                        {salvando?<><Spin/> Salvando...</>:"Confirmar agendamento"}
                      </button>
                    </div>
                  )}
                </>
              }
            </div>
          </div>
        </>
      }
    </div>
  );
}

// ─── PSICÓLOGO ───────────────────────────────────────────────────────────────
function DashPsi({ aba, setAba, profile, uid, onPU, avatarUrl }) {
  const [atend, setAtend] = useState([]);
  const [fbs, setFbs]     = useState([]);
  const [loading, setL]   = useState(true);
  const [nome, setNome]   = useState(profile.nome);
  const [crp, setCrp]     = useState(profile.crp||"");

  // Agenda state
  const HORAS = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"];
  const DIAS  = ["segunda","terca","quarta","quinta","sexta"];
  const DIAS_LABEL = {segunda:"Segunda",terca:"Terça",quarta:"Quarta",quinta:"Quinta",sexta:"Sexta"};
  const [agenda, setAgenda] = useState(() => {
    const obj = {};
    DIAS.forEach(d => { obj[d] = []; });
    return obj;
  });
  const [agendaLoaded, setAgendaLoaded] = useState(false);
  const [savingAgenda, setSavingAgenda] = useState(false);

  useEffect(() => {
    (async () => {
      setL(true);
      const {data:at} = await supabase.from("agendamentos").select("*").eq("psicologo_id",uid).order("data",{ascending:true});
      const {data:fb} = await supabase.from("feedbacks").select("*").eq("psicologo_id",uid).order("created_at",{ascending:false});
      setAtend(at||[]); setFbs(fb||[]); setL(false);
    })();
  }, [uid]);

  useEffect(() => {
    if (aba !== "agenda" || agendaLoaded) return;
    (async () => {
      const {data, error: dispErr} = await supabase.from("disponibilidade").select("*").eq("psicologo_id",uid);
      if (!dispErr && data && data.length > 0) {
        const obj = {};
        DIAS.forEach(d => { obj[d] = []; });
        data.forEach(row => { if (obj[row.dia] !== undefined) obj[row.dia] = row.horas || []; });
        setAgenda(obj);
      }
      setAgendaLoaded(true);
    })();
  }, [aba, uid, agendaLoaded]);

  function toggleHora(dia, hora) {
    setAgenda(prev => {
      const arr = prev[dia] || [];
      return { ...prev, [dia]: arr.includes(hora) ? arr.filter(h=>h!==hora) : [...arr, hora] };
    });
  }

  async function salvarAgenda() {
    setSavingAgenda(true);
    const { error: delErr } = await supabase.from("disponibilidade").delete().eq("psicologo_id",uid);
    if (delErr && delErr.code !== "42P01") { // 42P01 = table doesn't exist
      toast("Erro ao limpar disponibilidade anterior.", "err"); setSavingAgenda(false); return;
    }
    const rows = DIAS.map(d => ({ psicologo_id: uid, dia: d, horas: agenda[d] }));
    const {error} = await supabase.from("disponibilidade").insert(rows);
    setSavingAgenda(false);
    if (error) {
      if (error.code === "42P01") { toast("⚠️ Tabela disponibilidade não criada. Execute a migration SQL.", "err"); }
      else { toast("Erro ao salvar disponibilidade.", "err"); }
      return;
    }
    toast("✅ Disponibilidade salva com sucesso!");
  }

  async function salvarPerfil() {
    const {data,error} = await supabase.from("profiles").update({nome,crp}).eq("id",uid).select().single();
    if (error) { toast("Erro ao salvar.", "err"); return; }
    if (data) { onPU(data); toast("✅ Perfil atualizado!"); }
  }

  if (aba==="perfil") return (
    <div>
      <div className="dash-title">👤 Meu Perfil</div>
      <div className="prof-card">
        <div className="prof-av-wrap">
          <Avatar className="prof-av" name={profile.nome} url={avatarUrl}/>
        </div>
        <div className="prof-info"><h3>{profile.nome}</h3><p>{profile.email}{profile.crp&&` · CRP: ${profile.crp}`}</p><br/><span className="chip">Psicólogo(a) Estagiário(a)</span></div>
      </div>
      <div className="panel">
        <div className="panel-title">✏️ Editar dados</div>
        <div className="fg"><label>Nome</label><input value={nome} onChange={e=>setNome(e.target.value)}/></div>
        <div className="fg"><label>CRP</label><input value={crp} onChange={e=>setCrp(e.target.value)} placeholder="04/12345"/></div>
        <button className="btn btn-teal btn-sm" onClick={salvarPerfil}>Salvar</button>
      </div>
    </div>
  );

  if (aba==="agenda") return (
    <div>
      <div className="dash-title">📅 Minha Agenda</div>
      <div className="dash-sub">Configure sua disponibilidade semanal</div>
      <div className="panel">
        <div className="panel-title">🕐 Horários disponíveis</div>
        <div className="al al-info" style={{marginBottom:"1.25rem"}}>Toque nos horários em que você pode atender. Eles ficarão visíveis para os pacientes no agendamento.</div>
        <div className="avail-grid">
          <div className="avail-row avail-head">
            <div className="avail-day"></div>
            {HORAS.map(h=><div className="avail-h" key={h}>{h}</div>)}
          </div>
          {DIAS.map(d=>(
            <div className="avail-row" key={d}>
              <div className="avail-day">{DIAS_LABEL[d]}</div>
              {HORAS.map(h=>{
                const on = (agenda[d]||[]).includes(h);
                return (
                  <button
                    key={h}
                    className={`avail-cell ${on?"on":""}`}
                    onClick={()=>toggleHora(d,h)}
                    aria-label={`${DIAS_LABEL[d]} ${h}`}
                  >
                    {on ? "✓" : ""}
                    <span className="avail-cell-label">{h}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <button className="btn btn-teal" style={{marginTop:"1.5rem"}} onClick={salvarAgenda} disabled={savingAgenda}>
          {savingAgenda ? <><Spin/> Salvando...</> : "💾 Salvar disponibilidade"}
        </button>
      </div>
    </div>
  );

  if (aba==="atendimentos") return (
    <div>
      <div className="dash-title">📋 Meus Atendimentos</div>
      {loading ? <Loading kind="table" rows={5} /> :
        <div className="panel">
          <div className="panel-title">Lista de atendimentos</div>
          {atend.length===0 ? (
            <EmptyState
              icon="📋"
              title="Nenhum atendimento ainda"
              subtitle="Quando pacientes agendarem sessões com você, elas aparecerão aqui."
            />
          ) :
            <div className="tw"><table>
              <thead><tr><th>Data</th><th>Horário</th><th>Paciente</th><th>Sessão</th><th>Status</th></tr></thead>
              <tbody>{atend.map(a=>(
                <tr key={a.id}><td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td>
                  <td>#{a.sessao_numero}</td><td><span className={`st st-${a.status}`}>{a.status}</span></td></tr>
              ))}</tbody>
            </table></div>
          }
        </div>
      }
    </div>
  );

  if (aba==="feedbacks") return (
    <div>
      <div className="dash-title">💬 Feedbacks Recebidos</div>
      <div className="dash-sub">Avaliações do supervisor sobre seus atendimentos</div>
      {loading ? <Loading kind="cards" rows={3} /> :
       fbs.length===0 ? (
         <EmptyState
           icon="💬"
           title="Nenhum feedback recebido ainda"
           subtitle="Os feedbacks enviados pelo supervisor sobre suas sessões aparecerão aqui."
         />
       ) :
        fbs.map(fb=>(
          <div className="fb-card" key={fb.id}>
            <div className="fb-hdr"><h4>Sessão com {fb.paciente_nome||"—"}</h4><span>{fmt(fb.created_at?.slice(0,10))} · {fb.supervisor_nome}</span></div>
            <div className="stars">{"⭐".repeat(fb.nota||0)}</div>
            <p className="fb-text" style={{marginTop:8}}>{fb.texto}</p>
          </div>
        ))
      }
    </div>
  );

  return (
    <div>
      <div className="dash-title">Olá, {profile.nome.split(" ")[0]}! 🧑‍⚕️</div>
      <div className="dash-sub">Sua área de psicólogo(a) estagiário(a)</div>
      {loading ? <>
        <Loading kind="kpi" rows={4} />
        <Loading kind="table" rows={3} />
      </> : <>
        <div className="kpi-row">
          <div className="kpi"><div className="kpi-num">{atend.filter(a=>a.status==="confirmado").length}</div><div className="kpi-label">Confirmados</div></div>
          <div className="kpi"><div className="kpi-num">{atend.filter(a=>a.status==="pendente").length}</div><div className="kpi-label">Aguardando</div></div>
          <div className="kpi"><div className="kpi-num">{atend.filter(a=>a.status==="concluido").length}</div><div className="kpi-label">Concluídos</div></div>
          <div className="kpi"><div className="kpi-num">{fbs.length}</div><div className="kpi-label">Feedbacks</div></div>
        </div>
        <div className="panel">
          <div className="panel-title">📅 Próximos atendimentos</div>
          {atend.filter(a=>a.status!=="concluido"&&a.status!=="cancelado").length===0
            ? (
              <EmptyState
                icon="📅"
                title="Nenhum atendimento agendado"
                subtitle="Configure sua disponibilidade na agenda para que pacientes possam marcar sessões com você."
                ctaLabel="🕐 Configurar agenda"
                onCta={() => setAba("agenda")}
              />
            )
            : <div className="tw"><table>
                <thead><tr><th>Data</th><th>Horário</th><th>Paciente</th><th>Status</th></tr></thead>
                <tbody>{atend.filter(a=>a.status!=="concluido"&&a.status!=="cancelado").slice(0,5).map(a=>(
                  <tr key={a.id}><td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td>
                    <td><span className={`st st-${a.status}`}>{a.status}</span></td></tr>
                ))}</tbody>
              </table></div>
          }
        </div>
      </>}
    </div>
  );
}

// ─── SUPERVISOR ──────────────────────────────────────────────────────────────
function DashSup({ aba, setAba, profile, uid, onPU, avatarUrl }) {
  const [todos, setTodos]     = useState([]);
  const [fbs, setFbs]         = useState([]);
  const [psicos, setPsicos]   = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [msgSel, setMsgSel]   = useState(null);
  const [replyTxt, setReplyTxt] = useState("");
  const [loading, setL]       = useState(true);
  const [nome, setNome]       = useState(profile.nome);

  const [fbPsico, setFbP]     = useState("");
  const [fbPac, setFbPac]     = useState("");
  const [fbNota, setFbN]      = useState(5);
  const [fbTxt, setFbT]       = useState("");
  const [fbBusy, setFbB]      = useState(false);

  useEffect(() => {
    (async () => {
      setL(true);
      const {data:ag} = await supabase.from("agendamentos").select("*").order("data",{ascending:true});
      const {data:fb} = await supabase.from("feedbacks").select("*").order("created_at",{ascending:false});
      // Busca psicólogos — aceita status null (banco sem coluna) ou ativo
      const {data:ps} = await supabase.from("profiles").select("id,nome,crp,status,avatar_url").eq("tipo","psicologo");
      // Busca todos os usuários — pode retornar só o próprio se RLS restritivo
      const {data:us} = await supabase.from("profiles").select("*").order("created_at",{ascending:false});
      // Complementa com dados dos agendamentos caso RLS bloqueie
      const agUsers = ag||[];
      const psiNamesFromAg = Object.values(agUsers.reduce((acc,a)=>{ if(a.psicologo_id) acc[a.psicologo_id]={id:a.psicologo_id,nome:a.psicologo_nome,tipo:"psicologo"}; return acc; },{}));
      const pacNamesFromAg = Object.values(agUsers.reduce((acc,a)=>{ if(a.paciente_id) acc[a.paciente_id]={id:a.paciente_id,nome:a.paciente_nome,tipo:"paciente"}; return acc; },{}));
      const usFromAg = [...psiNamesFromAg,...pacNamesFromAg].map(u=>({...u, status:"ativo"}));
      // Merge: usa us se tem dados, caso contrário usa os extraídos dos agendamentos
      const mergedUs = (us && us.length > 0) ? us : [...(us||[]), ...usFromAg.filter(u=>(us||[]).findIndex(x=>x.id===u.id)===-1)];
      const mergedPs = (ps&&ps.length>0) ? ps : psiNamesFromAg.map(p=>({id:p.id,nome:p.nome,status:"ativo"}));
      const {data:ms, error: msErr} = await supabase.from("contatos").select("*").order("created_at",{ascending:false});
      setTodos(ag||[]); setFbs(fb||[]); setPsicos(mergedPs); setUsuarios(mergedUs); setMensagens(msErr ? [] : (ms||[]));
      if (msErr && msErr.code === "42P01") console.warn("Tabela contatos não existe. Execute a migration SQL.");
      setL(false);
    })();
  }, []);

  async function atualizar(id, status) {
    const { error } = await supabase.from("agendamentos").update({status}).eq("id",id);
    if (error) { toast("Erro ao atualizar agendamento.", "err"); return; }
    setTodos(p=>p.map(a=>a.id===id?{...a,status}:a));
    const msgs = { confirmado:"✅ Confirmado!", concluido:"🟣 Concluído!", cancelado:"❌ Cancelado." };
    toast(msgs[status] || "✅ Atualizado!");
  }

  async function enviarFb() {
    if (!fbPsico||!fbTxt) { toast("Preencha psicólogo e observações.", "err"); return; }
    setFbB(true);
    const pn = psicos.find(p=>p.id===fbPsico)?.nome||"";
    const { error } = await supabase.from("feedbacks").insert({
      supervisor_id:uid, psicologo_id:fbPsico, supervisor_nome:profile.nome,
      psicologo_nome:pn, paciente_nome:fbPac||"—", nota:fbNota, texto:fbTxt
    });
    setFbB(false);
    if (error) { toast(`Erro ao enviar feedback: ${error.message}`, "err"); return; }
    toast("✅ Feedback enviado com sucesso!"); setFbT(""); setFbPac(""); setFbP(""); setFbN(5);
    const {data:fb} = await supabase.from("feedbacks").select("*").order("created_at",{ascending:false});
    setFbs(fb||[]);
  }

  async function salvarPerfil() {
    const {data,error} = await supabase.from("profiles").update({nome}).eq("id",uid).select().single();
    if (error) { toast("Erro ao salvar.", "err"); return; }
    if (data) { onPU(data); toast("✅ Perfil atualizado!"); }
  }

  async function setStatusUsuario(userId, novoStatus) {
    const { error } = await supabase.from("profiles").update({ status: novoStatus }).eq("id", userId);
    if (error) {
      if (error.code === "42703") {
        // Coluna status não existe no banco — roda a migration primeiro
        toast("⚠️ Execute a migration SQL para adicionar a coluna status. Veja MIGRATIONS_V1.sql", "err");
        return;
      }
      if (error.code === "42501" || error.message?.includes("violates row-level security")) {
        toast("⚠️ Permissão negada. Execute o SQL de policy no Supabase (ver MIGRATIONS_V1.sql).", "err");
        return;
      }
      toast(`Erro: ${error.message}`, "err");
      return;
    }
    // Atualiza estado local imediatamente
    setUsuarios(p => p.map(u => u.id === userId ? { ...u, status: novoStatus } : u));
    setPsicos(p => p.map(u => u.id === userId ? { ...u, status: novoStatus } : u));
    const acao = novoStatus === "ativo" ? "aprovado/ativado" : novoStatus === "inativo" ? "desativado/rejeitado" : novoStatus;
    toast(`✅ Usuário ${acao} com sucesso!`);
  }

  async function marcarMsgLida(msg) {
    if (!msg.lida) {
      const { error } = await supabase.from("contatos").update({lida:true}).eq("id",msg.id);
      if (!error) setMensagens(p=>p.map(m=>m.id===msg.id?{...m,lida:true}:m));
    }
    setMsgSel(msg);
  }

  if (aba==="perfil") return (
    <div>
      <div className="dash-title">👩‍🏫 Meu Perfil</div>
      <div className="prof-card">
        <div className="prof-av-wrap">
          <Avatar className="prof-av" name={profile.nome} url={avatarUrl}/>
        </div>
        <div className="prof-info"><h3>{profile.nome}</h3><p>{profile.email}</p><br/><span className="chip">Supervisor / Administrador</span></div>
      </div>
      <div className="panel">
        <div className="panel-title">✏️ Editar dados</div>
        <div className="fg"><label>Nome</label><input value={nome} onChange={e=>setNome(e.target.value)}/></div>
        <button className="btn btn-teal btn-sm" onClick={salvarPerfil}>Salvar</button>
      </div>
    </div>
  );

  // ── GESTÃO DE USUÁRIOS ────────────────────────────────────────────────────
  if (aba==="usuarios") return (
    <div>
      <div className="dash-title">👥 Gestão de Usuários</div>
      <div className="dash-sub">Gerencie contas, ative psicólogos e aprove supervisores</div>
      {loading ? <Loading kind="cards" rows={4} /> : <>

        {/* Supervisores pendentes */}
        {usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length>0 && (
          <div className="panel" style={{borderColor:"var(--amber)",borderWidth:2}}>
            <div className="panel-title" style={{color:"var(--amber)"}}>⏳ Supervisores aguardando aprovação ({usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length})</div>
            {usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").map(u=>(
              <div className="user-card" key={u.id}>
                <div className="user-card-left">
                  <div className="user-av-sm" style={{background:"var(--purple)"}}>{u.nome[0]}</div>
                  <div><div className="user-info-name">{u.nome}</div><div className="user-info-sub">{u.email} · Supervisor(a)</div></div>
                </div>
                <div className="user-card-actions">
                  <span className="st st-aguardando">Aguardando</span>
                  <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}>✅ Aprovar</button>
                  <button className="btn btn-sm btn-danger"  onClick={()=>setStatusUsuario(u.id,"inativo")}>❌ Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Psicólogos pendentes */}
        {usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length>0 && (
          <div className="panel" style={{borderColor:"var(--teal)",borderWidth:2}}>
            <div className="panel-title" style={{color:"var(--teal)"}}>⏳ Psicólogos aguardando ativação ({usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length})</div>
            {usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").map(u=>(
              <div className="user-card" key={u.id}>
                <div className="user-card-left">
                  <div className="user-av-sm" style={{background:"var(--teal)"}}>{u.nome[0]}</div>
                  <div>
                    <div className="user-info-name">{u.nome}</div>
                    <div className="user-info-sub">{u.email}{u.crp&&` · CRP: ${u.crp}`}</div>
                  </div>
                </div>
                <div className="user-card-actions">
                  <span className="st st-aguardando">Aguardando ativação</span>
                  <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}>✅ Ativar para atender</button>
                  <button className="btn btn-sm btn-danger"  onClick={()=>setStatusUsuario(u.id,"inativo")}>❌ Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Psicólogos ativos/inativos */}
        <div className="panel">
          <div className="panel-title">🧑‍⚕️ Psicólogos</div>
          {usuarios.filter(u=>u.tipo==="psicologo"&&u.status!=="pendente_aprovacao").length===0
            ? <EmptyState icon="🧑‍⚕️" title="Nenhum psicólogo cadastrado" subtitle="Quando psicólogos se cadastrarem na plataforma, eles aparecerão aqui para ativação." />
            : usuarios.filter(u=>u.tipo==="psicologo"&&u.status!=="pendente_aprovacao").map(u=>(
              <div className="user-card" key={u.id}>
                <div className="user-card-left">
                  <Avatar className="user-av-sm" name={u.nome} url={u.avatar_url}/>
                  <div>
                    <div className="user-info-name">{u.nome}</div>
                    <div className="user-info-sub">{u.email}{u.crp&&` · CRP: ${u.crp}`}</div>
                  </div>
                </div>
                <div className="user-card-actions">
                  <span className={`st st-${u.status||"ativo"}`}>{u.status||"ativo"}</span>
                  {(u.status||"ativo")!=="ativo"
                    ? <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}>✅ Ativar</button>
                    : <button className="btn btn-sm btn-danger"  onClick={()=>setStatusUsuario(u.id,"inativo")}>⛔ Desativar</button>
                  }
                </div>
              </div>
            ))
          }
        </div>

        {/* Pacientes */}
        <div className="panel">
          <div className="panel-title">🙋 Pacientes cadastrados</div>
          {usuarios.filter(u=>u.tipo==="paciente").length===0
            ? <EmptyState icon="🙋" title="Nenhum paciente cadastrado" subtitle="Estudantes que criarem conta na plataforma aparecerão aqui." />
            : <div className="tw"><table>
                <thead><tr><th>Nome</th><th>E-mail</th><th>Matrícula</th><th>Cadastro</th></tr></thead>
                <tbody>{usuarios.filter(u=>u.tipo==="paciente").map(u=>(
                  <tr key={u.id}><td>{u.nome}</td><td>{u.email||"—"}</td><td>{u.matricula||"—"}</td><td>{fmt(u.created_at?.slice(0,10))}</td></tr>
                ))}</tbody>
              </table></div>
          }
        </div>
      </>}
    </div>
  );

  if (aba==="todos") return (
    <div>
      <div className="dash-title">📊 Todos os Atendimentos</div>
      <div className="dash-sub">Visão geral de toda a clínica</div>
      {loading ? <>
        <Loading kind="kpi" rows={4} />
        <Loading kind="table" rows={5} />
      </> : <>
        <div className="kpi-row">
          {[["confirmado","✅ Confirmados"],["pendente","⏳ Pendentes"],["cancelado","❌ Cancelados"],["concluido","🟣 Concluídos"]].map(([st,l])=>(
            <div className="kpi" key={st}><div className="kpi-num">{todos.filter(a=>a.status===st).length}</div><div className="kpi-label">{l}</div></div>
          ))}
        </div>
        <div className="panel">
          <div className="panel-title">📋 Todos os agendamentos</div>
          {todos.length===0 ? (
            <EmptyState icon="📋" title="Nenhum agendamento ainda" subtitle="Quando pacientes marcarem consultas, todos os agendamentos da clínica aparecerão aqui." />
          ) :
            <div className="tw"><table>
              <thead><tr><th>Data</th><th>Hora</th><th>Paciente</th><th>Psicólogo</th><th>Status</th></tr></thead>
              <tbody>{todos.map(a=>(
                <tr key={a.id}><td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td>
                  <td>{a.psicologo_nome||"—"}</td><td><span className={`st st-${a.status}`}>{a.status}</span></td></tr>
              ))}</tbody>
            </table></div>
          }
        </div>
      </>}
    </div>
  );

  if (aba==="gerenciar") return (
    <div>
      <div className="dash-title">⚙️ Gerenciar Agenda</div>
      <div className="dash-sub">Confirme, conclua ou cancele agendamentos</div>
      {loading ? <Loading kind="table" rows={5} /> :
        <div className="panel">
          <div className="panel-title">🗂️ Agendamentos ativos</div>
          {todos.filter(a=>a.status!=="cancelado"&&a.status!=="concluido").length===0
            ? <EmptyState icon="✅" title="Tudo em ordem!" subtitle="Não há agendamentos pendentes de confirmação ou conclusão no momento." />
            : <div className="tw"><table>
                <thead><tr><th>Data</th><th>Hora</th><th>Paciente</th><th>Psicólogo</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>{todos.filter(a=>a.status!=="cancelado"&&a.status!=="concluido").map(a=>(
                  <tr key={a.id}>
                    <td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td><td>{a.psicologo_nome||"—"}</td>
                    <td><span className={`st st-${a.status}`}>{a.status}</span></td>
                    <td style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {a.status==="pendente"   && <button className="btn btn-sm btn-success" onClick={()=>atualizar(a.id,"confirmado")}>✅ Confirmar</button>}
                      {a.status==="confirmado" && <button className="btn btn-sm btn-success" onClick={()=>atualizar(a.id,"concluido")}>🟣 Concluir</button>}
                      <button className="btn btn-sm btn-danger" onClick={()=>atualizar(a.id,"cancelado")}>❌ Cancelar</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table></div>
          }
        </div>
      }
    </div>
  );

  if (aba==="feedback") return (
    <div>
      <div className="dash-title">✍️ Dar Feedback</div>
      <div className="dash-sub">Avalie uma sessão de atendimento realizada</div>
      <div className="panel">
        <div className="panel-title">📝 Novo feedback</div>
        <div className="fg"><label>Psicólogo(a) *</label>
          <select value={fbPsico} onChange={e=>setFbP(e.target.value)}>
            <option value="">Selecione...</option>
            {psicos.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div className="fg"><label>Paciente atendido</label>
          <select value={fbPac} onChange={e=>setFbPac(e.target.value)}>
            <option value="">Selecione...</option>
            {[...new Set(todos.map(a=>a.paciente_nome).filter(Boolean))].map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="fg"><label>Avaliação da sessão</label>
          <div style={{display:"flex",gap:6,marginTop:4}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>setFbN(n)} style={{fontSize:26,background:"none",border:"none",cursor:"pointer",opacity:n<=fbNota?1:.25,transition:"opacity .15s"}}>⭐</button>
            ))}
          </div>
        </div>
        <div className="fg"><label>Observações e feedback *</label>
          <textarea value={fbTxt} onChange={e=>setFbT(e.target.value)} placeholder="Descreva pontos fortes, áreas a desenvolver e sugestões técnicas..."/>
        </div>
        <button className="btn btn-teal" onClick={enviarFb} disabled={fbBusy}>{fbBusy?<><Spin/> Enviando...</>:"Enviar feedback"}</button>
      </div>
      {fbs.length>0 && (
        <div className="panel">
          <div className="panel-title">📄 Feedbacks anteriores</div>
          {fbs.map(fb=>(
            <div className="fb-card" key={fb.id}>
              <div className="fb-hdr"><h4>{fb.psicologo_nome} · {fb.paciente_nome||"—"}</h4><span>{fmt(fb.created_at?.slice(0,10))}</span></div>
              <div className="stars">{"⭐".repeat(fb.nota||0)}</div>
              <p className="fb-text" style={{marginTop:8}}>{fb.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── MENSAGENS / FALE CONOSCO ──────────────────────────────────────────────
  if (aba==="mensagens") {
    const naoLidas = mensagens.filter(m=>!m.lida).length;

    function enviarResposta() {
      if (!msgSel || !replyTxt.trim()) return;
      const assunto = encodeURIComponent(`Re: ${msgSel.assunto} — Clínica Escola FUMEC`);
      const corpo = encodeURIComponent(
        `Olá, ${msgSel.nome}!\n\n${replyTxt}\n\nAtenciosamente,\nEquipe da Clínica Escola de Psicologia — FUMEC\nclinicaescola@fumec.br`
      );
      window.open(`mailto:${msgSel.email}?subject=${assunto}&body=${corpo}`, "_blank");
      toast("✅ Cliente de e-mail aberto para envio!");
      setReplyTxt("");
    }

    return (
      <div>
        <div className="dash-title">✉️ Fale Conosco</div>
        <div className="dash-sub">{naoLidas > 0 ? `${naoLidas} mensagem(ns) não lida(s)` : "Todas as mensagens foram lidas"}</div>
        {loading ? <Loading kind="cards" rows={3} /> : <>
          {msgSel ? (
            <div className="panel">
              <button className="btn btn-outline btn-sm" style={{marginBottom:"1.25rem"}} onClick={()=>{setMsgSel(null);setReplyTxt("");}}>← Voltar para caixa de entrada</button>
              {/* Cabeçalho da mensagem */}
              <div style={{background:"var(--bg-warm)",borderRadius:"var(--r-sm)",padding:"1rem 1.25rem",marginBottom:"1rem"}}>
                <div style={{fontFamily:"var(--font-head)",fontSize:17,fontWeight:800,color:"var(--ink)",marginBottom:6}}>{msgSel.assunto}</div>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,color:"var(--ink-3)"}}>👤 <strong>{msgSel.nome}</strong></span>
                  <span style={{fontSize:13,color:"var(--teal)"}}>✉️ {msgSel.email}</span>
                  {msgSel.matricula && <span style={{fontSize:13,color:"var(--ink-3)"}}>🎓 Matrícula: {msgSel.matricula}</span>}
                  <span style={{fontSize:12,color:"var(--ink-3)"}}>🕐 {msgSel.created_at ? new Date(msgSel.created_at).toLocaleString("pt-BR") : ""}</span>
                </div>
              </div>
              {/* Corpo da mensagem */}
              <div style={{background:"var(--bg-warm)",borderRadius:"var(--r-sm)",padding:"1.25rem",fontSize:14.5,color:"var(--ink-2)",lineHeight:1.75,whiteSpace:"pre-wrap",marginBottom:"1.5rem",borderLeft:"3px solid var(--border-2)"}}>
                {msgSel.mensagem}
              </div>
              {/* Campo de resposta */}
              <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.25rem"}}>
                <div style={{fontFamily:"var(--font-head)",fontSize:14,fontWeight:700,color:"var(--ink)",marginBottom:10}}>✍️ Responder para {msgSel.nome}</div>
                <div className="al al-info" style={{marginBottom:"1rem",fontSize:12.5}}>
                  A resposta será aberta no seu cliente de e-mail padrão endereçada para <strong>{msgSel.email}</strong>.
                </div>
                <div className="fg">
                  <label>Sua resposta *</label>
                  <textarea
                    value={replyTxt}
                    onChange={e=>setReplyTxt(e.target.value)}
                    placeholder={`Olá, ${msgSel.nome}! Agradecemos seu contato...`}
                    style={{height:130}}
                  />
                </div>
                <button
                  className="btn btn-teal"
                  onClick={enviarResposta}
                  disabled={!replyTxt.trim()}
                  style={{opacity:replyTxt.trim()?1:.5}}
                >
                  📧 Abrir e-mail para enviar resposta
                </button>
              </div>
            </div>
          ) : (
            mensagens.length===0
              ? <EmptyState icon="✉️" title="Nenhuma mensagem recebida" subtitle="Mensagens enviadas pelo formulário Fale Conosco do site aparecerão aqui." />
              : mensagens.map(m=>(
                <div className={`msg-card ${!m.lida?"unread":""}`} key={m.id} onClick={()=>marcarMsgLida(m)}>
                  <div className="msg-card-hdr">
                    <div className="msg-card-from">{m.nome}{!m.lida&&<span className="notif-count">Nova</span>}</div>
                    <div className="msg-card-time">{m.created_at ? new Date(m.created_at).toLocaleDateString("pt-BR") : ""}</div>
                  </div>
                  <div className="msg-card-subject">{m.assunto}</div>
                  <div className="msg-card-preview">{m.mensagem}</div>
                </div>
              ))
          )}
        </>}
      </div>
    );
  }

  return (
    <div>
      <div className="dash-title">Olá, {profile.nome.split(" ")[0]}! 👩‍🏫</div>
      <div className="dash-sub">Painel de supervisão e administração da clínica</div>
      {loading ? <>
        <Loading kind="kpi" rows={4} />
        <Loading kind="table" rows={4} />
      </> : <>
        <div className="kpi-row">
          <div className="kpi"><div className="kpi-num">{todos.length}</div><div className="kpi-label">Total de agendamentos</div></div>
          <div className="kpi"><div className="kpi-num">{todos.filter(a=>a.status==="pendente").length}</div><div className="kpi-label">Aguardando aprovação</div></div>
          <div className="kpi"><div className="kpi-num">{todos.filter(a=>a.status==="confirmado").length}</div><div className="kpi-label">Confirmados</div></div>
          <div className="kpi"><div className="kpi-num">{psicos.filter(p=>!p.status||p.status==="ativo").length}</div><div className="kpi-label">Psicólogos ativos</div></div>
          {mensagens.filter(m=>!m.lida).length>0 && (
            <div className="kpi" style={{borderColor:"var(--amber)",borderWidth:2}}>
              <div className="kpi-num" style={{color:"var(--amber)"}}>{mensagens.filter(m=>!m.lida).length}</div>
              <div className="kpi-label">Mensagens não lidas</div>
            </div>
          )}
        </div>

        {/* Supervisores pendentes no início */}
        {usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length>0 && (
          <div className="panel" style={{borderColor:"var(--amber)",borderWidth:2}}>
            <div className="panel-title" style={{color:"var(--amber)"}}>⏳ Supervisores aguardando aprovação ({usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length})</div>
            {usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").map(u=>(
              <div className="user-card" key={u.id}>
                <div className="user-card-left">
                  <div className="user-av-sm" style={{background:"var(--purple)"}}>{u.nome[0]}</div>
                  <div><div className="user-info-name">{u.nome}</div><div className="user-info-sub">{u.email} · Supervisor(a)</div></div>
                </div>
                <div className="user-card-actions">
                  <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}>✅ Aprovar</button>
                  <button className="btn btn-sm btn-danger"  onClick={()=>setStatusUsuario(u.id,"inativo")}>❌ Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Psicólogos pendentes no início */}
        {usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length>0 && (
          <div className="panel" style={{borderColor:"var(--teal)",borderWidth:2}}>
            <div className="panel-title" style={{color:"var(--teal)"}}>⏳ Psicólogos aguardando ativação ({usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length})</div>
            {usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").map(u=>(
              <div className="user-card" key={u.id}>
                <div className="user-card-left">
                  <div className="user-av-sm" style={{background:"var(--teal)"}}>{u.nome[0]}</div>
                  <div><div className="user-info-name">{u.nome}</div><div className="user-info-sub">{u.email}{u.crp&&` · CRP: ${u.crp}`}</div></div>
                </div>
                <div className="user-card-actions">
                  <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}>✅ Ativar para atender</button>
                  <button className="btn btn-sm btn-danger"  onClick={()=>setStatusUsuario(u.id,"inativo")}>❌ Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {todos.filter(a=>a.status==="pendente").length>0 && (
          <div className="panel">
            <div className="panel-title">⏳ Pendentes de aprovação</div>
            <div className="tw"><table>
              <thead><tr><th>Data</th><th>Hora</th><th>Paciente</th><th>Psicólogo</th><th>Ações</th></tr></thead>
              <tbody>{todos.filter(a=>a.status==="pendente").map(a=>(
                <tr key={a.id}>
                  <td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td><td>{a.psicologo_nome||"—"}</td>
                  <td style={{display:"flex",gap:6}}>
                    <button className="btn btn-sm btn-success" onClick={()=>atualizar(a.id,"confirmado")}>✅ Confirmar</button>
                    <button className="btn btn-sm btn-danger"  onClick={()=>atualizar(a.id,"cancelado")}>❌ Cancelar</button>
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        )}
        {psicos.length>0 && (
          <div className="panel">
            <div className="panel-title">📊 Resumo por psicólogo</div>
            <div className="tw"><table>
              <thead><tr><th>Psicólogo(a)</th><th>Status</th><th>Total</th><th>Confirmados</th><th>Concluídos</th><th>Pendentes</th></tr></thead>
              <tbody>{psicos.map(p=>{
                const at = todos.filter(a=>a.psicologo_id===p.id);
                return <tr key={p.id}><td>{p.nome}</td>
                  <td><span className={`st st-${p.status||"inativo"}`}>{p.status||"inativo"}</span></td>
                  <td>{at.length}</td>
                  <td>{at.filter(a=>a.status==="confirmado").length}</td>
                  <td>{at.filter(a=>a.status==="concluido").length}</td>
                  <td>{at.filter(a=>a.status==="pendente").length}</td>
                </tr>;
              })}</tbody>
            </table></div>
          </div>
        )}
      </>}
    </div>
  );
}
