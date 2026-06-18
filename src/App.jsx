import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import iconApp from "./assets/icon-app.png";
import { BarChart, Bar, PieChart as RPieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  Sun, Moon, Inbox, X, AlertTriangle, HelpCircle, Search, Eye, EyeOff, KeyRound,
  Pencil, Mail, Landmark, Calendar, Heart, Lock, GraduationCap, ShieldCheck, Scale,
  MapPin, Brain, Handshake, Users, BookOpen, MessageCircle, Check, Target, Gem,
  CloudRain, LifeBuoy, Clock, ArrowRight, ArrowLeft, User, Stethoscope, UserCog,
  Home, ClipboardList, BarChart3, Settings, PenLine, Camera, LogOut, Star,
  RefreshCw, CalendarDays, Save, Ban, Download, Circle, XCircle, Hourglass,
  CheckCircle2, Info, PieChart, TrendingUp, FileText, FolderOpen,
} from "lucide-react";


// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
:root {
  --chrome:#0B2D4E;
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
  --grad-brand:linear-gradient(135deg,#1A7A6E 0%,#2A9D8F 50%,#1565C0 100%);
  --grad-text:linear-gradient(135deg,#5EEAD4,#7DD3FC);
  --glow-teal:0 14px 36px -8px rgba(26,122,110,.38);
}

/* ── DARK THEME ─────────────────────────────────────────────────── */
[data-theme="dark"] {
  --ink:#E7EDF4; --ink-2:#A9B9C9; --ink-3:#7488A0;
  --teal:#3DBDAE; --teal-light:#0F2E2C; --teal-mid:#52D6C6;
  --sky:#5CA8F2; --sky-light:#142A40;
  --bg:#0F1E30; --bg-warm:#142A40; --bg-card:#142A40;
  --border:#23405E; --border-2:#2E4F70;
  --red:#F08A7E; --red-bg:#3A1E1C;
  --green:#3DBDAE; --green-bg:#0F2E2C;
  --amber:#F2C572; --amber-bg:#3A2C12;
  --purple:#B79CF0; --purple-bg:#2A2148;
  --shadow-sm:0 1px 4px rgba(0,0,0,.25);
  --shadow-md:0 4px 20px rgba(0,0,0,.35);
  --shadow-lg:0 12px 48px rgba(0,0,0,.45);
}
[data-theme="dark"] .badge-pac { background:#1E3A5F; color:#93C5FD; }
[data-theme="dark"] .badge-psi { background:#0F3D2E; color:#6EE7B7; }
[data-theme="dark"] .badge-sup { background:#2A2148; color:#C4B5FD; }
[data-theme="dark"] .badge-pen { background:#3A2C12; color:#FCD34D; }
[data-theme="dark"] .st-confirmado { background:#0F3D2E; color:#6EE7B7; }
[data-theme="dark"] .st-pendente   { background:#3A2C12; color:#FCD34D; }
[data-theme="dark"] .st-cancelado  { background:#3A1E1C; color:#FCA5A5; }
[data-theme="dark"] .st-concluido  { background:#2A2148; color:#C4B5FD; }
[data-theme="dark"] .st-inativo    { background:#1F2937; color:#9CA3AF; }
[data-theme="dark"] .st-ativo      { background:#0F3D2E; color:#6EE7B7; }
[data-theme="dark"] .st-aguardando { background:#3A2C12; color:#FCD34D; }
[data-theme="dark"] .lgpd { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.1); }
[data-theme="dark"] .modal-x { background:var(--bg-warm); }
[data-theme="dark"] .skel { background:linear-gradient(90deg, var(--border) 25%, #1B3650 50%, var(--border) 75%); background-size:200% 100%; }

html { scroll-behavior:smooth; -webkit-font-smoothing:antialiased; }
body { font-family:var(--font-body); color:var(--ink); background:var(--chrome); font-size:16px; line-height:1.6; min-height:100vh; }
body, .sec, .panel, .kpi, .user-card, .msg-card, .fb-card, .svc-card, .search-box, .dash-main, .modal, table td, table th { transition:background-color .3s ease, color .3s ease, border-color .3s ease; }
.page-wrap { max-width:1160px; margin:0 auto; box-shadow:0 0 80px rgba(0,0,0,.35); overflow:hidden; }
.sec { padding:5rem 2.5rem; background:var(--bg); margin:0; }
.sec-alt { background-color:var(--bg-warm); background-image:radial-gradient(circle at 1px 1px, rgba(11,45,78,.07) 1px, transparent 0); background-size:26px 26px; }
[data-theme="dark"] .sec-alt { background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,.06) 1px, transparent 0); }

/* ── EFFECTS / MOTION UTILITIES ─────────────────────────────────── */
::selection { background:var(--teal); color:#fff; }
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline:2px solid var(--teal); outline-offset:2px; border-radius:4px; }
.grad-text { background:var(--grad-text); -webkit-background-clip:text; background-clip:text; color:transparent; }
@keyframes revealUp { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes modalPop { from { opacity:0; transform:scale(.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
@keyframes floatBlob { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(-26px,26px) scale(1.07); } }
@keyframes pulseRing { 0% { box-shadow:0 0 0 0 rgba(220,38,38,.35); } 70% { box-shadow:0 0 0 14px rgba(220,38,38,0); } 100% { box-shadow:0 0 0 0 rgba(220,38,38,0); } }
@supports (animation-timeline: view()) {
  .reveal { animation: revealUp linear both; animation-timeline: view(); animation-range: entry 0% cover 28%; }
}

/* ── NAV ─────────────────────────────────────────────────────── */
.nav { background:var(--chrome); position:sticky; top:0; z-index:300; height:var(--nav-h); padding:0 1.5rem; display:flex; align-items:center; justify-content:space-between; border-bottom:none; transition:box-shadow .25s ease, background-color .25s ease; }
.nav.scrolled { box-shadow:0 6px 24px rgba(0,0,0,.28); }
.nav-logo { display:flex; align-items:center; gap:10px; cursor:pointer; text-decoration:none; }
.nav-logo-img { width:38px; height:38px; border-radius:10px; object-fit:cover; }
.nav-logo-text { display:flex; flex-direction:column; line-height:1; }
.nav-logo-text strong { font-family:var(--font-head); font-size:15px; font-weight:800; color:#fff; letter-spacing:.3px; }
.nav-logo-text span { font-size:10px; color:rgba(255,255,255,.5); letter-spacing:.5px; text-transform:uppercase; margin-top:2px; }
.nav-links { display:flex; gap:.25rem; list-style:none; align-items:center; }
.nav-link { color:rgba(255,255,255,.65); text-decoration:none; font-size:13.5px; font-weight:500; padding:6px 12px; border-radius:var(--r-xs); transition:all .18s; background:none; border:none; cursor:pointer; font-family:var(--font-body); }
.nav-link:hover { color:#fff; background:rgba(255,255,255,.07); }
.nav-cta { background:var(--teal); color:#fff !important; padding:8px 18px !important; border-radius:var(--r-sm) !important; font-weight:600 !important; font-size:13.5px !important; margin-left:8px; position:relative; overflow:hidden; }
.theme-toggle { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); color:#fff; width:36px; height:36px; border-radius:50%; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .18s; flex-shrink:0; }
.theme-toggle:hover { background:rgba(255,255,255,.16); }
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
.mobile-drawer { position:fixed; top:var(--nav-h); left:0; right:0; background:var(--chrome); z-index:250; padding:1rem 1.5rem 1.5rem; display:flex; flex-direction:column; gap:4px; transform:translateY(-110%); transition:transform .28s cubic-bezier(.4,0,.2,1); border-bottom:2px solid var(--teal); }
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
.hero {
  background-color:var(--chrome);
  background-image:
    linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
  background-size:42px 42px;
  padding:4.5rem 2.5rem 3.75rem; display:grid; grid-template-columns:1fr 400px; gap:3rem; align-items:center; position:relative; overflow:hidden; isolation:isolate;
}
.hero::before { content:''; position:absolute; top:-100px; right:-90px; width:520px; height:520px; background:radial-gradient(circle,rgba(26,122,110,.30) 0%,transparent 70%); filter:blur(6px); pointer-events:none; z-index:0; animation:floatBlob 13s ease-in-out infinite; }
.hero::after { content:''; position:absolute; bottom:-130px; left:-90px; width:380px; height:380px; background:radial-gradient(circle,rgba(21,101,192,.26) 0%,transparent 70%); filter:blur(6px); pointer-events:none; z-index:0; animation:floatBlob 16s ease-in-out infinite reverse; }
.hero > div { position:relative; z-index:1; }
.hero-eyebrow { display:inline-flex; align-items:center; gap:7px; background:rgba(26,122,110,.18); border:1px solid rgba(26,122,110,.35); color:#5EEAD4; border-radius:100px; font-size:12px; font-weight:600; letter-spacing:.5px; padding:5px 14px; text-transform:uppercase; margin-bottom:1.5rem; }
.hero h1 { font-family:var(--font-head); font-size:42px; font-weight:800; color:#fff; line-height:1.16; margin-bottom:1rem; max-width:560px; letter-spacing:-.6px; }
.hero h1 em { font-style:normal; background:var(--grad-text); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hero-sub { color:rgba(255,255,255,.62); font-size:15px; line-height:1.65; max-width:440px; margin-bottom:1.75rem; }
.hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.hero-panel { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:2rem; backdrop-filter:blur(8px); }
.hero-panel-title { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,.4); margin-bottom:1.25rem; }
.hero-feat { display:flex; align-items:flex-start; gap:12px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,.07); }
.hero-feat:last-child { border-bottom:none; padding-bottom:0; }
.hero-feat-icon { width:40px; height:40px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:18px; color:#fff; }
.feat-teal { background:rgba(26,122,110,.25); } .feat-sky { background:rgba(21,101,192,.25); } .feat-amber { background:rgba(180,83,9,.2); }
.hero-feat-text strong { display:block; font-size:14px; font-weight:600; color:#fff; margin-bottom:2px; }
.hero-feat-text span { font-size:12.5px; color:rgba(255,255,255,.5); line-height:1.4; }

/* ── STRIP ───────────────────────────────────────────────────── */
.strip { background:var(--grad-brand); padding:1.25rem 2.5rem; display:flex; justify-content:space-evenly; flex-wrap:wrap; gap:1rem; }
.strip-item { text-align:center; color:#fff; transition:transform .25s ease; }
.strip-item:hover { transform:translateY(-3px); }
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
.svc-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r); padding:1.75rem; transition:box-shadow .25s,transform .25s,border-color .25s; position:relative; overflow:hidden; display:flex; flex-direction:column; }
.svc-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--grad-brand); transform:scaleX(0); transform-origin:left; transition:transform .3s; }
.svc-card:hover { box-shadow:var(--glow-teal); transform:translateY(-6px); border-color:var(--teal-light); }
.svc-card:hover::after { transform:scaleX(1); }
.svc-icon { width:52px; height:52px; border-radius:var(--r-sm); overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:24px; color:var(--teal); margin-bottom:1.1rem; background:linear-gradient(135deg,var(--teal-light),rgba(255,255,255,0)); box-shadow:inset 0 0 0 1px rgba(26,122,110,.14); transition:transform .3s ease, box-shadow .3s ease; }
.svc-card:hover .svc-icon { transform:scale(1.08) rotate(-4deg); box-shadow:inset 0 0 0 1px rgba(26,122,110,.14), 0 6px 18px rgba(26,122,110,.32); }
.svc-card h3 { font-family:var(--font-head); font-size:14.5px; font-weight:700; margin-bottom:7px; color:var(--teal); }
.svc-card p { font-size:13px; color:var(--ink-2); line-height:1.6; }

/* ── ABOUT ───────────────────────────────────────────────────── */
.about-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:start; }
.about-body p { font-size:15px; color:var(--ink-2); line-height:1.8; margin-bottom:1.1rem; }
.about-check { list-style:none; margin-top:1.5rem; display:flex; flex-direction:column; gap:8px; }
.about-check li { display:flex; align-items:center; gap:10px; font-size:14px; color:var(--ink-2); padding:10px 14px; background:var(--bg); border:1px solid var(--border); border-radius:var(--r-sm); }
.check-mark { width:20px; height:20px; border-radius:50%; background:var(--teal-light); color:var(--teal); display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; }
.pillar { background:var(--bg); border:1px solid var(--border); border-radius:var(--r); padding:1.5rem; margin-bottom:14px; display:flex; gap:14px; align-items:flex-start; transition:box-shadow .22s, transform .22s; }
.pillar:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
.pillar-icon { font-size:24px; flex-shrink:0; margin-top:2px; color:var(--teal); display:flex; }
.pillar h4 { font-family:var(--font-head); font-size:14.5px; font-weight:700; color:var(--ink); margin-bottom:5px; }
.pillar p { font-size:13px; color:var(--ink-2); line-height:1.6; }

/* ── RECURSOS ────────────────────────────────────────────────── */
.rec-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; }
.rec-card { border-radius:var(--r); overflow:hidden; border:1px solid var(--border); background:var(--bg-card); transition:box-shadow .25s, transform .25s; }
.rec-card:hover { box-shadow:var(--shadow-lg); transform:translateY(-5px); }
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
.crisis-icon { font-size:28px; color:#fff; flex-shrink:0; margin-top:2px; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.08); animation:pulseRing 2.4s ease-out infinite; }
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
.faq-a-wrap { display:grid; grid-template-rows:0fr; overflow:hidden; transition:grid-template-rows .32s ease; }
.faq-a-wrap.open { grid-template-rows:1fr; }
.faq-a-wrap > div { overflow:hidden; min-height:0; }
.faq-a { font-size:14px; color:var(--ink-2); line-height:1.75; padding-bottom:1.1rem; }

/* ── CONTACT ─────────────────────────────────────────────────── */
.contact-grid { display:grid; grid-template-columns:1fr 1.3fr; gap:4rem; align-items:start; }
.cinfo-row { display:flex; align-items:flex-start; gap:13px; margin-bottom:1.25rem; }
.cinfo-ic { width:40px; height:40px; border-radius:var(--r-sm); background:var(--teal-light); color:var(--teal); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
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
.form-btn { width:100%; background:var(--chrome); color:#fff; border:none; padding:13px; border-radius:var(--r-sm); font-size:15px; font-weight:700; cursor:pointer; transition:background .18s; margin-top:4px; font-family:var(--font-head); position:relative; overflow:hidden; }
.form-btn:hover { background:var(--teal); }
.form-btn:disabled { opacity:.6; cursor:not-allowed; }

/* ── FOOTER ──────────────────────────────────────────────────── */
footer { background:#07203A; color:rgba(255,255,255,.65); padding:3.5rem 2.5rem 1.75rem; position:relative; }
footer::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--grad-brand); }
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
.overlay { position:fixed; inset:0; background:rgba(7,32,58,.65); backdrop-filter:blur(4px); z-index:400; display:flex; align-items:center; justify-content:center; padding:1rem; animation:fadeIn .2s ease; }
.modal { background:var(--bg); border-radius:20px; padding:2.25rem; width:100%; max-width:430px; box-shadow:var(--shadow-lg); position:relative; max-height:92vh; overflow-y:auto; animation:modalPop .3s cubic-bezier(.16,1,.3,1); }
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

/* ── SEARCH BOX ─────────────────────────────────────────────────── */
.search-box { display:flex; align-items:center; gap:8px; background:var(--bg); border:1.5px solid var(--border); border-radius:var(--r-sm); padding:9px 14px; margin-bottom:1.25rem; transition:border-color .18s; }
.search-box:focus-within { border-color:var(--teal); box-shadow:0 0 0 3px rgba(26,122,110,.12); }
.search-box-icon { font-size:14px; opacity:.5; flex-shrink:0; }
.search-box input { flex:1; border:none; outline:none; font-size:14px; color:var(--ink); background:transparent; font-family:var(--font-body); }
.search-box-clear { background:var(--bg-warm); border:none; border-radius:50%; width:20px; height:20px; font-size:11px; cursor:pointer; color:var(--ink-3); flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.search-box-clear:hover { background:var(--border); }

/* ── PASSWORD INPUT ─────────────────────────────────────────────── */
.pwd-wrap { position:relative; display:flex; align-items:center; }
.pwd-wrap input { width:100%; padding:10px 42px 10px 13px; border:1.5px solid var(--border); border-radius:var(--r-sm); font-size:16px; color:var(--ink); background:var(--bg); outline:none; transition:border-color .18s,box-shadow .18s; font-family:var(--font-body); }
.pwd-wrap input:focus { border-color:var(--teal); box-shadow:0 0 0 3px rgba(26,122,110,.12); }
.pwd-toggle { position:absolute; right:8px; background:none; border:none; font-size:16px; cursor:pointer; padding:4px; line-height:1; opacity:.6; transition:opacity .15s; }
.pwd-toggle:hover { opacity:1; }

/* ── TAB FADE TRANSITION ────────────────────────────────────────── */
@keyframes tabFade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.tab-fade { animation:tabFade .22s ease; }

/* ── FILTER CHIPS ───────────────────────────────────────────────── */
.filter-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:1.25rem; }
.filter-chip { padding:7px 16px; border-radius:100px; border:1.5px solid var(--border); background:var(--bg); font-size:12.5px; font-weight:600; color:var(--ink-2); cursor:pointer; transition:all .15s; font-family:var(--font-body); }
.filter-chip:hover { border-color:var(--teal); color:var(--teal); }
.filter-chip.active { background:var(--chrome); color:#fff; border-color:var(--chrome); }

/* ── OBSERVAÇÕES BOX ────────────────────────────────────────────── */
.obs-box { background:var(--bg-warm); border-left:3px solid var(--teal); border-radius:var(--r-sm); padding:.85rem 1rem; margin-top:8px; font-size:13px; color:var(--ink-2); line-height:1.6; }
.obs-box strong { color:var(--ink); display:block; font-size:12px; text-transform:uppercase; letter-spacing:.3px; margin-bottom:4px; }

/* ── CHARTS GRID ────────────────────────────────────────────────── */
.charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
@media(max-width:760px){ .charts-grid{ grid-template-columns:1fr; } }

/* ── LOAD MORE ──────────────────────────────────────────────────── */
.load-more-btn { width:100%; padding:10px; margin-top:10px; background:var(--bg-warm); border:1px dashed var(--border-2); border-radius:var(--r-sm); color:var(--ink-2); font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; font-family:var(--font-body); }
.load-more-btn:hover { background:var(--teal-light); color:var(--teal); border-color:var(--teal); }


/* ── SIDEBAR NOTIFICATION DOTS ─────────────────────────────────── */
.sb-item-badge { background:#EF4444; color:#fff; font-size:10px; font-weight:700; border-radius:100px; padding:1px 6px; margin-left:auto; min-width:18px; text-align:center; line-height:1.4; }
.bot-nav-item-badge { position:absolute; top:2px; right:10px; background:#EF4444; color:#fff; font-size:9px; font-weight:700; border-radius:100px; padding:0 4px; min-width:14px; line-height:1.3; text-align:center; }


/* ── TOAST ───────────────────────────────────────────────────── */
.toast { position:fixed; bottom:24px; right:16px; z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
.toast-item { padding:12px 18px; border-radius:var(--r-sm); font-size:13.5px; font-weight:600; box-shadow:var(--shadow-lg); animation:slideIn .25s ease; pointer-events:auto; display:flex; align-items:center; gap:10px; min-width:260px; max-width:calc(100vw - 32px); }
.toast-icon { flex-shrink:0; display:flex; }
.toast-close { background:rgba(255,255,255,.15); border:none; color:#fff; width:20px; height:20px; border-radius:50%; font-size:11px; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.toast-close:hover { background:rgba(255,255,255,.3); }
.toast-ok { background:#065F46; color:#fff; }
.toast-err { background:#991B1B; color:#fff; }
.toast-info { background:var(--chrome); color:#fff; }
@keyframes slideIn { from { transform:translateX(40px); opacity:0; } to { transform:translateX(0); opacity:1; } }

/* ── DASHBOARD SHELL ─────────────────────────────────────────── */
.dash { display:flex; min-height:calc(100vh - var(--nav-h)); }
.sidebar { width:252px; flex-shrink:0; background:var(--chrome); display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,.06); }
.sb-user { padding:1.5rem 1.25rem 1.25rem; border-bottom:1px solid rgba(255,255,255,.07); display:flex; flex-direction:column; align-items:center; text-align:center; }
.sb-avatar-wrap { position:relative; margin-bottom:10px; }
.sb-avatar { width:60px; height:60px; border-radius:14px; background:var(--teal); color:#fff; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; font-family:var(--font-head); overflow:hidden; }
.sb-avatar img { width:100%; height:100%; object-fit:cover; }
.sb-avatar-edit { position:absolute; bottom:-4px; right:-4px; width:22px; height:22px; border-radius:50%; background:var(--teal); color:#fff; border:2px solid var(--chrome); display:flex; align-items:center; justify-content:center; font-size:11px; cursor:pointer; transition:background .15s; }
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
.bot-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--chrome); border-top:1px solid rgba(255,255,255,.1); z-index:200; height:var(--bot-nav-h); padding:0 4px; }
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
.cd-selected { background:var(--chrome); color:#fff; font-weight:700; }
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
.btn { display:inline-flex; align-items:center; gap:7px; padding:12px 26px; border-radius:var(--r-sm); font-size:14.5px; font-weight:600; cursor:pointer; border:none; transition:all .18s; font-family:var(--font-body); text-decoration:none; line-height:1; white-space:nowrap; position:relative; overflow:hidden; }
.btn:disabled { opacity:.55; cursor:not-allowed; }
.btn-teal { background:var(--teal); color:#fff; }
.btn-teal:hover { background:var(--teal-mid); transform:translateY(-1px); box-shadow:0 4px 14px rgba(26,122,110,.4); }
.btn-teal::before, .nav-cta::before, .form-btn::before { content:''; position:absolute; top:0; left:-60%; width:45%; height:100%; background:linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent); transform:skewX(-20deg); transition:left .55s ease; pointer-events:none; }
.btn-teal:hover::before, .nav-cta:hover::before, .form-btn:hover::before { left:130%; }
.btn-ghost { background:rgba(255,255,255,.08); color:rgba(255,255,255,.85); border:1px solid rgba(255,255,255,.18); }
.btn-ghost:hover { background:rgba(255,255,255,.14); }
.btn-outline { background:transparent; color:var(--ink); border:1.5px solid var(--border-2); }
.btn-outline:hover { background:var(--bg-warm); }
.btn-danger { background:var(--red-bg); color:var(--red); border:1px solid #F5C6C2; }
.btn-danger:hover { background:#FADBD8; }
.btn-success { background:var(--green-bg); color:var(--green); border:1px solid #A7D7D2; }
.btn-success:hover { background:#C5EBE8; }
.btn-sm { padding:7px 14px; font-size:12.5px; border-radius:var(--r-xs); }
.btn-xs { padding:3px 8px; font-size:11px; border-radius:var(--r-xs); border:1px solid var(--border); background:var(--bg); color:var(--ink-2); cursor:pointer; font-family:var(--font-body); }
.btn-xs:hover { border-color:var(--teal); color:var(--teal); }

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
/** Exporta um array de objetos para CSV e dispara o download */
function exportarCSV(filename, headers, rows) {
  const escape = (v) => {
    const s = (v === null || v === undefined) ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.map(h => escape(h.label)).join(";"),
    ...rows.map(r => headers.map(h => escape(typeof h.value === "function" ? h.value(r) : r[h.value])).join(";")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function Spin() { return <span className="spin"/>; }

// ─── TEMA (claro/escuro) ──────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("fumec-theme") || "light"; } catch { return "light"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("fumec-theme", theme); } catch {}
  }, [theme]);
  return [theme, setTheme];
}
function ThemeToggle({ theme, setTheme, className = "" }) {
  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
      aria-label="Alternar tema"
    >
      {theme === "dark" ? <Sun size={16}/> : <Moon size={16}/>}
    </button>
  );
}

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
function EmptyState({ icon = <Inbox size={34}/>, title, subtitle, ctaLabel, onCta }) {
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

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
/**
 * Modal de confirmação para ações destrutivas/importantes.
 * Uso: <ConfirmModal config={confirmState} onClose={() => setConfirmState(null)} />
 * config = { title, message, confirmLabel, danger, onConfirm, extra? }
 */
function ConfirmModal({ config, onClose }) {
  const [busy, setBusy] = useState(false);
  if (!config) return null;
  const { title, message, confirmLabel = "Confirmar", danger = false, onConfirm, extra } = config;

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      onClose();
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:420}} onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}><X size={16}/></button>
        <div style={{marginBottom:10,color:danger?"var(--red)":"var(--teal)"}}>{danger ? <AlertTriangle size={34}/> : <HelpCircle size={34}/>}</div>
        <h3 style={{fontFamily:"var(--font-head)",fontSize:18,fontWeight:800,color:"var(--ink)",marginBottom:8}}>{title}</h3>
        <p style={{fontSize:14,color:"var(--ink-2)",lineHeight:1.6,marginBottom:extra?12:20}}>{message}</p>
        {extra}
        <div style={{display:"flex",gap:10,marginTop:extra?16:0}}>
          <button className="btn btn-outline" style={{flex:1}} onClick={onClose} disabled={busy}>Cancelar</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-teal"}`} style={{flex:1}} onClick={handleConfirm} disabled={busy}>
            {busy ? <Spin/> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SEARCH BOX ───────────────────────────────────────────────────────────────
function SearchBox({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="search-box">
      <span className="search-box-icon"><Search size={15}/></span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {value && <button className="search-box-clear" onClick={() => onChange("")}><X size={11}/></button>}
    </div>
  );
}

// ─── PASSWORD INPUT (com toggle mostrar/ocultar) ──────────────────────────────
function PasswordInput({ value, onChange, placeholder = "••••••", onKeyDown }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pwd-wrap">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
      <button type="button" className="pwd-toggle" onClick={() => setShow(s => !s)} tabIndex={-1}>
        {show ? <EyeOff size={16}/> : <Eye size={16}/>}
      </button>
    </div>
  );
}

// ─── EMAIL EDIT FIELD ─────────────────────────────────────────────────────────
/** Campo de e-mail com edição inline. Atualiza auth.users (envia confirmação) e profiles.email. */
function EmailEditField({ uid, currentEmail, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentEmail || "");
  const [busy, setBusy] = useState(false);

  async function salvar() {
    if (!value || value === currentEmail) { setEditing(false); return; }
    setBusy(true);
    const { error: authErr } = await supabase.auth.updateUser({ email: value });
    if (authErr) { toast(`Erro ao atualizar e-mail: ${authErr.message}`, "err"); setBusy(false); return; }
    const { error: profErr } = await supabase.from("profiles").update({ email: value }).eq("id", uid);
    setBusy(false);
    if (profErr) { toast(`E-mail de confirmação enviado, mas houve erro ao atualizar o perfil: ${profErr.message}`, "err"); }
    onUpdated(value);
    setEditing(false);
    toast("Enviamos um e-mail de confirmação para o novo endereço. Verifique sua caixa de entrada para concluir a troca.");
  }

  if (!editing) {
    return (
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:13.5,color:"var(--ink-2)"}}>{currentEmail || "—"}</span>
        <button className="btn btn-sm btn-outline" onClick={() => { setValue(currentEmail||""); setEditing(true); }}><Pencil size={13}/> Editar e-mail</button>
      </div>
    );
  }
  return (
    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
      <input type="email" value={value} onChange={e=>setValue(e.target.value)} style={{flex:"1 1 220px",padding:"8px 12px",border:"1.5px solid var(--border)",borderRadius:"var(--r-sm)",fontSize:14,fontFamily:"var(--font-body)",background:"var(--bg)",color:"var(--ink)"}} />
      <button className="btn btn-sm btn-teal" onClick={salvar} disabled={busy}>{busy ? <Spin/> : "Salvar"}</button>
      <button className="btn btn-sm btn-outline" onClick={() => setEditing(false)} disabled={busy}>Cancelar</button>
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
  const id = Date.now() + Math.random();
  _setToasts(p => [...p, { id, msg, type }]);
  const duration = type === "err" ? 6500 : 3500;
  setTimeout(() => _setToasts(p => p.filter(t => t.id !== id)), duration);
}
const TOAST_ICONS = { ok: <CheckCircle2 size={18}/>, err: <AlertTriangle size={18}/>, info: <Hourglass size={18}/> };
function Toasts() {
  const toasts = useToastSetup();
  return (
    <div className="toast">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          <span className="toast-icon">{TOAST_ICONS[t.type] || TOAST_ICONS.ok}</span>
          <span style={{flex:1}}>{t.msg}</span>
          <button className="toast-close" onClick={() => _setToasts(p => p.filter(x => x.id !== t.id))}><X size={14}/></button>
        </div>
      ))}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]     = useTheme();
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lEmail, setLE] = useState(""); const [lPass, setLP] = useState("");
  const [rName, setRN]  = useState(""); const [rEmail, setRE] = useState("");
  const [rPass, setRP]  = useState(""); const [rMat, setRM]   = useState("");
  const [rCrp, setRC]   = useState("");

  // Recuperação de senha
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent]   = useState(false);
  const [resetBusy, setResetBusy]   = useState(false);
  const [newPass1, setNewPass1]     = useState("");
  const [newPass2, setNewPass2]     = useState("");
  const [resetErr, setResetErr]     = useState("");

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
      if (ev === "PASSWORD_RECOVERY") { setPage("reset-password"); }
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
    toast("Bem-vindo(a)!");
  }

  async function enviarRecuperacao() {
    setResetErr("");
    if (!resetEmail) { setResetErr("Informe seu e-mail."); return; }
    setResetBusy(true);
    const redirectTo = window.location.href.split("#")[0].split("?")[0];
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo });
    setResetBusy(false);
    if (error) { setResetErr(error.message); return; }
    setResetSent(true);
  }

  async function salvarNovaSenha() {
    setResetErr("");
    if (newPass1.length < 6) { setResetErr("A senha deve ter pelo menos 6 caracteres."); return; }
    if (newPass1 !== newPass2) { setResetErr("As senhas não coincidem."); return; }
    setResetBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPass1 });
    setResetBusy(false);
    if (error) { setResetErr(error.message); return; }
    toast("Senha atualizada com sucesso! Faça login novamente.");
    await supabase.auth.signOut();
    setNewPass1(""); setNewPass2("");
    setPage("home");
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
      toast("Conta criada com sucesso!");
    } else if (role === "psicologo") {
      toast("Conta criada! Aguardando aprovação de um supervisor para liberar seus atendimentos.", "info");
    } else {
      toast("Conta criada! Aguardando aprovação de um supervisor já cadastrado.", "info");
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
      if (error.code === "42P01") toast("Execute a migration SQL para habilitar o Fale Conosco.", "err");
      else toast("Erro ao enviar. Tente novamente.", "err");
      return;
    }
    setCNome(""); setCMat(""); setCEmail(""); setCAssunto(""); setCMsg("");
    toast("Mensagem enviada! Retornaremos em breve.");
  }

  if (page === "reset-password") {
    return (
      <div className="page-wrap">
        <style>{CSS}</style>
        <Toasts/>
        <nav className="nav">
          <a className="nav-logo"><Logo size={34} light/><div className="nav-logo-text"><strong>FUMEC</strong><span>Clínica Escola · Psicologia</span></div></a>
          <ul className="nav-links"><li><ThemeToggle theme={theme} setTheme={setTheme}/></li></ul>
        </nav>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - var(--nav-h))",padding:"1.25rem",background:"var(--bg-warm)"}}>
          <div style={{textAlign:"center",maxWidth:420,width:"100%",background:"var(--bg)",borderRadius:"var(--r)",padding:"2.5rem 1.5rem",boxShadow:"var(--shadow-md)"}}>
            <div style={{marginBottom:"1rem",color:"var(--teal)",display:"flex",justifyContent:"center"}}><KeyRound size={44}/></div>
            <h2 style={{fontFamily:"var(--font-head)",fontSize:20,marginBottom:6,color:"var(--ink)"}}>Defina sua nova senha</h2>
            <p style={{fontSize:13,color:"var(--ink-2)",marginBottom:"1.5rem"}}>Escolha uma nova senha para sua conta.</p>
            <div className="fg" style={{textAlign:"left"}}>
              <label>Nova senha</label>
              <PasswordInput value={newPass1} onChange={e=>setNewPass1(e.target.value)} />
            </div>
            <div className="fg" style={{textAlign:"left"}}>
              <label>Confirmar nova senha</label>
              <PasswordInput value={newPass2} onChange={e=>setNewPass2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&salvarNovaSenha()} />
            </div>
            {resetErr && <div className="msg-err"><AlertTriangle size={13} style={{verticalAlign:"-2px"}}/> {resetErr}</div>}
            <button className="form-btn" style={{marginTop:8}} onClick={salvarNovaSenha} disabled={resetBusy}>
              {resetBusy ? <><Spin/> Salvando...</> : "Salvar nova senha"}
            </button>
          </div>
        </div>
      </div>
    );
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
            <ul className="nav-links">
              <li><ThemeToggle theme={theme} setTheme={setTheme}/></li>
              <li><button className="nav-link" onClick={logout}>Sair <ArrowRight size={13}/></button></li>
            </ul>
          </nav>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - var(--nav-h))",padding:"1.25rem",background:"var(--bg-warm)"}}>
            <div style={{textAlign:"center",maxWidth:480,width:"100%",background:"var(--bg)",borderRadius:"var(--r)",padding:"2.5rem 1.5rem",boxShadow:"var(--shadow-md)"}}>
              <div style={{marginBottom:"1rem",color:"var(--amber)",display:"flex",justifyContent:"center"}}><Hourglass size={50}/></div>
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
                <Mail size={13} style={{verticalAlign:"-2px"}}/> Logado como: <strong>{profile.email}</strong>
              </div>
              <button className="btn btn-outline" onClick={logout}>Sair da conta</button>
            </div>
          </div>
        </div>
      );
    }
    return <Dashboard user={user} profile={profile} onLogout={logout} onProfileUpdate={setProfile} theme={theme} setTheme={setTheme} />;
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
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a className="nav-logo">
          <Logo size={34} light/>
          <div className="nav-logo-text"><strong>FUMEC</strong><span>Clínica Escola · Psicologia</span></div>
        </a>
        <ul className="nav-links">
          {[["#inicio","Início"],["#sobre","Sobre"],["#servicos","Serviços"],["#faq","Dúvidas"],["#contato","Fale Conosco"]].map(([h,l]) => (
            <li key={l} className="hide-m"><a href={h} className="nav-link">{l}</a></li>
          ))}
          <li className="hide-m"><button className="nav-link nav-cta" onClick={() => setModal(true)}>Entrar / Cadastrar</button></li>
          <li><ThemeToggle theme={theme} setTheme={setTheme}/></li>
          <li>
            <div className={`hamburger ${menuOpen?"open":""}`} onClick={() => setMenuOpen(o=>!o)} aria-label="Menu">
              <span/><span/><span/>
            </div>
          </li>
        </ul>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${menuOpen?"open":""}`}>
        {[["#inicio",<Home size={16}/>,"Início"],["#sobre",<Info size={16}/>,"Sobre"],["#servicos",<Brain size={16}/>,"Serviços"],["#faq",<HelpCircle size={16}/>,"Dúvidas"],["#contato",<Mail size={16}/>,"Fale Conosco"]].map(([h,ic,l]) => (
          <a key={l} href={h} className="mob-link" onClick={() => setMenuOpen(false)}><span>{ic}</span>{l}</a>
        ))}
        <button className="mob-link mob-cta" onClick={() => { setModal(true); setMenuOpen(false); }}>Entrar / Cadastrar</button>
      </div>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div>
          <div className="hero-eyebrow"><Landmark size={13}/> Universidade FUMEC — Belo Horizonte</div>
          <h1>Cuidar da sua mente é parte da <em>sua formação</em></h1>
          <p className="hero-sub">A Clínica Escola de Psicologia oferece atendimento gratuito, ético e humanizado para estudantes que precisam de apoio emocional e psicológico.</p>
          <div className="hero-actions">
            <button className="btn btn-teal" onClick={() => setModal(true)}><Calendar size={16}/> Agendar consulta</button>
            <a href="#sobre" className="btn btn-ghost">Conheça a clínica <ArrowRight size={14}/></a>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-title">Por que escolher nossa clínica</div>
          {[
            ["feat-teal",<Heart size={18}/>,"Atendimento 100% gratuito","Para todos os estudantes matriculados na FUMEC."],
            ["feat-sky",<Lock size={18}/>,"Sigilo garantido por lei","Ética profissional conforme o Código de Ética do CFP."],
            ["feat-amber",<GraduationCap size={18}/>,"Supervisionado por especialistas","Estagiários orientados por psicólogos experientes."],
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
        {[[<GraduationCap size={18}/>,"100%","Gratuito para estudantes"],[<ShieldCheck size={18}/>,"LGPD","Dados protegidos por lei"],[<Scale size={18}/>,"CFP","Regido pelo Código de Ética"],[<MapPin size={18}/>,"BH","Belo Horizonte · MG"]].map(([ic,n,l]) => (
          <div className="strip-item" key={n}><div className="strip-num" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{ic} {n}</div><div className="strip-label">{l}</div></div>
        ))}
      </div>

      {/* SERVIÇOS */}
      <section className="sec" id="servicos">
        <div className="sec-head reveal">
          <div className="eyebrow">O que oferecemos</div>
          <h2 className="sec-title">Serviços disponíveis</h2>
          <p className="sec-sub">Recursos desenvolvidos para apoiar o estudante em todas as etapas da vida acadêmica e emocional.</p>
        </div>
        <div className="services-grid reveal">
          {[
            [<Brain size={24}/>,"Atendimento individual","Sessões de psicoterapia conduzidas por estagiários supervisionados."],
            [<Calendar size={24}/>,"Agendamento online","Marque sua consulta a qualquer hora diretamente pela plataforma."],
            [<Handshake size={24}/>,"Entrevista de acolhimento","Conversa inicial para entender sua necessidade e indicar o caminho certo."],
            [<Users size={24}/>,"Grupos e oficinas","Encontros em grupo sobre autoestima, gestão emocional e vida acadêmica."],
            [<BookOpen size={24}/>,"Conteúdos de apoio","Materiais sobre ansiedade, depressão e saúde mental estudantil."],
            [<Lock size={24}/>,"Sigilo total","Todas as informações tratadas com confidencialidade absoluta."],
            [<GraduationCap size={24}/>,"Formação supervisionada","Estagiários orientados por psicólogos com CRP ativo durante todo o atendimento."],
            [<MessageCircle size={24}/>,"Acompanhamento contínuo","Sessões regulares para evolução e suporte emocional ao longo da vida acadêmica."],
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
        <div className="sec-head reveal">
          <div className="eyebrow">Quem somos</div>
          <h2 className="sec-title">A Clínica Escola de Psicologia</h2>
        </div>
        <div className="about-grid">
          <div className="about-body reveal">
            <p>A Clínica Escola de Psicologia da Universidade FUMEC existe para cuidar das pessoas enquanto forma profissionais. Todos os atendimentos são conduzidos por estudantes avançados de Psicologia, com supervisão direta de professores experientes e registrados no CRP.</p>
            <p>Mais do que um serviço clínico, somos um espaço seguro de escuta, acolhimento e cuidado — onde cada sessão é levada a sério e cada pessoa é tratada com ética e respeito.</p>
            <ul className="about-check">
              {["Vinculada à Universidade FUMEC","Supervisionada por psicólogos CRP ativos","Segue integralmente o Código de Ética do CFP","Atendimento presencial em Belo Horizonte","Plataforma digital desenvolvida por alunos de SI"].map(i => (
                <li key={i}><div className="check-mark"><Check size={12}/></div>{i}</li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            {[[<Target size={22}/>,"Missão","Promover saúde mental e bem-estar para estudantes da FUMEC por meio de atendimento psicológico acessível, gratuito e eticamente orientado."],
              [<Eye size={22}/>,"Visão","Tornar-se referência em apoio psicológico universitário em Belo Horizonte, integrando tecnologia, cuidado humano e formação de qualidade."],
              [<Gem size={22}/>,"Valores","Ética, sigilo, acolhimento, responsabilidade, inclusão e respeito à diversidade de cada pessoa atendida."],
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
        <div className="sec-head reveal">
          <div className="eyebrow">Informação e apoio</div>
          <h2 className="sec-title">Recursos de saúde mental</h2>
          <p className="sec-sub">Conteúdos para você se informar, se reconhecer e dar o primeiro passo.</p>
        </div>
        <div className="rec-grid reveal">
          {[
            ["rh-teal","rd-teal",<AlertTriangle size={18}/>,"Ansiedade e Estresse","Como identificar e lidar",["O que é ansiedade?","Sinais de alerta","Técnicas de respiração","Quando buscar ajuda"]],
            ["rh-navy","rd-navy",<CloudRain size={18}/>,"Depressão","Informação e acolhimento",["Tristeza vs. depressão","Sintomas mais comuns","Como apoiar alguém","Tratamentos disponíveis"]],
            ["rh-plum","rd-plum",<BookOpen size={18}/>,"Vida Acadêmica","Saúde mental na faculdade",["Síndrome do impostor","Procrastinação e foco","Gestão do tempo","Equilíbrio estudo e vida"]],
          ].map(([hcls,dcls,ic,t,s,items]) => (
            <div className="rec-card" key={t}>
              <div className={`rec-head ${hcls}`}><h3 style={{display:"flex",alignItems:"center",gap:8}}>{ic} {t}</h3><p>{s}</p></div>
              <div className="rec-body"><ul>{items.map(i => <li key={i}><span className={`rec-dot ${dcls}`}></span>{i}</li>)}</ul></div>
            </div>
          ))}
        </div>
        <div className="crisis-box reveal">
          <div className="crisis-icon"><LifeBuoy size={22}/></div>
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
        <div className="sec-head reveal">
          <div className="eyebrow">Perguntas frequentes</div>
          <h2 className="sec-title">Dúvidas comuns</h2>
        </div>
        <div className="faq-wrap reveal">
          {FAQS.map(([q, a], i) => (
            <div className="faq-item" key={q}>
              <button className="faq-q" onClick={() => setFaq(faq === i ? null : i)}>
                {q}
                <span className={`faq-chevron ${faq===i?"open":""}`}>▾</span>
              </button>
              <div className={`faq-a-wrap ${faq===i?"open":""}`}><div><div className="faq-a">{a}</div></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* FALE CONOSCO */}
      <section className="sec" id="contato">
        <div className="sec-head reveal">
          <div className="eyebrow">Fale conosco</div>
          <h2 className="sec-title">Entre em contato</h2>
        </div>
        <div className="contact-grid reveal">
          <div>
            <h3 style={{fontFamily:"var(--font-head)",fontSize:18,fontWeight:700,marginBottom:"1.5rem",color:"var(--ink)"}}>Informações de contato</h3>
            {[[<MapPin size={18}/>,"Endereço","Universidade FUMEC — Belo Horizonte, MG"],[<Mail size={18}/>,"E-mail","clinicaescola@fumec.br"],[<Clock size={18}/>,"Horário de funcionamento","Segunda a sexta, das 8h às 18h"]].map(([ic,l,v]) => (
              <div className="cinfo-row" key={l}>
                <div className="cinfo-ic">{ic}</div>
                <div className="cinfo-ic-text"><strong>{l}</strong><span>{v}</span></div>
              </div>
            ))}
            <div className="warn-notice" style={{display:"flex",gap:8,alignItems:"flex-start"}}><AlertTriangle size={16} style={{flexShrink:0,marginTop:2}}/> <span><strong>Atenção:</strong> Esta não é uma linha de crise. Em situação de emergência, ligue <strong>188 (CVV)</strong> ou vá ao pronto-socorro mais próximo.</span></div>
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
            <span className="lgpd" style={{display:"inline-flex",alignItems:"center",gap:4}}><Lock size={11}/> LGPD Conforme</span>
            <a href="#" style={{color:"rgba(255,255,255,.4)",fontSize:12}}>Política de privacidade</a>
          </div>
        </div>
      </footer>

      {/* MODAL LOGIN/CADASTRO */}
      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setModal(false)}><X size={16}/></button>
            <div className="modal-logo">
              <Logo size={38}/>
              <div className="modal-logo-text"><strong>FUMEC</strong><span>Clínica Escola de Psicologia</span></div>
            </div>
            {forgotMode ? (
              <>
                <h3 style={{fontFamily:"var(--font-head)",fontSize:17,fontWeight:800,color:"var(--ink)",marginBottom:6,textAlign:"center"}}>
                  {resetSent ? "Verifique seu e-mail" : "Recuperar senha"}
                </h3>
                {resetSent ? (
                  <div className="al al-ok" style={{textAlign:"center",lineHeight:1.6}}>
                    <Mail size={14} style={{verticalAlign:"-2px"}}/> Enviamos um link de recuperação para <strong>{resetEmail}</strong>. Abra seu e-mail e siga as instruções para definir uma nova senha.
                  </div>
                ) : (
                  <>
                    <p style={{fontSize:13,color:"var(--ink-2)",marginBottom:"1rem",textAlign:"center"}}>
                      Digite seu e-mail cadastrado. Enviaremos um link para você redefinir sua senha.
                    </p>
                    <div className="fg">
                      <label>E-mail</label>
                      <input type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="seu@email.com" onKeyDown={e=>e.key==="Enter"&&enviarRecuperacao()}/>
                    </div>
                    {resetErr && <div className="msg-err"><AlertTriangle size={13} style={{verticalAlign:"-2px"}}/> {resetErr}</div>}
                    <button className="form-btn" onClick={enviarRecuperacao} disabled={resetBusy}>
                      {resetBusy ? <><Spin/> Enviando...</> : "Enviar link de recuperação"}
                    </button>
                  </>
                )}
                <button
                  className="btn btn-outline"
                  style={{width:"100%",marginTop:12}}
                  onClick={() => { setForgotMode(false); setResetSent(false); setResetErr(""); setResetEmail(""); }}
                >
                  <ArrowLeft size={14} style={{verticalAlign:"-2px"}}/> Voltar ao login
                </button>
              </>
            ) : (
            <>
            <div className="modal-tabs">
              <button className={`modal-tab ${tab==="login"?"active":""}`} onClick={() => {setTab("login");setErr("");}}>Entrar na conta</button>
              <button className={`modal-tab ${tab==="reg"?"active":""}`}   onClick={() => {setTab("reg");setErr("");}}>Criar conta</button>
            </div>
            {tab === "login" ? (
              <>
                <div className="fg"><label>E-mail</label><input type="email" value={lEmail} onChange={e=>setLE(e.target.value)} placeholder="seu@email.com"/></div>
                <div className="fg"><label>Senha</label><PasswordInput value={lPass} onChange={e=>setLP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
                {err && <div className="msg-err"><AlertTriangle size={13} style={{verticalAlign:"-2px"}}/> {err}</div>}
                <button className="form-btn" onClick={doLogin} disabled={busy}>{busy?<><Spin/> Entrando...</>:"Entrar"}</button>
                <button
                  className="nav-link"
                  style={{display:"block",margin:"12px auto 0",color:"var(--teal)",fontSize:12.5,fontWeight:600,background:"none"}}
                  onClick={() => { setForgotMode(true); setResetEmail(lEmail); }}
                >
                  Esqueci minha senha
                </button>
              </>
            ) : (
              <>
                <p style={{fontSize:13,color:"var(--ink-2)",marginBottom:"1rem"}}>Selecione o tipo de conta:</p>
                <div className="role-grid">
                  {[["paciente",<User size={22}/>,"Paciente"],["psicologo",<Stethoscope size={22}/>,"Psicólogo"],["supervisor",<UserCog size={22}/>,"Supervisor"]].map(([v,ic,l]) => (
                    <button key={v} className={`role-btn ${role===v?"active":""}`} onClick={() => setRole(v)}>
                      <span className="ri">{ic}</span>{l}
                    </button>
                  ))}
                </div>
                {role === "supervisor" && (
                  <div className="al al-warn" style={{marginBottom:"1rem"}}>
                    <AlertTriangle size={14} style={{verticalAlign:"-2px"}}/> Contas de supervisor precisam ser aprovadas por outro supervisor já cadastrado antes do primeiro acesso.
                  </div>
                )}
                <div className="fg"><label>Nome completo *</label><input value={rName} onChange={e=>setRN(e.target.value)} placeholder="Seu nome"/></div>
                <div className="fg"><label>E-mail *</label><input type="email" value={rEmail} onChange={e=>setRE(e.target.value)} placeholder="seu@fumec.edu.br"/></div>
                {role==="paciente"  && <div className="fg"><label>Matrícula FUMEC</label><input value={rMat} onChange={e=>setRM(e.target.value)} placeholder="20240001"/></div>}
                {role!=="paciente"  && <div className="fg"><label>CRP</label><input value={rCrp} onChange={e=>setRC(e.target.value)} placeholder="04/12345"/></div>}
                <div className="fg"><label>Senha * (mín. 6 caracteres)</label><PasswordInput value={rPass} onChange={e=>setRP(e.target.value)}/></div>
                {err && <div className="msg-err"><AlertTriangle size={13} style={{verticalAlign:"-2px"}}/> {err}</div>}
                <button className="form-btn" onClick={doRegister} disabled={busy}>{busy?<><Spin/> Criando conta...</>:"Criar minha conta"}</button>
              </>
            )}
            </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD SHELL ─────────────────────────────────────────────────────────
function Dashboard({ user, profile, onLogout, onProfileUpdate, theme, setTheme }) {
  const [aba, setAba] = useState("inicio");
  const tabFadeRef = useRef();
  useEffect(() => {
    const el = tabFadeRef.current;
    if (!el) return;
    el.classList.remove("tab-fade");
    void el.offsetWidth; // força reflow para reiniciar a animação CSS
    el.classList.add("tab-fade");
  }, [aba]);
  const MENUS = {
    paciente:   [{id:"inicio",ic:<Home size={16}/>,l:"Início"},{id:"perfil",ic:<User size={16}/>,l:"Meu Perfil"},{id:"agendar",ic:<Calendar size={16}/>,l:"Agendar Consulta"},{id:"consultas",ic:<ClipboardList size={16}/>,l:"Minhas Consultas"}],
    psicologo:  [{id:"inicio",ic:<Home size={16}/>,l:"Início"},{id:"perfil",ic:<User size={16}/>,l:"Meu Perfil"},{id:"agenda",ic:<Calendar size={16}/>,l:"Minha Agenda"},{id:"atendimentos",ic:<ClipboardList size={16}/>,l:"Atendimentos"},{id:"feedbacks",ic:<MessageCircle size={16}/>,l:"Feedbacks Recebidos"}],
    supervisor: [{id:"inicio",ic:<Home size={16}/>,l:"Início"},{id:"perfil",ic:<User size={16}/>,l:"Meu Perfil"},{id:"usuarios",ic:<Users size={16}/>,l:"Gestão de Usuários"},{id:"todos",ic:<BarChart3 size={16}/>,l:"Todos Atendimentos"},{id:"gerenciar",ic:<Settings size={16}/>,l:"Gerenciar Agenda"},{id:"feedback",ic:<PenLine size={16}/>,l:"Dar Feedback"},{id:"mensagens",ic:<Mail size={16}/>,l:"Fale Conosco"}],
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
    toast("Foto atualizada!");
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
          <li><ThemeToggle theme={theme} setTheme={setTheme}/></li>
          <li><button className="nav-link" onClick={onLogout}>Sair <ArrowRight size={13}/></button></li>
        </ul>
      </nav>
      <div className="dash">
        <aside className="sidebar">
          <div className="sb-user">
            <div className="sb-avatar-wrap">
              <Avatar className="sb-avatar" name={profile.nome} url={avatarUrl}/>
              <div className="sb-avatar-edit" onClick={() => fileRef.current?.click()} title="Trocar foto"><Camera size={11}/></div>
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
            <button className="btn btn-sm btn-danger" style={{width:"100%"}} onClick={onLogout}><LogOut size={14}/> Sair da conta</button>
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
              <span className="bni"><LogOut size={16}/></span>
              <span>Sair</span>
            </button>
          </div>
        </nav>
        <main className="dash-main">
          <div className="tab-fade" ref={tabFadeRef}>
            {profile.tipo==="paciente"   && <DashPac  aba={aba} setAba={setAba} profile={profile} uid={user.id} onPU={onProfileUpdate} avatarUrl={avatarUrl}/>}
            {profile.tipo==="psicologo"  && <DashPsi  aba={aba} setAba={setAba} profile={profile} uid={user.id} onPU={onProfileUpdate} avatarUrl={avatarUrl}/>}
            {profile.tipo==="supervisor" && <DashSup  aba={aba} setAba={setAba} profile={profile} uid={user.id} onPU={onProfileUpdate} avatarUrl={avatarUrl}/>}
          </div>
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
  const [busca, setBusca]         = useState("");
  const [confirmCfg, setConfirmCfg] = useState(null);
  const [avaliarAg, setAvaliarAg] = useState(null);
  const [avNota, setAvNota] = useState(5);
  const [avTexto, setAvTexto] = useState("");
  const [avBusy, setAvBusy] = useState(false);

  async function enviarAvaliacao() {
    if (!avaliarAg) return;
    setAvBusy(true);
    const { error } = await supabase.from("agendamentos")
      .update({ avaliacao_nota: avNota, avaliacao_texto: avTexto || null })
      .eq("id", avaliarAg.id);
    setAvBusy(false);
    if (error) { toast(`Erro ao enviar avaliação: ${error.message}`, "err"); return; }
    setConsultas(p => p.map(c => c.id===avaliarAg.id ? {...c, avaliacao_nota: avNota, avaliacao_texto: avTexto||null} : c));
    toast("Obrigado pela sua avaliação!");
    setAvaliarAg(null); setAvNota(5); setAvTexto("");
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const {data:ag} = await supabase.from("agendamentos").select("*").eq("paciente_id",uid).order("data",{ascending:true}).order("hora",{ascending:true});
      const {data:ps} = await supabase.from("profiles").select("id,nome,crp").eq("tipo","psicologo").eq("status","ativo");
      setConsultas(ag||[]); setPsicos(ps||[]); setLoading(false);
    })();
  }, [uid]);

  async function salvar() {
    const {data,error} = await supabase.from("profiles").update({nome,matricula:mat}).eq("id",uid).select().single();
    if (error) { toast("Erro ao salvar.", "err"); return; }
    if (data) { onPU(data); toast("Perfil atualizado com sucesso!"); }
  }

  async function cancelarConsulta(id) {
    const { error } = await supabase.from("agendamentos").update({ status: "cancelado" }).eq("id", id);
    if (error) { toast(`Erro ao cancelar: ${error.message}`, "err"); return; }
    setConsultas(p => p.map(a => a.id === id ? { ...a, status: "cancelado" } : a));
    toast("Consulta cancelada.");
  }

  async function reagendarConsulta(a) {
    // Cancela a consulta atual e leva o paciente para a tela de agendamento
    const { error } = await supabase.from("agendamentos").update({ status: "cancelado" }).eq("id", a.id);
    if (error) { toast(`Erro ao reagendar: ${error.message}`, "err"); return; }
    setConsultas(p => p.map(c => c.id === a.id ? { ...c, status: "cancelado" } : c));
    toast("A consulta anterior foi cancelada. Escolha um novo horário.", "info");
    setAba("agendar");
  }

  function pedirReagendamento(a) {
    setConfirmCfg({
      title: "Reagendar consulta?",
      message: `A consulta de ${fmt(a.data)} às ${fmtH(a.hora)} com ${a.psicologo_nome || "—"} será cancelada e você poderá escolher um novo horário em seguida. Deseja continuar?`,
      confirmLabel: "Sim, reagendar",
      danger: false,
      onConfirm: () => reagendarConsulta(a),
    });
  }

  function pedirCancelamento(a) {
    setConfirmCfg({
      title: "Cancelar consulta?",
      message: `Tem certeza que deseja cancelar a consulta de ${fmt(a.data)} às ${fmtH(a.hora)} com ${a.psicologo_nome || "—"}? Essa ação não pode ser desfeita.`,
      confirmLabel: "Sim, cancelar",
      danger: true,
      onConfirm: () => cancelarConsulta(a.id),
    });
  }

  if (aba==="perfil") return (
    <div>
      <div className="dash-title"><User size={20}/> Meu Perfil</div>
      <div className="dash-sub">Suas informações pessoais</div>
      <div className="prof-card">
        <div className="prof-av-wrap">
          <Avatar className="prof-av" name={profile.nome} url={avatarUrl}/>
        </div>
        <div className="prof-info"><h3>{profile.nome}</h3><p>{profile.email}{profile.matricula&&` · Matrícula: ${profile.matricula}`}</p><br/><span className="chip">Paciente</span></div>
      </div>
      <div className="panel">
        <div className="panel-title"><Pencil size={16}/> Editar dados</div>
        <div className="fg"><label>Nome</label><input value={nome} onChange={e=>setNome(e.target.value)}/></div>
        <div className="fg"><label>Matrícula</label><input value={mat} onChange={e=>setMat(e.target.value)} placeholder="20240001"/></div>
        <div className="fg"><label>E-mail</label><EmailEditField uid={uid} currentEmail={profile.email} onUpdated={(em)=>onPU({...profile, email: em})}/></div>
        <button className="btn btn-teal btn-sm" onClick={salvar}>Salvar alterações</button>
      </div>
    </div>
  );

  if (aba==="agendar") return <TelaAgendar uid={uid} profile={profile} psicos={psicos} onAgendado={ag=>setConsultas(c=>[...c,ag])}/>;

  if (aba==="consultas") {
    const filtradas = consultas.filter(a => {
      if (!busca) return true;
      const term = busca.toLowerCase();
      return (a.psicologo_nome||"").toLowerCase().includes(term)
        || fmt(a.data).includes(term)
        || a.status.toLowerCase().includes(term);
    });
    return (
    <div>
      <div className="dash-title"><ClipboardList size={20}/> Minhas Consultas</div>
      <div className="dash-sub">Histórico e próximas sessões</div>
      <ConfirmModal config={confirmCfg} onClose={() => setConfirmCfg(null)} />
      {avaliarAg && (
        <div className="overlay" onClick={() => setAvaliarAg(null)}>
          <div className="modal" style={{maxWidth:420}} onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setAvaliarAg(null)}><X size={16}/></button>
            <div style={{marginBottom:10,color:"var(--amber)",display:"flex",justifyContent:"center"}}><Star size={38} fill="currentColor"/></div>
            <h3 style={{fontFamily:"var(--font-head)",fontSize:18,fontWeight:800,color:"var(--ink)",marginBottom:6}}>Avaliar sessão</h3>
            <p style={{fontSize:13.5,color:"var(--ink-2)",marginBottom:12}}>
              Sessão de {fmt(avaliarAg.data)} com <strong>{avaliarAg.psicologo_nome||"—"}</strong>. Sua avaliação ajuda a melhorar nosso atendimento.
            </p>
            <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:14}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setAvNota(n)} style={{color:"var(--amber)",display:"inline-flex",background:"none",border:"none",cursor:"pointer",opacity:n<=avNota?1:.25,transition:"opacity .15s"}}><Star size={28} fill="currentColor"/></button>
              ))}
            </div>
            <div className="fg">
              <label>Comentário (opcional)</label>
              <textarea value={avTexto} onChange={e=>setAvTexto(e.target.value)} placeholder="Conte como foi sua experiência..." style={{height:90}}/>
            </div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button className="btn btn-outline" style={{flex:1}} onClick={() => setAvaliarAg(null)} disabled={avBusy}>Cancelar</button>
              <button className="btn btn-teal" style={{flex:1}} onClick={enviarAvaliacao} disabled={avBusy}>{avBusy ? <Spin/> : "Enviar avaliação"}</button>
            </div>
          </div>
        </div>
      )}
      {loading ? <Loading kind="table" rows={4} /> :
       consultas.length===0 ? (
         <EmptyState
           icon={<CalendarDays size={34}/>}
           title="Nenhuma consulta agendada ainda"
           subtitle="Que tal marcar sua primeira sessão? É rápido e totalmente gratuito para estudantes da FUMEC."
           ctaLabel={<><Calendar size={14}/> Agendar consulta</>}
           onCta={() => setAba("agendar")}
         />
       ) : <>
        <SearchBox value={busca} onChange={setBusca} placeholder="Buscar por psicólogo, data ou status..." />
        {filtradas.length===0 ? (
          <EmptyState icon={<Search size={34}/>} title="Nenhum resultado" subtitle="Tente buscar por outro termo." />
        ) : (
        <div className="panel">
          <div className="tw"><table>
            <thead><tr><th>Data</th><th>Horário</th><th>Psicólogo(a)</th><th>Sessão</th><th>Status</th><th>Observações</th><th>Ações</th></tr></thead>
            <tbody>{filtradas.map(a=>(
              <tr key={a.id}>
                <td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.psicologo_nome||"—"}</td>
                <td>#{a.sessao_numero}</td><td><span className={`st st-${a.status}`}>{a.status}</span></td>
                <td style={{maxWidth:220}}>{a.observacoes ? <span style={{fontSize:12.5,color:"var(--ink-2)"}}>{a.observacoes}</span> : <span style={{color:"var(--ink-3)"}}>—</span>}</td>
                <td>
                  {(a.status==="pendente"||a.status==="confirmado") ? (
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <button className="btn btn-sm btn-outline" onClick={() => pedirReagendamento(a)}><RefreshCw size={14} style={{verticalAlign:"-2px"}}/> Reagendar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => pedirCancelamento(a)}>Cancelar</button>
                    </div>
                  ) : a.status==="concluido" ? (
                    a.avaliacao_nota ? (
                      <span style={{display:"inline-flex",gap:2,color:"var(--amber)"}}>{Array.from({length:a.avaliacao_nota||0}).map((_,i)=><Star key={i} size={13} fill="currentColor"/>)}</span>
                    ) : (
                      <button className="btn btn-sm btn-outline" onClick={() => { setAvaliarAg(a); setAvNota(5); setAvTexto(""); }}><Star size={14} style={{verticalAlign:"-2px"}}/> Avaliar sessão</button>
                    )
                  ) : <span style={{color:"var(--ink-3)",fontSize:12.5}}>—</span>}
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
        )}
       </>
      }
    </div>
    );
  }

  const conf = consultas.filter(a=>a.status==="confirmado").length;
  const pend = consultas.filter(a=>a.status==="pendente").length;
  const conc = consultas.filter(a=>a.status==="concluido").length;
  const prox = consultas.filter(a=>a.status!=="concluido"&&a.status!=="cancelado");

  return (
    <div>
      <div className="dash-title">Olá, {profile.nome.split(" ")[0]}!</div>
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
          <div className="panel-title"><Calendar size={16}/> Próximas consultas</div>
          {prox.length===0 ? (
            <EmptyState
              icon={<CalendarDays size={34}/>}
              title="Nenhuma consulta agendada"
              subtitle="Marque sua primeira sessão com um de nossos psicólogos."
              ctaLabel={<><Calendar size={14}/> Agendar consulta</>}
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
          {prox.length>5 && (
            <button className="load-more-btn" onClick={() => setAba("consultas")}>Ver todas as {prox.length} consultas <ArrowRight size={13} style={{verticalAlign:"-2px"}}/></button>
          )}
        </div>
        <div className="al al-warn" style={{display:"flex",gap:8,alignItems:"flex-start"}}><AlertTriangle size={16} style={{flexShrink:0,marginTop:2}}/> Em caso de crise, ligue para o <strong>CVV: 188</strong> (24h, gratuito)</div>
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
    if (!error&&data) { setOk(data); onAgendado(data); toast("Consulta agendada com sucesso!"); }
    else toast("Erro ao agendar. Tente novamente.", "err");
  }

  if (ok) return (
    <div>
      <div className="dash-title"><Calendar size={20}/> Agendar Consulta</div>
      <div className="al al-ok" style={{fontSize:15,padding:"1.5rem",lineHeight:2}}>
        <CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> <strong>Consulta agendada com sucesso!</strong><br/>
        <Calendar size={14} style={{verticalAlign:"-2px"}}/> Data: <strong>{fmt(ok.data)}</strong> · <Clock size={14} style={{verticalAlign:"-2px"}}/> <strong>{fmtH(ok.hora)}</strong><br/>
        <Stethoscope size={14} style={{verticalAlign:"-2px"}}/> Psicólogo(a): <strong>{ok.psicologo_nome}</strong><br/>
        ⏳ Aguardando confirmação do supervisor.
      </div>
      <button className="btn btn-teal btn-sm" onClick={()=>{setOk(null);setDia(null);setHora(null);}}>Agendar outro horário</button>
    </div>
  );

  return (
    <div>
      <div className="dash-title"><Calendar size={20}/> Agendar Consulta</div>
      <div className="dash-sub">Escolha o profissional, o dia e o horário disponível</div>
      {psicos.length===0
        ? <EmptyState
            icon={<Stethoscope size={34}/>}
            title="Nenhum psicólogo disponível no momento"
            subtitle="Nossa equipe está organizando os profissionais ativos. Tente novamente em breve ou acompanhe pelo Fale Conosco."
          />
        : <>
          <div className="panel">
            <div className="panel-title"><Stethoscope size={16}/> Escolha o psicólogo(a)</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {psicos.map(p=>(
                <button key={p.id} onClick={()=>{setPsico(p.id);setDia(null);setHora(null);}} className="btn btn-sm" style={{
                  background:psico===p.id?"var(--chrome)":"var(--bg-warm)",
                  color:psico===p.id?"#fff":"var(--ink)",
                  border:`1.5px solid ${psico===p.id?"var(--chrome)":"var(--border)"}`,
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
                      <div className="al al-ok" style={{marginBottom:"1rem",display:"flex",gap:8,alignItems:"center"}}><CheckCircle2 size={16}/> <strong>{dia}/{mes+1} às {hora}</strong></div>
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
  const [busca, setBusca] = useState("");
  const [confirmCfg, setConfirmCfg] = useState(null);
  const [concluirAg, setConcluirAg] = useState(null); // agendamento sendo concluído
  const [obsTexto, setObsTexto] = useState("");
  const [obsBusy, setObsBusy] = useState(false);
  const [histExpand, setHistExpand] = useState(null); // paciente_id expandido

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
      const {data:at} = await supabase.from("agendamentos").select("*").eq("psicologo_id",uid).order("data",{ascending:true}).order("hora",{ascending:true});
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
      if (error.code === "42P01") { toast("Tabela disponibilidade não criada. Execute a migration SQL.", "err"); }
      else { toast("Erro ao salvar disponibilidade.", "err"); }
      return;
    }
    toast("Disponibilidade salva com sucesso!");
  }

  async function salvarPerfil() {
    const {data,error} = await supabase.from("profiles").update({nome,crp}).eq("id",uid).select().single();
    if (error) { toast("Erro ao salvar.", "err"); return; }
    if (data) { onPU(data); toast("Perfil atualizado!"); }
  }

  // Abre modal para concluir atendimento com observações
  function abrirConcluir(a) {
    setObsTexto(a.observacoes || "");
    setConcluirAg(a);
  }

  async function confirmarConclusao() {
    if (!concluirAg) return;
    setObsBusy(true);
    const { error } = await supabase.from("agendamentos")
      .update({ status: "concluido", observacoes: obsTexto || null })
      .eq("id", concluirAg.id);
    setObsBusy(false);
    if (error) { toast(`Erro ao concluir: ${error.message}`, "err"); return; }
    setAtend(p => p.map(a => a.id === concluirAg.id ? { ...a, status: "concluido", observacoes: obsTexto || null } : a));
    toast("Atendimento concluído!");
    setConcluirAg(null);
  }

  async function cancelarAtendimento(id) {
    const { error } = await supabase.from("agendamentos").update({ status: "cancelado" }).eq("id", id);
    if (error) { toast(`Erro ao cancelar: ${error.message}`, "err"); return; }
    setAtend(p => p.map(a => a.id === id ? { ...a, status: "cancelado" } : a));
    toast("Atendimento cancelado.");
  }

  function pedirCancelamentoAtendimento(a) {
    setConfirmCfg({
      title: "Cancelar atendimento?",
      message: `Tem certeza que deseja cancelar o atendimento de ${fmt(a.data)} às ${fmtH(a.hora)} com ${a.paciente_nome || "—"}? Essa ação não pode ser desfeita.`,
      confirmLabel: "Sim, cancelar",
      danger: true,
      onConfirm: () => cancelarAtendimento(a.id),
    });
  }

  if (aba==="perfil") return (
    <div>
      <div className="dash-title"><User size={20}/> Meu Perfil</div>
      <div className="prof-card">
        <div className="prof-av-wrap">
          <Avatar className="prof-av" name={profile.nome} url={avatarUrl}/>
        </div>
        <div className="prof-info"><h3>{profile.nome}</h3><p>{profile.email}{profile.crp&&` · CRP: ${profile.crp}`}</p><br/><span className="chip">Psicólogo(a) Estagiário(a)</span></div>
      </div>
      <div className="panel">
        <div className="panel-title"><Pencil size={16}/> Editar dados</div>
        <div className="fg"><label>Nome</label><input value={nome} onChange={e=>setNome(e.target.value)}/></div>
        <div className="fg"><label>CRP</label><input value={crp} onChange={e=>setCrp(e.target.value)} placeholder="04/12345"/></div>
        <div className="fg"><label>E-mail</label><EmailEditField uid={uid} currentEmail={profile.email} onUpdated={(em)=>onPU({...profile, email: em})}/></div>
        <button className="btn btn-teal btn-sm" onClick={salvarPerfil}>Salvar</button>
      </div>
    </div>
  );

  if (aba==="agenda") return (
    <div>
      <div className="dash-title"><Calendar size={20}/> Minha Agenda</div>
      <div className="dash-sub">Configure sua disponibilidade semanal</div>
      <div className="panel">
        <div className="panel-title"><Clock size={16}/> Horários disponíveis</div>
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
          {savingAgenda ? <><Spin/> Salvando...</> : <><Save size={14} style={{verticalAlign:"-2px"}}/> Salvar disponibilidade</>}
        </button>
      </div>
    </div>
  );

  if (aba==="atendimentos") {
    const filtrados = atend.filter(a => {
      if (!busca) return true;
      const term = busca.toLowerCase();
      return (a.paciente_nome||"").toLowerCase().includes(term)
        || fmt(a.data).includes(term)
        || a.status.toLowerCase().includes(term);
    });
    return (
    <div>
      <div className="dash-title"><ClipboardList size={20}/> Meus Atendimentos</div>
      <ConfirmModal config={confirmCfg} onClose={() => setConfirmCfg(null)} />

      {/* Modal: concluir com observações */}
      {concluirAg && (
        <div className="overlay" onClick={() => setConcluirAg(null)}>
          <div className="modal" style={{maxWidth:480}} onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setConcluirAg(null)}><X size={16}/></button>
            <div style={{marginBottom:10,color:"var(--purple)",display:"flex",justifyContent:"center"}}><Circle size={38} fill="currentColor"/></div>
            <h3 style={{fontFamily:"var(--font-head)",fontSize:18,fontWeight:800,color:"var(--ink)",marginBottom:6}}>Concluir atendimento</h3>
            <p style={{fontSize:13.5,color:"var(--ink-2)",marginBottom:14}}>
              Sessão de {fmt(concluirAg.data)} às {fmtH(concluirAg.hora)} com <strong>{concluirAg.paciente_nome || "—"}</strong>.
            </p>
            <div className="fg">
              <label>Observações da sessão (opcional)</label>
              <textarea
                value={obsTexto}
                onChange={e=>setObsTexto(e.target.value)}
                placeholder="Resumo da sessão, evolução do paciente, pontos a acompanhar..."
                style={{height:120}}
              />
              <div className="al al-info" style={{marginTop:8,fontSize:12.5}}>
                <MessageCircle size={13} style={{verticalAlign:"-2px"}}/> Essas observações ficam visíveis para você e para o supervisor.
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button className="btn btn-outline" style={{flex:1}} onClick={() => setConcluirAg(null)} disabled={obsBusy}>Cancelar</button>
              <button className="btn btn-teal" style={{flex:1}} onClick={confirmarConclusao} disabled={obsBusy}>
                {obsBusy ? <Spin/> : <><CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> Concluir atendimento</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? <Loading kind="table" rows={5} /> :
        <div className="panel">
          <div className="panel-title">Lista de atendimentos</div>
          {atend.length===0 ? (
            <EmptyState
              icon={<ClipboardList size={34}/>}
              title="Nenhum atendimento ainda"
              subtitle="Quando pacientes agendarem sessões com você, elas aparecerão aqui."
            />
          ) : <>
            <SearchBox value={busca} onChange={setBusca} placeholder="Buscar por paciente, data ou status..." />
            {filtrados.length===0 ? (
              <EmptyState icon={<Search size={34}/>} title="Nenhum resultado" subtitle="Tente buscar por outro termo." />
            ) :
            <div className="tw"><table>
              <thead><tr><th>Data</th><th>Horário</th><th>Paciente</th><th>Sessão</th><th>Status</th><th>Observações</th><th>Ações</th></tr></thead>
              <tbody>{filtrados.map(a=>{
                const historico = atend.filter(h => h.paciente_id===a.paciente_id && h.status==="concluido" && h.id!==a.id)
                  .sort((x,y) => (x.data+x.hora < y.data+y.hora) ? 1 : -1);
                const expandido = histExpand === a.paciente_id;
                return (
                <>
                <tr key={a.id}>
                  <td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td>
                  <td>
                    {a.paciente_nome||"—"}
                    {historico.length>0 && (
                      <button className="btn-xs" style={{marginLeft:6}} onClick={()=>setHistExpand(expandido?null:a.paciente_id)}>
                        {expandido?"▲":"▼"} Histórico ({historico.length})
                      </button>
                    )}
                  </td>
                  <td>#{a.sessao_numero}</td><td><span className={`st st-${a.status}`}>{a.status}</span></td>
                  <td style={{maxWidth:220}}>{a.observacoes ? <span style={{fontSize:12.5,color:"var(--ink-2)"}}>{a.observacoes}</span> : <span style={{color:"var(--ink-3)"}}>—</span>}</td>
                  <td style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {a.status==="confirmado" && <>
                      <button className="btn btn-sm btn-success" onClick={() => abrirConcluir(a)}><Circle size={13} fill="currentColor" style={{verticalAlign:"-2px"}}/> Concluir</button>
                      <button className="btn btn-sm btn-danger" onClick={() => pedirCancelamentoAtendimento(a)}>Cancelar</button>
                    </>}
                    {a.status==="concluido" && (
                      <button className="btn btn-sm btn-outline" onClick={() => abrirConcluir(a)}><Pencil size={14} style={{verticalAlign:"-2px"}}/> Editar obs.</button>
                    )}
                    {(a.status!=="confirmado" && a.status!=="concluido") && <span style={{color:"var(--ink-3)",fontSize:12.5}}>—</span>}
                  </td>
                </tr>
                {expandido && (
                  <tr><td colSpan={7} style={{padding:0,border:"none"}}>
                    <div className="obs-box" style={{margin:"4px 0 10px"}}>
                      <strong>Histórico com {a.paciente_nome}</strong>
                      {historico.map(h=>(
                        <div key={h.id} style={{padding:"6px 0",borderTop:"1px solid var(--border)"}}>
                          <strong style={{fontSize:12.5,color:"var(--ink)"}}>{fmt(h.data)}</strong> — Sessão #{h.sessao_numero}
                          {h.observacoes && <div style={{marginTop:2}}>{h.observacoes}</div>}
                          {!h.observacoes && <div style={{marginTop:2,color:"var(--ink-3)"}}>Sem observações registradas.</div>}
                        </div>
                      ))}
                    </div>
                  </td></tr>
                )}
                </>
                );
              })}</tbody>
            </table></div>
            }
          </>}
        </div>
      }
    </div>
    );
  }

  if (aba==="feedbacks") return (
    <div>
      <div className="dash-title"><MessageCircle size={20}/> Feedbacks Recebidos</div>
      <div className="dash-sub">Avaliações do supervisor sobre seus atendimentos</div>
      {loading ? <Loading kind="cards" rows={3} /> :
       fbs.length===0 ? (
         <EmptyState
           icon={<MessageCircle size={34}/>}
           title="Nenhum feedback recebido ainda"
           subtitle="Os feedbacks enviados pelo supervisor sobre suas sessões aparecerão aqui."
         />
       ) :
        fbs.map(fb=>(
          <div className="fb-card" key={fb.id}>
            <div className="fb-hdr"><h4>Sessão com {fb.paciente_nome||"—"}</h4><span>{fmt(fb.created_at?.slice(0,10))} · {fb.supervisor_nome}</span></div>
            <div className="stars" style={{display:"inline-flex",gap:2,color:"var(--amber)"}}>{Array.from({length:fb.nota||0}).map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div>
            <p className="fb-text" style={{marginTop:8}}>{fb.texto}</p>
          </div>
        ))
      }
    </div>
  );

  return (
    <div>
      <div className="dash-title">Olá, {profile.nome.split(" ")[0]}!</div>
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
          <div className="panel-title"><Calendar size={16}/> Próximos atendimentos</div>
          {(() => {
            const prox = atend.filter(a=>a.status!=="concluido"&&a.status!=="cancelado");
            if (prox.length===0) return (
              <EmptyState
                icon={<Calendar size={34}/>}
                title="Nenhum atendimento agendado"
                subtitle="Configure sua disponibilidade na agenda para que pacientes possam marcar sessões com você."
                ctaLabel={<><Clock size={14}/> Configurar agenda</>}
                onCta={() => setAba("agenda")}
              />
            );
            return <>
              <div className="tw"><table>
                <thead><tr><th>Data</th><th>Horário</th><th>Paciente</th><th>Status</th></tr></thead>
                <tbody>{prox.slice(0,5).map(a=>(
                  <tr key={a.id}><td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td>
                    <td><span className={`st st-${a.status}`}>{a.status}</span></td></tr>
                ))}</tbody>
              </table></div>
              {prox.length>5 && (
                <button className="load-more-btn" onClick={() => setAba("atendimentos")}>Ver todos os {prox.length} atendimentos <ArrowRight size={13} style={{verticalAlign:"-2px"}}/></button>
              )}
            </>;
          })()}
        </div>
      </>}
    </div>
  );
}

// ─── SUPERVISOR ──────────────────────────────────────────────────────────────
// ─── GRÁFICOS DO SUPERVISOR ───────────────────────────────────────────────────
function SupervisorCharts({ todos, psicos }) {
  // Atendimentos por mês (últimos 6 meses)
  const meses = {};
  const hoje = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const key = `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getFullYear()).slice(2)}`;
    meses[key] = 0;
  }
  todos.forEach(a => {
    if (!a.data) return;
    const [y, m] = a.data.split("-");
    const key = `${m}/${y.slice(2)}`;
    if (key in meses) meses[key]++;
  });
  const dataMes = Object.entries(meses).map(([mes, total]) => ({ mes, total }));

  // Distribuição por status
  const statusCount = { confirmado:0, pendente:0, concluido:0, cancelado:0 };
  todos.forEach(a => { if (a.status in statusCount) statusCount[a.status]++; });
  const dataStatus = [
    { name: "Confirmados", value: statusCount.confirmado, color: "#1A7A6E" },
    { name: "Pendentes", value: statusCount.pendente, color: "#B45309" },
    { name: "Concluídos", value: statusCount.concluido, color: "#5B21B6" },
    { name: "Cancelados", value: statusCount.cancelado, color: "#C0392B" },
  ].filter(d => d.value > 0);

  // Atendimentos por psicólogo
  const porPsico = {};
  todos.forEach(a => {
    const nome = a.psicologo_nome || "—";
    porPsico[nome] = (porPsico[nome] || 0) + 1;
  });
  const dataPsico = Object.entries(porPsico)
    .map(([nome, total]) => ({ nome: nome.split(" ")[0], total }))
    .sort((a,b) => b.total - a.total).slice(0, 8);

  const totalAtend = todos.length;
  const concluidos = statusCount.concluido;
  const cancelados = statusCount.cancelado;
  const taxaConclusao = totalAtend ? Math.round((concluidos / totalAtend) * 100) : 0;
  const taxaCancelamento = totalAtend ? Math.round((cancelados / totalAtend) * 100) : 0;

  if (totalAtend === 0) return null;

  return (
    <>
      <div className="kpi-row">
        <div className="kpi"><div className="kpi-num">{taxaConclusao}%</div><div className="kpi-label">Taxa de conclusão</div></div>
        <div className="kpi"><div className="kpi-num" style={{color: taxaCancelamento > 20 ? "var(--red)" : "var(--teal)"}}>{taxaCancelamento}%</div><div className="kpi-label">Taxa de cancelamento</div></div>
        <div className="kpi"><div className="kpi-num">{psicos.filter(p=>!p.status||p.status==="ativo").length}</div><div className="kpi-label">Psicólogos ativos</div></div>
      </div>
      <div className="charts-grid">
        <div className="panel">
          <div className="panel-title"><TrendingUp size={16}/> Atendimentos por mês</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "var(--ink-2)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--ink-2)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "var(--bg-card)", color: "var(--ink)" }} cursor={{ fill: "var(--teal-light)" }} />
              <Bar dataKey="total" fill="#1A7A6E" radius={[6, 6, 0, 0]} name="Atendimentos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <div className="panel-title"><PieChart size={16}/> Distribuição por status</div>
          <ResponsiveContainer width="100%" height={220}>
            <RPieChart>
              <Pie data={dataStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {dataStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "var(--bg-card)", color: "var(--ink)" }} />
            </RPieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 4 }}>
            {dataStatus.map((e, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--ink-2)" }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: e.color, display: "inline-block" }} />{e.name} ({e.value})
              </span>
            ))}
          </div>
        </div>
      </div>
      {dataPsico.length > 0 && (
        <div className="panel">
          <div className="panel-title"><Users size={16}/> Atendimentos por psicólogo(a)</div>
          <ResponsiveContainer width="100%" height={Math.max(180, dataPsico.length * 38)}>
            <BarChart data={dataPsico} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "var(--ink-2)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nome" tick={{ fontSize: 12, fill: "var(--ink-2)" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "var(--bg-card)", color: "var(--ink)" }} cursor={{ fill: "var(--teal-light)" }} />
              <Bar dataKey="total" fill="#1565C0" radius={[0, 6, 6, 0]} name="Atendimentos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

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
  const [confirmCfg, setConfirmCfg] = useState(null);

  // Busca/filtro
  const [buscaUsuarios, setBuscaUsuarios] = useState("");
  const [buscaAtend, setBuscaAtend] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [buscaGerenciar, setBuscaGerenciar] = useState("");
  const [buscaMsg, setBuscaMsg] = useState("");

  const [fbPsico, setFbP]     = useState("");
  const [fbPac, setFbPac]     = useState("");
  const [fbNota, setFbN]      = useState(5);
  const [fbTxt, setFbT]       = useState("");
  const [fbBusy, setFbB]      = useState(false);

  useEffect(() => {
    (async () => {
      setL(true);
      const {data:ag} = await supabase.from("agendamentos").select("*").order("data",{ascending:true}).order("hora",{ascending:true});
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
    const msgs = { confirmado:"Confirmado!", concluido:"Concluído!", cancelado:"Cancelado." };
    toast(msgs[status] || "Atualizado!");
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
    toast("Feedback enviado com sucesso!"); setFbT(""); setFbPac(""); setFbP(""); setFbN(5);
    const {data:fb} = await supabase.from("feedbacks").select("*").order("created_at",{ascending:false});
    setFbs(fb||[]);
  }

  async function salvarPerfil() {
    const {data,error} = await supabase.from("profiles").update({nome}).eq("id",uid).select().single();
    if (error) { toast("Erro ao salvar.", "err"); return; }
    if (data) { onPU(data); toast("Perfil atualizado!"); }
  }

  async function setStatusUsuario(userId, novoStatus) {
    const { error } = await supabase.from("profiles").update({ status: novoStatus }).eq("id", userId);
    if (error) {
      if (error.code === "42703") {
        // Coluna status não existe no banco — roda a migration primeiro
        toast("Execute a migration SQL para adicionar a coluna status. Veja MIGRATIONS_V1.sql", "err");
        return;
      }
      if (error.code === "42501" || error.message?.includes("violates row-level security")) {
        toast("Permissão negada. Execute o SQL de policy no Supabase (ver MIGRATIONS_V1.sql).", "err");
        return;
      }
      toast(`Erro: ${error.message}`, "err");
      return;
    }
    // Atualiza estado local imediatamente
    setUsuarios(p => p.map(u => u.id === userId ? { ...u, status: novoStatus } : u));
    setPsicos(p => p.map(u => u.id === userId ? { ...u, status: novoStatus } : u));
    const acao = novoStatus === "ativo" ? "aprovado/ativado" : novoStatus === "inativo" ? "desativado/rejeitado" : novoStatus;
    toast(`Usuário ${acao} com sucesso!`);
  }

  async function marcarMsgLida(msg) {
    if (!msg.lida) {
      const { error } = await supabase.from("contatos").update({lida:true}).eq("id",msg.id);
      if (!error) setMensagens(p=>p.map(m=>m.id===msg.id?{...m,lida:true}:m));
    }
    setMsgSel(msg);
  }

  // ── Confirmações para ações destrutivas ─────────────────────────────────
  function pedirRejeicao(u, tipo) {
    setConfirmCfg({
      title: `Rejeitar ${tipo}?`,
      message: `Tem certeza que deseja rejeitar o cadastro de ${u.nome}? A conta ficará inativa e o usuário não terá acesso ao sistema.`,
      confirmLabel: "Sim, rejeitar",
      danger: true,
      onConfirm: () => setStatusUsuario(u.id, "inativo"),
    });
  }
  function pedirDesativacao(u) {
    setConfirmCfg({
      title: "Desativar psicólogo(a)?",
      message: `${u.nome} deixará de aparecer na lista de agendamento dos pacientes. Você pode reativar a qualquer momento.`,
      confirmLabel: "Sim, desativar",
      danger: true,
      onConfirm: () => setStatusUsuario(u.id, "inativo"),
    });
  }
  function pedirCancelamentoAg(a) {
    setConfirmCfg({
      title: "Cancelar agendamento?",
      message: `Cancelar a sessão de ${fmt(a.data)} às ${fmtH(a.hora)} entre ${a.paciente_nome||"—"} e ${a.psicologo_nome||"—"}? Essa ação não pode ser desfeita.`,
      confirmLabel: "Sim, cancelar",
      danger: true,
      onConfirm: () => atualizar(a.id, "cancelado"),
    });
  }

  if (aba==="perfil") return (
    <div>
      <div className="dash-title"><GraduationCap size={20}/> Meu Perfil</div>
      <div className="prof-card">
        <div className="prof-av-wrap">
          <Avatar className="prof-av" name={profile.nome} url={avatarUrl}/>
        </div>
        <div className="prof-info"><h3>{profile.nome}</h3><p>{profile.email}</p><br/><span className="chip">Supervisor / Administrador</span></div>
      </div>
      <div className="panel">
        <div className="panel-title"><Pencil size={16}/> Editar dados</div>
        <div className="fg"><label>Nome</label><input value={nome} onChange={e=>setNome(e.target.value)}/></div>
        <div className="fg"><label>E-mail</label><EmailEditField uid={uid} currentEmail={profile.email} onUpdated={(em)=>onPU({...profile, email: em})}/></div>
        <button className="btn btn-teal btn-sm" onClick={salvarPerfil}>Salvar</button>
      </div>
    </div>
  );

  // ── GESTÃO DE USUÁRIOS ────────────────────────────────────────────────────
  if (aba==="usuarios") {
    const term = buscaUsuarios.toLowerCase();
    const matches = (u) => !term || u.nome.toLowerCase().includes(term) || (u.email||"").toLowerCase().includes(term) || (u.crp||"").toLowerCase().includes(term) || (u.matricula||"").toLowerCase().includes(term);
    const psicosAtivosInativos = usuarios.filter(u=>u.tipo==="psicologo"&&u.status!=="pendente_aprovacao"&&matches(u));
    const pacientesFiltrados = usuarios.filter(u=>u.tipo==="paciente"&&matches(u));
    return (
    <div>
      <div className="dash-title"><Users size={20}/> Gestão de Usuários</div>
      <div className="dash-sub">Gerencie contas, ative psicólogos e aprove supervisores</div>
      <ConfirmModal config={confirmCfg} onClose={() => setConfirmCfg(null)} />
      {loading ? <Loading kind="cards" rows={4} /> : <>

        {/* Supervisores pendentes */}
        {usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length>0 && (
          <div className="panel" style={{borderColor:"var(--amber)",borderWidth:2}}>
            <div className="panel-title" style={{color:"var(--amber)"}}><Hourglass size={14} style={{verticalAlign:"-2px"}}/> Supervisores aguardando aprovação ({usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length})</div>
            {usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").map(u=>(
              <div className="user-card" key={u.id}>
                <div className="user-card-left">
                  <div className="user-av-sm" style={{background:"var(--purple)"}}>{u.nome[0]}</div>
                  <div><div className="user-info-name">{u.nome}</div><div className="user-info-sub">{u.email} · Supervisor(a)</div></div>
                </div>
                <div className="user-card-actions">
                  <span className="st st-aguardando">Aguardando</span>
                  <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}><CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> Aprovar</button>
                  <button className="btn btn-sm btn-danger"  onClick={()=>pedirRejeicao(u, "supervisor")}><XCircle size={14} style={{verticalAlign:"-2px"}}/> Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Psicólogos pendentes */}
        {usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length>0 && (
          <div className="panel" style={{borderColor:"var(--teal)",borderWidth:2}}>
            <div className="panel-title" style={{color:"var(--teal)"}}><Hourglass size={14} style={{verticalAlign:"-2px"}}/> Psicólogos aguardando ativação ({usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length})</div>
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
                  <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}><CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> Ativar para atender</button>
                  <button className="btn btn-sm btn-danger"  onClick={()=>pedirRejeicao(u, "psicólogo")}><XCircle size={14} style={{verticalAlign:"-2px"}}/> Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <SearchBox value={buscaUsuarios} onChange={setBuscaUsuarios} placeholder="Buscar usuário por nome, e-mail, CRP ou matrícula..." />

        {/* Psicólogos ativos/inativos */}
        <div className="panel">
          <div className="panel-title"><Stethoscope size={16}/> Psicólogos</div>
          {psicosAtivosInativos.length===0
            ? <EmptyState icon={<Stethoscope size={34}/>} title={buscaUsuarios ? "Nenhum resultado" : "Nenhum psicólogo cadastrado"} subtitle={buscaUsuarios ? "Tente buscar por outro termo." : "Quando psicólogos se cadastrarem na plataforma, eles aparecerão aqui para ativação."} />
            : psicosAtivosInativos.map(u=>(
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
                    ? <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}><CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> Ativar</button>
                    : <button className="btn btn-sm btn-danger"  onClick={()=>pedirDesativacao(u)}><Ban size={14} style={{verticalAlign:"-2px"}}/> Desativar</button>
                  }
                </div>
              </div>
            ))
          }
        </div>

        {/* Pacientes */}
        <div className="panel">
          <div className="panel-title"><Users size={16}/> Pacientes cadastrados</div>
          {pacientesFiltrados.length===0
            ? <EmptyState icon={<Users size={34}/>} title={buscaUsuarios ? "Nenhum resultado" : "Nenhum paciente cadastrado"} subtitle={buscaUsuarios ? "Tente buscar por outro termo." : "Estudantes que criarem conta na plataforma aparecerão aqui."} />
            : <div className="tw"><table>
                <thead><tr><th>Nome</th><th>E-mail</th><th>Matrícula</th><th>Cadastro</th></tr></thead>
                <tbody>{pacientesFiltrados.map(u=>(
                  <tr key={u.id}><td>{u.nome}</td><td>{u.email||"—"}</td><td>{u.matricula||"—"}</td><td>{fmt(u.created_at?.slice(0,10))}</td></tr>
                ))}</tbody>
              </table></div>
          }
        </div>
      </>}
    </div>
    );
  }

  if (aba==="todos") return (
    <div>
      <div className="dash-title"><BarChart3 size={20}/> Todos os Atendimentos</div>
      <div className="dash-sub">Visão geral de toda a clínica</div>
      {loading ? <>
        <Loading kind="kpi" rows={4} />
        <Loading kind="table" rows={5} />
      </> : <>
        <div className="kpi-row">
          {[["confirmado",<><CheckCircle2 size={14}/> Confirmados</>],["pendente",<><Hourglass size={14}/> Pendentes</>],["cancelado",<><XCircle size={14}/> Cancelados</>],["concluido",<><Circle size={14} fill="currentColor"/> Concluídos</>]].map(([st,l])=>(
            <div className="kpi" key={st}><div className="kpi-num">{todos.filter(a=>a.status===st).length}</div><div className="kpi-label">{l}</div></div>
          ))}
        </div>
        <SupervisorCharts todos={todos} psicos={psicos} />
        <div className="panel">
          <div className="panel-title" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:6}}><ClipboardList size={16}/> Todos os agendamentos</span>
            {todos.length>0 && (
              <button className="btn btn-sm btn-outline" onClick={() => exportarCSV(
                `atendimentos-fumec-${new Date().toISOString().slice(0,10)}.csv`,
                [
                  {label:"Data", value:(r)=>fmt(r.data)},
                  {label:"Hora", value:(r)=>fmtH(r.hora)},
                  {label:"Paciente", value:"paciente_nome"},
                  {label:"Psicólogo", value:"psicologo_nome"},
                  {label:"Sessão", value:(r)=>`#${r.sessao_numero}`},
                  {label:"Status", value:"status"},
                  {label:"Observações", value:"observacoes"},
                ],
                todos
              )}><Download size={14} style={{verticalAlign:"-2px"}}/> Exportar CSV</button>
            )}
          </div>
          {todos.length===0 ? (
            <EmptyState icon={<ClipboardList size={34}/>} title="Nenhum agendamento ainda" subtitle="Quando pacientes marcarem consultas, todos os agendamentos da clínica aparecerão aqui." />
          ) : <>
            <SearchBox value={buscaAtend} onChange={setBuscaAtend} placeholder="Buscar por paciente, psicólogo ou data..." />
            <div className="filter-row">
              {[["todos","Todos"],["pendente","Pendentes"],["confirmado","Confirmados"],["concluido","Concluídos"],["cancelado","Cancelados"]].map(([v,l])=>(
                <button key={v} className={`filter-chip ${filtroStatus===v?"active":""}`} onClick={()=>setFiltroStatus(v)}>{l}</button>
              ))}
            </div>
            {(() => {
              const term = buscaAtend.toLowerCase();
              const filtrados = todos.filter(a => {
                if (filtroStatus!=="todos" && a.status!==filtroStatus) return false;
                if (!term) return true;
                return (a.paciente_nome||"").toLowerCase().includes(term)
                  || (a.psicologo_nome||"").toLowerCase().includes(term)
                  || fmt(a.data).includes(term);
              });
              if (filtrados.length===0) return <EmptyState icon={<Search size={34}/>} title="Nenhum resultado" subtitle="Tente buscar por outro termo ou mudar o filtro." />;
              return (
                <div className="tw"><table>
                  <thead><tr><th>Data</th><th>Hora</th><th>Paciente</th><th>Psicólogo</th><th>Status</th><th>Observações</th></tr></thead>
                  <tbody>{filtrados.map(a=>(
                    <tr key={a.id}><td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td>
                      <td>{a.psicologo_nome||"—"}</td><td><span className={`st st-${a.status}`}>{a.status}</span></td>
                      <td style={{maxWidth:220}}>{a.observacoes ? <span style={{fontSize:12.5,color:"var(--ink-2)"}}>{a.observacoes}</span> : <span style={{color:"var(--ink-3)"}}>—</span>}</td>
                    </tr>
                  ))}</tbody>
                </table></div>
              );
            })()}
          </>}
        </div>
      </>}
    </div>
  );

  if (aba==="gerenciar") {
    const term = buscaGerenciar.toLowerCase();
    const ativos = todos.filter(a=>a.status!=="cancelado"&&a.status!=="concluido");
    const filtrados = ativos.filter(a => !term
      || (a.paciente_nome||"").toLowerCase().includes(term)
      || (a.psicologo_nome||"").toLowerCase().includes(term)
      || fmt(a.data).includes(term)
    );
    return (
    <div>
      <div className="dash-title"><Settings size={20}/> Gerenciar Agenda</div>
      <div className="dash-sub">Confirme, conclua ou cancele agendamentos</div>
      <ConfirmModal config={confirmCfg} onClose={() => setConfirmCfg(null)} />
      {loading ? <Loading kind="table" rows={5} /> :
        <div className="panel">
          <div className="panel-title"><FolderOpen size={16}/> Agendamentos ativos</div>
          {ativos.length===0
            ? <EmptyState icon={<CheckCircle2 size={34}/>} title="Tudo em ordem!" subtitle="Não há agendamentos pendentes de confirmação ou conclusão no momento." />
            : <>
              <SearchBox value={buscaGerenciar} onChange={setBuscaGerenciar} placeholder="Buscar por paciente, psicólogo ou data..." />
              {filtrados.length===0 ? (
                <EmptyState icon={<Search size={34}/>} title="Nenhum resultado" subtitle="Tente buscar por outro termo." />
              ) :
              <div className="tw"><table>
                <thead><tr><th>Data</th><th>Hora</th><th>Paciente</th><th>Psicólogo</th><th>Status</th><th>Observações</th><th>Ações</th></tr></thead>
                <tbody>{filtrados.map(a=>(
                  <tr key={a.id}>
                    <td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td><td>{a.psicologo_nome||"—"}</td>
                    <td><span className={`st st-${a.status}`}>{a.status}</span></td>
                    <td style={{maxWidth:200}}>{a.observacoes ? <span style={{fontSize:12.5,color:"var(--ink-2)"}}>{a.observacoes}</span> : <span style={{color:"var(--ink-3)"}}>—</span>}</td>
                    <td style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {a.status==="pendente"   && <button className="btn btn-sm btn-success" onClick={()=>atualizar(a.id,"confirmado")}><CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> Confirmar</button>}
                      {a.status==="confirmado" && <button className="btn btn-sm btn-success" onClick={()=>atualizar(a.id,"concluido")}><Circle size={13} fill="currentColor" style={{verticalAlign:"-2px"}}/> Concluir</button>}
                      <button className="btn btn-sm btn-danger" onClick={()=>pedirCancelamentoAg(a)}><XCircle size={14} style={{verticalAlign:"-2px"}}/> Cancelar</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table></div>
              }
            </>
          }
        </div>
      }
    </div>
    );
  }

  if (aba==="feedback") return (
    <div>
      <div className="dash-title"><PenLine size={20}/> Dar Feedback</div>
      <div className="dash-sub">Avalie uma sessão de atendimento realizada</div>
      <div className="panel">
        <div className="panel-title"><FileText size={16}/> Novo feedback</div>
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
              <button key={n} onClick={()=>setFbN(n)} style={{color:"var(--amber)",display:"inline-flex",background:"none",border:"none",cursor:"pointer",opacity:n<=fbNota?1:.25,transition:"opacity .15s"}}><Star size={24} fill="currentColor"/></button>
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
          <div className="panel-title"><MessageCircle size={16}/> Feedbacks anteriores</div>
          {fbs.map(fb=>(
            <div className="fb-card" key={fb.id}>
              <div className="fb-hdr"><h4>{fb.psicologo_nome} · {fb.paciente_nome||"—"}</h4><span>{fmt(fb.created_at?.slice(0,10))}</span></div>
              <div className="stars" style={{display:"inline-flex",gap:2,color:"var(--amber)"}}>{Array.from({length:fb.nota||0}).map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div>
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
      toast("Cliente de e-mail aberto para envio!");
      setReplyTxt("");
    }

    return (
      <div>
        <div className="dash-title"><Mail size={20}/> Fale Conosco</div>
        <div className="dash-sub">{naoLidas > 0 ? `${naoLidas} mensagem(ns) não lida(s)` : "Todas as mensagens foram lidas"}</div>
        {loading ? <Loading kind="cards" rows={3} /> : <>
          {msgSel ? (
            <div className="panel">
              <button className="btn btn-outline btn-sm" style={{marginBottom:"1.25rem"}} onClick={()=>{setMsgSel(null);setReplyTxt("");}}><ArrowLeft size={14} style={{verticalAlign:"-2px"}}/> Voltar para caixa de entrada</button>
              {/* Cabeçalho da mensagem */}
              <div style={{background:"var(--bg-warm)",borderRadius:"var(--r-sm)",padding:"1rem 1.25rem",marginBottom:"1rem"}}>
                <div style={{fontFamily:"var(--font-head)",fontSize:17,fontWeight:800,color:"var(--ink)",marginBottom:6}}>{msgSel.assunto}</div>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,color:"var(--ink-3)",display:"inline-flex",alignItems:"center",gap:4}}><User size={13}/> <strong>{msgSel.nome}</strong></span>
                  <span style={{fontSize:13,color:"var(--teal)",display:"inline-flex",alignItems:"center",gap:4}}><Mail size={13}/> {msgSel.email}</span>
                  {msgSel.matricula && <span style={{fontSize:13,color:"var(--ink-3)",display:"inline-flex",alignItems:"center",gap:4}}><GraduationCap size={13}/> Matrícula: {msgSel.matricula}</span>}
                  <span style={{fontSize:12,color:"var(--ink-3)",display:"inline-flex",alignItems:"center",gap:4}}><Clock size={12}/> {msgSel.created_at ? new Date(msgSel.created_at).toLocaleString("pt-BR") : ""}</span>
                </div>
              </div>
              {/* Corpo da mensagem */}
              <div style={{background:"var(--bg-warm)",borderRadius:"var(--r-sm)",padding:"1.25rem",fontSize:14.5,color:"var(--ink-2)",lineHeight:1.75,whiteSpace:"pre-wrap",marginBottom:"1.5rem",borderLeft:"3px solid var(--border-2)"}}>
                {msgSel.mensagem}
              </div>
              {/* Campo de resposta */}
              <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.25rem"}}>
                <div style={{fontFamily:"var(--font-head)",fontSize:14,fontWeight:700,color:"var(--ink)",marginBottom:10,display:"flex",alignItems:"center",gap:6}}><PenLine size={14}/> Responder para {msgSel.nome}</div>
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
                  <Mail size={14} style={{verticalAlign:"-2px"}}/> Abrir e-mail para enviar resposta
                </button>
              </div>
            </div>
          ) : (
            mensagens.length===0
              ? <EmptyState icon={<Mail size={34}/>} title="Nenhuma mensagem recebida" subtitle="Mensagens enviadas pelo formulário Fale Conosco do site aparecerão aqui." />
              : <>
                <SearchBox value={buscaUsuarios} onChange={setBuscaUsuarios} placeholder="Buscar por nome, assunto ou e-mail..." />
                {(() => {
                  const term = buscaUsuarios.toLowerCase();
                  const filtradas = mensagens.filter(m => !term
                    || m.nome.toLowerCase().includes(term)
                    || m.assunto.toLowerCase().includes(term)
                    || m.email.toLowerCase().includes(term)
                  );
                  if (filtradas.length===0) return <EmptyState icon={<Search size={34}/>} title="Nenhum resultado" subtitle="Tente buscar por outro termo." />;
                  return filtradas.map(m=>(
                    <div className={`msg-card ${!m.lida?"unread":""}`} key={m.id} onClick={()=>marcarMsgLida(m)}>
                      <div className="msg-card-hdr">
                        <div className="msg-card-from">{m.nome}{!m.lida&&<span className="notif-count">Nova</span>}</div>
                        <div className="msg-card-time">{m.created_at ? new Date(m.created_at).toLocaleDateString("pt-BR") : ""}</div>
                      </div>
                      <div className="msg-card-subject">{m.assunto}</div>
                      <div className="msg-card-preview">{m.mensagem}</div>
                    </div>
                  ));
                })()}
              </>
          )}
        </>}
      </div>
    );
  }

  return (
    <div>
      <div className="dash-title">Olá, {profile.nome.split(" ")[0]}!</div>
      <div className="dash-sub">Painel de supervisão e administração da clínica</div>
      <ConfirmModal config={confirmCfg} onClose={() => setConfirmCfg(null)} />
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

        {/* Checklist de primeiros passos */}
        {(() => {
          const psicPend = usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length;
          const supPend = usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length;
          const agPend = todos.filter(a=>a.status==="pendente").length;
          const msgPend = mensagens.filter(m=>!m.lida).length;
          const psicAtivos = psicos.filter(p=>!p.status||p.status==="ativo").length;
          const items = [
            { done: supPend===0, label: supPend>0 ? `Aprovar ${supPend} supervisor(es) pendente(s)` : "Supervisores aprovados", aba:"usuarios" },
            { done: psicPend===0, label: psicPend>0 ? `Ativar ${psicPend} psicólogo(s) pendente(s)` : "Psicólogos avaliados", aba:"usuarios" },
            { done: psicAtivos>0, label: psicAtivos>0 ? "Há psicólogos ativos para atender" : "Ativar ao menos um psicólogo", aba:"usuarios" },
            { done: agPend===0, label: agPend>0 ? `Revisar ${agPend} agendamento(s) pendente(s)` : "Agendamentos em dia", aba:"gerenciar" },
            { done: msgPend===0, label: msgPend>0 ? `Responder ${msgPend} mensagem(ns) do Fale Conosco` : "Mensagens respondidas", aba:"mensagens" },
          ];
          const pendentes = items.filter(i=>!i.done);
          if (pendentes.length===0) return null;
          const totalDone = items.filter(i=>i.done).length;
          return (
            <div className="panel">
              <div className="panel-title"><CheckCircle2 size={16}/> Primeiros passos ({totalDone}/{items.length} concluídos)</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {items.map((it,i)=>(
                  <div key={i} onClick={()=>!it.done && setAba(it.aba)} style={{
                    display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
                    borderRadius:"var(--r-sm)",background:it.done?"var(--green-bg)":"var(--bg-warm)",
                    cursor:it.done?"default":"pointer",opacity:it.done?.7:1,
                    border:`1px solid ${it.done?"transparent":"var(--border)"}`,
                  }}>
                    <span style={{display:"flex",color:it.done?"var(--green)":"var(--ink-3)"}}>{it.done?<CheckCircle2 size={16}/>:<Circle size={16}/>}</span>
                    <span style={{fontSize:13.5,color:"var(--ink)",flex:1,textDecoration:it.done?"line-through":"none"}}>{it.label}</span>
                    {!it.done && <span style={{fontSize:12,color:"var(--teal)",fontWeight:600}}>Resolver <ArrowRight size={12} style={{verticalAlign:"-2px"}}/></span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Supervisores pendentes no início */}
        {usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length>0 && (
          <div className="panel" style={{borderColor:"var(--amber)",borderWidth:2}}>
            <div className="panel-title" style={{color:"var(--amber)"}}><Hourglass size={14} style={{verticalAlign:"-2px"}}/> Supervisores aguardando aprovação ({usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").length})</div>
            {usuarios.filter(u=>u.tipo==="supervisor"&&u.status==="pendente_aprovacao").map(u=>(
              <div className="user-card" key={u.id}>
                <div className="user-card-left">
                  <div className="user-av-sm" style={{background:"var(--purple)"}}>{u.nome[0]}</div>
                  <div><div className="user-info-name">{u.nome}</div><div className="user-info-sub">{u.email} · Supervisor(a)</div></div>
                </div>
                <div className="user-card-actions">
                  <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}><CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> Aprovar</button>
                  <button className="btn btn-sm btn-danger"  onClick={()=>setStatusUsuario(u.id,"inativo")}><XCircle size={14} style={{verticalAlign:"-2px"}}/> Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Psicólogos pendentes no início */}
        {usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length>0 && (
          <div className="panel" style={{borderColor:"var(--teal)",borderWidth:2}}>
            <div className="panel-title" style={{color:"var(--teal)"}}><Hourglass size={14} style={{verticalAlign:"-2px"}}/> Psicólogos aguardando ativação ({usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").length})</div>
            {usuarios.filter(u=>u.tipo==="psicologo"&&u.status==="pendente_aprovacao").map(u=>(
              <div className="user-card" key={u.id}>
                <div className="user-card-left">
                  <div className="user-av-sm" style={{background:"var(--teal)"}}>{u.nome[0]}</div>
                  <div><div className="user-info-name">{u.nome}</div><div className="user-info-sub">{u.email}{u.crp&&` · CRP: ${u.crp}`}</div></div>
                </div>
                <div className="user-card-actions">
                  <button className="btn btn-sm btn-success" onClick={()=>setStatusUsuario(u.id,"ativo")}><CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> Ativar para atender</button>
                  <button className="btn btn-sm btn-danger"  onClick={()=>setStatusUsuario(u.id,"inativo")}><XCircle size={14} style={{verticalAlign:"-2px"}}/> Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {todos.filter(a=>a.status==="pendente").length>0 && (
          <div className="panel">
            <div className="panel-title"><Hourglass size={16}/> Pendentes de aprovação</div>
            <div className="tw"><table>
              <thead><tr><th>Data</th><th>Hora</th><th>Paciente</th><th>Psicólogo</th><th>Ações</th></tr></thead>
              <tbody>{todos.filter(a=>a.status==="pendente").slice(0,5).map(a=>(
                <tr key={a.id}>
                  <td>{fmt(a.data)}</td><td>{fmtH(a.hora)}</td><td>{a.paciente_nome||"—"}</td><td>{a.psicologo_nome||"—"}</td>
                  <td style={{display:"flex",gap:6}}>
                    <button className="btn btn-sm btn-success" onClick={()=>atualizar(a.id,"confirmado")}><CheckCircle2 size={14} style={{verticalAlign:"-2px"}}/> Confirmar</button>
                    <button className="btn btn-sm btn-danger"  onClick={()=>pedirCancelamentoAg(a)}><XCircle size={14} style={{verticalAlign:"-2px"}}/> Cancelar</button>
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
            {todos.filter(a=>a.status==="pendente").length>5 && (
              <button className="load-more-btn" onClick={() => setAba("gerenciar")}>Ver todos os {todos.filter(a=>a.status==="pendente").length} pendentes <ArrowRight size={13} style={{verticalAlign:"-2px"}}/></button>
            )}
          </div>
        )}
        {psicos.length>0 && (
          <div className="panel">
            <div className="panel-title"><BarChart3 size={16}/> Resumo por psicólogo</div>
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
