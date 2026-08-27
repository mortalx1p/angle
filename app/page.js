"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Radar, Flame, Sparkles, Target, TrendingUp, Save, Wand2, FileText,
  BarChart3, Settings, Search, Filter, X, ChevronRight, ChevronDown, Play,
  Check, Copy, ArrowRight, Zap, Eye, MessageCircle, Share2, Heart, Clock,
  Tag, Plus, Trash2, RefreshCw, ShieldCheck, Layers, BookOpen, Trophy,
  Award, Loader2, ArrowLeft, AlertTriangle, Instagram, Youtube, Music2,
  GitBranch, Gauge, LayoutGrid, ListFilter, SlidersHorizontal, Lightbulb,
  CircleDot, TrendingDown, Minus, Info
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   bg #0A0A0C / surface #121317 / surface-2 #1A1B20 / border #24262C
   text #EDEEF1 / dim #8A8D97 / amber(signal) #F5A623 / violet(angle) #8B7CF6
   winner #34D399 / loser #F87171
   ============================================================ */

const COLORS = {
  bg: "#0A0A0C",
  surface: "#121317",
  surface2: "#1A1B20",
  border: "#24262C",
  text: "#EDEEF1",
  dim: "#8A8D97",
  amber: "#F5A623",
  violet: "#8B7CF6",
  win: "#34D399",
  lose: "#F87171",
};

/* ============================================================
   STATIC REFERENCE DATA
   ============================================================ */

const ANGLE_CATEGORIES = [
  {
    id: "insider", name: "Insider POV", icon: "eye",
    desc: "Perspective earned through direct exposure — testing, comparing, researching. Never fabricated credentials.",
    examples: [
      "I spent 7 days testing this — here's what nobody tells beginners.",
      "I compared the top 5 so you don't have to.",
      "I went down a rabbit hole on this. Here's what I found.",
      "I asked people who actually use this daily.",
    ],
  },
  {
    id: "bought", name: "What I Bought / Used", icon: "shopping",
    desc: "Curated recommendation format built around personal use, not employer claims.",
    examples: [
      "Things I started using recently.",
      "Things that were actually worth it.",
      "Things I wish I bought sooner.",
      "Things I stopped wasting money on.",
    ],
  },
  {
    id: "everyone", name: "What Everyone's Doing", icon: "trend",
    desc: "Social-proof / FOMO framing around a genuine rising pattern.",
    examples: [
      "Here's what people are using right now.",
      "The thing everyone suddenly started talking about.",
      "Most searched this week.",
      "Things that are blowing up right now.",
    ],
  },
  {
    id: "wishiknew", name: "Things I Wish I Knew", icon: "lightbulb",
    desc: "Retrospective regret framing — mistakes and hindsight.",
    examples: [
      "Things I wish I knew before trying this.",
      "Mistakes I made.",
      "Things nobody warned me about.",
      "What I would do differently.",
    ],
  },
  {
    id: "broke", name: "Broke But Smart", icon: "target",
    desc: "Budget-conscious framing. No unrealistic financial claims.",
    examples: [
      "If money is tight, watch this.",
      "How I'd handle this with a tiny budget.",
      "Things I stopped paying full price for.",
      "How I made my budget stretch further.",
    ],
  },
  {
    id: "honest", name: "Honest Review", icon: "check",
    desc: "Skeptic-to-convert arc. Truthful premise, no fabricated results.",
    examples: [
      "My honest opinion after 7 days.",
      "I wanted to hate this.",
      "Is this actually worth it?",
      "What surprised me after trying it.",
    ],
  },
  {
    id: "storytime", name: "Storytime", icon: "book",
    desc: "Narrative arc with a real, truthful premise and a discovery beat.",
    examples: [
      "I genuinely thought this was a scam until...",
      "I accidentally found this while looking for something else.",
      "This started because I was trying to solve one problem...",
      "The biggest mistake I made was...",
    ],
  },
  {
    id: "showtell", name: "Show, Don't Tell", icon: "play",
    desc: "Visual-first — the process is the proof, not a claim.",
    examples: [
      "Screen recording of the process.",
      "Before / after.",
      "The search process.",
      "Comparison + checkout walkthrough.",
    ],
  },
  {
    id: "personspecific", name: "Person-Specific", icon: "target2",
    desc: "Direct address to a defined identity segment.",
    examples: [
      "If you're a student, save this.",
      "Parents, check this before you spend money.",
      "If you work 9–5 and don't have much free time...",
      "If you're completely new to this...",
    ],
  },
  {
    id: "list", name: "List Content", icon: "list",
    desc: "Structured, scannable, high-completion format.",
    examples: [
      "3 things you should know.",
      "5 things I would avoid.",
      "7 things nobody tells you.",
      "3 mistakes to avoid.",
    ],
  },
];

const RAGEBAIT_LAYERS = [
  { id: "contrarian", name: "Contrarian", ex: "Everyone keeps telling you to do this. I think that's terrible advice." },
  { id: "callout", name: "Call-Out", ex: "If you're still doing this, you're making it harder than it needs to be." },
  { id: "controversial", name: "Controversial Opinion", ex: "Unpopular opinion: most people are approaching this completely backwards." },
  { id: "expose", name: "Expose", ex: "Nobody explains this part." },
  { id: "skeptic", name: "Skeptic", ex: "I thought this was nonsense until I tested it." },
  { id: "fomo", name: "FOMO", ex: "People are already doing this and most beginners haven't noticed." },
  { id: "mystery", name: "Mystery", ex: "I found something I wasn't even looking for." },
  { id: "unexpected", name: "Unexpected", ex: "This was the last thing I expected to happen." },
  { id: "confession", name: "Confession", ex: "I probably shouldn't admit this, but..." },
  { id: "challenge", name: "Challenge", ex: "I gave myself 7 days to see if this actually works." },
];

const TRIGGERS = ["Curiosity", "Rage", "FOMO", "Surprise", "Social Proof", "Status", "Relatability", "Controversy", "Mystery", "Aspiration", "Problem/Solution"];
const CONTENT_TYPES = ["Storytime", "List", "Review", "POV", "Tutorial", "Reaction", "Confession", "Experiment", "Comparison", "Discovery", "Insider", "Challenge", "Product Showcase"];

const PLATFORM_ICON = { tiktok: Music2, instagram: Instagram, youtube: Youtube };

function seedViral() {
  const now = Date.now();
  const day = 86400000;
  const items = [
    { topic: "Things I bought for under $50 that actually get used", creator: "@dailyfindsco", platform: "tiktok", views: 2400000, likes: 312000, comments: 8900, shares: 41000, posted: now - 2*day, type: "List", trigger: "Curiosity", hook: "Nobody talks about", hookText: "Things I bought for under $50 that I actually still use.", velocity: 420, replicability: 94, cpa: 91, saturation: 22 },
    { topic: "I compared 6 budgeting apps for a month", creator: "@spendsmartly", platform: "tiktok", views: 890000, likes: 61000, comments: 3400, shares: 5200, posted: now - 1*day, type: "Comparison", trigger: "Problem/Solution", hook: "I tested", hookText: "I used 6 budgeting apps for 30 days so you don't have to.", velocity: 310, replicability: 88, cpa: 96, saturation: 18 },
    { topic: "Unpopular opinion about morning routines", creator: "@realtalkrae", platform: "tiktok", views: 5100000, likes: 640000, comments: 22000, shares: 51000, posted: now - 5*day, type: "Reaction", trigger: "Controversy", hook: "Contrarian", hookText: "Unpopular opinion: your morning routine is making you less productive.", velocity: 180, replicability: 72, cpa: 58, saturation: 61 },
    { topic: "Things nobody tells you about your first apartment", creator: "@movedout", platform: "instagram", views: 1200000, likes: 98000, comments: 4100, shares: 15000, posted: now - 3*day, type: "List", trigger: "Relatability", hook: "Things I wish I knew", hookText: "3 things nobody tells you before you move out.", velocity: 260, replicability: 90, cpa: 80, saturation: 30 },
    { topic: "I accidentally found a better way to track expenses", creator: "@quietlyrich", platform: "tiktok", views: 670000, likes: 54000, comments: 2100, shares: 6800, posted: now - 12*3600000, type: "Storytime", trigger: "Mystery", hook: "Mystery", hookText: "I accidentally found this while looking for something completely different.", velocity: 540, replicability: 91, cpa: 89, saturation: 9 },
    { topic: "Everyone is switching to this right now", creator: "@trendwatch", platform: "tiktok", views: 3300000, likes: 410000, comments: 15000, shares: 62000, posted: now - 1.5*day, type: "Discovery", trigger: "FOMO", hook: "What everyone is buying", hookText: "Everyone I know switched to this and didn't tell me.", velocity: 610, replicability: 76, cpa: 68, saturation: 44 },
    { topic: "I gave myself 7 days to fix my spending habits", creator: "@brokebutbetter", platform: "tiktok", views: 1800000, likes: 190000, comments: 7600, shares: 21000, posted: now - 4*day, type: "Challenge", trigger: "Curiosity", hook: "I tested", hookText: "I gave myself 7 days to fix my spending. Here's what happened.", velocity: 290, replicability: 93, cpa: 94, saturation: 15 },
    { topic: "Honest review after using this for a month", creator: "@skepticalsarah", platform: "tiktok", views: 540000, likes: 39000, comments: 2900, shares: 3100, posted: now - 8*3600000, type: "Review", trigger: "Social Proof", hook: "I wanted to hate this", hookText: "I wanted to hate this. A month later, here's my honest take.", velocity: 380, replicability: 87, cpa: 85, saturation: 27 },
    { topic: "Stop doing this if you're trying to save money", creator: "@moneymindedmax", platform: "instagram", views: 950000, likes: 71000, comments: 3300, shares: 8900, posted: now - 6*3600000, type: "POV", trigger: "Rage", hook: "Stop doing", hookText: "Stop doing this if you're actually trying to save money.", velocity: 470, replicability: 82, cpa: 88, saturation: 20 },
    { topic: "If you're a student, save this before spending anything", creator: "@campuslifehacks", platform: "tiktok", views: 720000, likes: 58000, comments: 2200, shares: 9100, posted: now - 2.5*day, type: "List", trigger: "Relatability", hook: "Insider", hookText: "If you're a student, save this before you spend another dollar.", velocity: 220, replicability: 96, cpa: 90, saturation: 12 },
    { topic: "The checkout process everyone skips", creator: "@quietsavings", platform: "youtube", views: 410000, likes: 22000, comments: 1400, shares: 2700, posted: now - 3.5*day, type: "Discovery", trigger: "Curiosity", hook: "Nobody talks about", hookText: "The one step in checkout almost everyone skips.", velocity: 160, replicability: 85, cpa: 79, saturation: 25 },
    { topic: "What surprised me after trying this for 2 weeks", creator: "@twoweektrial", platform: "tiktok", views: 1100000, likes: 88000, comments: 3900, shares: 11000, posted: now - 1*day, type: "Experiment", trigger: "Surprise", hook: "Unexpected result", hookText: "What surprised me after doing this for 2 weeks straight.", velocity: 450, replicability: 89, cpa: 87, saturation: 17 },
  ];
  return items.map((it, i) => ({
    id: "v" + i,
    ...it,
    engagement: (((it.likes + it.comments + it.shares) / it.views) * 100),
  }));
}

/* ============================================================
   HELPERS
   ============================================================ */

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}
function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }

const LS_KEYS = {
  offers: "aie_offers",
  library: "aie_library",
  savedViral: "aie_saved_viral",
  extracted: "aie_extracted_angles",
};
function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ============================================================
   CLAUDE API CALL
   ============================================================ */

async function callClaude(system, user, maxTokens = 1800) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.error?.message || "API request failed");
  }
  const textBlock = (data.content || []).find((b) => b.type === "text");
  let text = textBlock ? textBlock.text : "";
  text = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    throw new Error("Could not parse AI response");
  }
}

const COMPLIANCE_RULES = `Hard compliance rules that must never be violated:
- Never fabricate earnings, screenshots, testimonials, employment, credentials, results, customer experiences, or product claims.
- Never invent fake job titles or insider positions the user hasn't stated. If no real insider position, use legitimate alternatives like "I spent 7 days testing", "I compared", "I asked people who actually use this".
- No unrealistic financial claims.
- Ragebait and strong opinions are allowed and encouraged, but must rest on a truthful premise — high curiosity and emotion without misinformation.
- Never produce a direct copy of source content (no reused scripts, captions, footage descriptions, or creator identity). Only the underlying transferable mechanism may be reused.
- CTAs must be natural creator language, never "Download now!" or "Click my link to make money!" — use lines like "I put the exact thing I used in my bio."`;

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */

function ScoreRing({ value, size = 44, label, colorOverride }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value || 0));
  const offset = c - (pct / 100) * c;
  const color = colorOverride || (pct >= 80 ? COLORS.win : pct >= 55 ? COLORS.amber : COLORS.lose);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={COLORS.border} strokeWidth="4" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontFamily: "monospace", fontSize: size > 40 ? 13 : 11, fontWeight: 700, color: COLORS.text }}>{Math.round(pct)}</span>
      </div>
      {label && <div style={{ position: "absolute", top: size + 2, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: COLORS.dim, whiteSpace: "nowrap", letterSpacing: 0.4 }}>{label}</div>}
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  const tones = {
    default: { bg: COLORS.surface2, color: COLORS.dim, border: COLORS.border },
    amber: { bg: "rgba(245,166,35,0.12)", color: COLORS.amber, border: "rgba(245,166,35,0.3)" },
    violet: { bg: "rgba(139,124,246,0.12)", color: COLORS.violet, border: "rgba(139,124,246,0.3)" },
    win: { bg: "rgba(52,211,153,0.12)", color: COLORS.win, border: "rgba(52,211,153,0.3)" },
    lose: { bg: "rgba(248,113,113,0.12)", color: COLORS.lose, border: "rgba(248,113,113,0.3)" },
  };
  const t = tones[tone];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: t.bg, color: t.color, border: `1px solid ${t.border}`, whiteSpace: "nowrap", letterSpacing: 0.2 }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "default", size = "md", icon: Icon, disabled, full, style }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    fontWeight: 600, borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent", transition: "all 0.15s ease", opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto", whiteSpace: "nowrap",
  };
  const sizes = { sm: { padding: "6px 10px", fontSize: 12 }, md: { padding: "9px 14px", fontSize: 13 }, lg: { padding: "12px 20px", fontSize: 14 } };
  const variants = {
    default: { background: COLORS.surface2, color: COLORS.text, borderColor: COLORS.border },
    primary: { background: COLORS.amber, color: "#1A1200" },
    violet: { background: COLORS.violet, color: "#fff" },
    ghost: { background: "transparent", color: COLORS.dim, borderColor: "transparent" },
    outline: { background: "transparent", color: COLORS.text, borderColor: COLORS.border },
    danger: { background: "transparent", color: COLORS.lose, borderColor: "rgba(248,113,113,0.3)" },
  };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = "brightness(1.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}>
      {Icon && <Icon size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

function Card({ children, style, hoverable, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12,
      padding: 16, transition: "border-color 0.15s ease, transform 0.15s ease",
      cursor: onClick ? "pointer" : "default", ...style,
    }}
    onMouseEnter={(e) => { if (hoverable) { e.currentTarget.style.borderColor = "#38393f"; } }}
    onMouseLeave={(e) => { if (hoverable) { e.currentTarget.style.borderColor = COLORS.border; } }}>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, color: COLORS.dim, marginBottom: 6, fontWeight: 600, letterSpacing: 0.3 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8,
  padding: "9px 11px", color: COLORS.text, fontSize: 13, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
};

function Input(props) { return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />; }
function TextArea(props) { return <textarea {...props} style={{ ...inputStyle, resize: "vertical", minHeight: 70, ...(props.style || {}) }} />; }
function Select({ value, onChange, options, style }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: "pointer", ...style }}>
      {options.map((o) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
      border: `1px solid ${active ? COLORS.amber : COLORS.border}`,
      background: active ? "rgba(245,166,35,0.12)" : "transparent",
      color: active ? COLORS.amber : COLORS.dim, transition: "all 0.15s ease",
    }}>{children}</button>
  );
}

function EmptyState({ icon: Icon, title, sub, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.dim }}>
      <Icon size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
      <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, marginBottom: action ? 16 : 0 }}>{sub}</div>
      {action}
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 200,
      background: COLORS.surface2, border: `1px solid ${toast.error ? "rgba(248,113,113,0.4)" : "rgba(52,211,153,0.4)"}`,
      color: COLORS.text, padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      animation: "slideUp 0.2s ease",
    }}>
      {toast.error ? <AlertTriangle size={15} color={COLORS.lose} /> : <Check size={15} color={COLORS.win} />}
      {toast.msg}
    </div>
  );
}

function GenealogyTrail({ steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, fontSize: 11, fontFamily: "monospace", color: COLORS.dim }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <span style={{
            padding: "3px 8px", borderRadius: 5,
            background: s.active ? "rgba(245,166,35,0.12)" : COLORS.surface2,
            color: s.active ? COLORS.amber : COLORS.dim,
            border: `1px solid ${s.active ? "rgba(245,166,35,0.3)" : COLORS.border}`,
          }}>{s.label}</span>
          {i < steps.length - 1 && <ChevronRight size={11} style={{ opacity: 0.4 }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [offers, setOffers] = useState(() => loadLS(LS_KEYS.offers, []));
  const [activeOfferId, setActiveOfferId] = useState(() => (loadLS(LS_KEYS.offers, [])[0]?.id) || null);
  const [library, setLibrary] = useState(() => loadLS(LS_KEYS.library, []));
  const [savedViralIds, setSavedViralIds] = useState(() => loadLS(LS_KEYS.savedViral, []));
  const [extracted, setExtracted] = useState(() => loadLS(LS_KEYS.extracted, []));
  const [viral] = useState(seedViral());
  const [toast, setToast] = useState(null);
  const [workflowItem, setWorkflowItem] = useState(null);

  useEffect(() => saveLS(LS_KEYS.offers, offers), [offers]);
  useEffect(() => saveLS(LS_KEYS.library, library), [library]);
  useEffect(() => saveLS(LS_KEYS.savedViral, savedViralIds), [savedViralIds]);
  useEffect(() => saveLS(LS_KEYS.extracted, extracted), [extracted]);

  const showToast = useCallback((msg, error) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const activeOffer = offers.find((o) => o.id === activeOfferId) || null;

  function addToLibrary(item) {
    setLibrary((l) => [{ id: uid(), createdAt: Date.now(), status: "draft", ...item }, ...l]);
    showToast("Saved to Content Library");
  }

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "radar", label: "Viral Radar", icon: Radar },
    { id: "angles", label: "Angles", icon: Layers },
    { id: "hooklab", label: "Hook Lab", icon: Zap },
    { id: "scriptstudio", label: "Script Studio", icon: FileText },
    { id: "offers", label: "Offers", icon: Target },
    { id: "library", label: "Content Library", icon: BookOpen },
    { id: "performance", label: "Performance", icon: BarChart3 },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: COLORS.bg, color: COLORS.text, minHeight: "100vh", display: "flex",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        @keyframes slideUp { from { opacity:0; transform: translate(-50%,10px);} to {opacity:1; transform: translate(-50%,0);} }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid ${COLORS.amber}; outline-offset: 1px;
        }
        @media (max-width: 900px) {
          .aie-sidebar { display: none !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="aie-sidebar" style={{ width: 220, borderRight: `1px solid ${COLORS.border}`, padding: "20px 14px", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 26 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${COLORS.amber}, ${COLORS.violet})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Radar size={16} color="#0A0A0C" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13.5, letterSpacing: -0.2 }}>Angle Engine</div>
            <div style={{ fontSize: 9.5, color: COLORS.dim, fontFamily: "monospace", letterSpacing: 0.5 }}>VIRAL INTELLIGENCE</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8,
              background: tab === n.id ? COLORS.surface2 : "transparent",
              color: tab === n.id ? COLORS.text : COLORS.dim, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: tab === n.id ? 600 : 500, textAlign: "left",
              borderLeft: tab === n.id ? `2px solid ${COLORS.amber}` : "2px solid transparent",
            }}>
              <n.icon size={16} />
              {n.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 11, color: COLORS.dim, padding: "0 10px", marginBottom: 8 }}>
            Active offer
          </div>
          {activeOffer ? (
            <div style={{ padding: "8px 10px", background: COLORS.surface2, borderRadius: 8, fontSize: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeOffer.name}</div>
              <div style={{ color: COLORS.dim, fontSize: 11 }}>{activeOffer.category}</div>
            </div>
          ) : (
            <button onClick={() => setTab("offers")} style={{ fontSize: 12, color: COLORS.amber, background: "none", border: "none", cursor: "pointer", padding: "0 10px" }}>+ Set up an offer</button>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, padding: "24px 28px 60px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        {tab === "dashboard" && <Dashboard viral={viral} library={library} offers={offers} setTab={setTab} openWorkflow={setWorkflowItem} />}
        {tab === "radar" && <ViralRadar viral={viral} savedViralIds={savedViralIds} setSavedViralIds={setSavedViralIds} openWorkflow={setWorkflowItem} showToast={showToast} />}
        {tab === "angles" && <AnglesLibrary extracted={extracted} library={library} />}
        {tab === "hooklab" && <HookLab activeOffer={activeOffer} addToLibrary={addToLibrary} showToast={showToast} />}
        {tab === "scriptstudio" && <ScriptStudio activeOffer={activeOffer} addToLibrary={addToLibrary} showToast={showToast} />}
        {tab === "offers" && <OffersPage offers={offers} setOffers={setOffers} activeOfferId={activeOfferId} setActiveOfferId={setActiveOfferId} showToast={showToast} />}
        {tab === "library" && <ContentLibrary library={library} setLibrary={setLibrary} showToast={showToast} />}
        {tab === "performance" && <Performance library={library} />}
      </div>

      {workflowItem && (
        <WorkflowModal
          item={workflowItem}
          offers={offers}
          activeOfferId={activeOfferId}
          onClose={() => setWorkflowItem(null)}
          addToLibrary={addToLibrary}
          setExtracted={setExtracted}
          showToast={showToast}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function Dashboard({ viral, library, offers, setTab, openWorkflow }) {
  const metrics = [
    { label: "Viral Ideas Found", value: viral.length, icon: Radar },
    { label: "Angles Saved", value: library.filter((l) => l.type === "angle").length, icon: Layers },
    { label: "Scripts Generated", value: library.filter((l) => l.type === "script").length, icon: FileText },
    { label: "Winning Angles", value: library.filter((l) => l.status === "winner").length, icon: Trophy },
    { label: "Avg Hook Score", value: (() => {
      const hooks = library.filter((l) => l.hookScore != null);
      if (!hooks.length) return "—";
      return Math.round(hooks.reduce((a, b) => a + b.hookScore, 0) / hooks.length);
    })(), icon: Gauge },
    { label: "Content Tested", value: library.filter((l) => l.status === "testing" || l.status === "winner" || l.status === "loser").length, icon: BarChart3 },
  ];

  const topViral = [...viral].sort((a, b) => b.velocity - a.velocity).slice(0, 3);

  const bestAngles = ANGLE_CATEGORIES.slice(0, 4).map((c, i) => ({
    name: c.name, score: [87, 82, 78, 74][i] || 70,
  }));

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.4 }}>Dashboard</h1>
        <p style={{ color: COLORS.dim, fontSize: 13, marginTop: 4 }}>Find what's already working. Understand the angle. Build your own version.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 26 }}>
        {metrics.map((m) => (
          <Card key={m.label}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <m.icon size={16} color={COLORS.dim} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>{m.value}</div>
            <div style={{ fontSize: 11.5, color: COLORS.dim, marginTop: 2 }}>{m.label}</div>
          </Card>
        ))}
      </div>

      <Card style={{ background: `linear-gradient(120deg, rgba(245,166,35,0.08), rgba(139,124,246,0.06))`, marginBottom: 26, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Sparkles size={16} color={COLORS.amber} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Generate From Trend</span>
            </div>
            <div style={{ color: COLORS.dim, fontSize: 13, maxWidth: 480 }}>Choose a viral video → extract the angle → adapt to your offer → generate 10 executions. Under 2 minutes.</div>
          </div>
          <Btn variant="primary" icon={ArrowRight} onClick={() => setTab("radar")}>Open Viral Radar</Btn>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 6 }}><Flame size={16} color={COLORS.amber} /> Viral Right Now</h3>
            <button onClick={() => setTab("radar")} style={{ fontSize: 12, color: COLORS.amber, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topViral.map((v) => (
              <ViralCard key={v.id} v={v} compact openWorkflow={openWorkflow} saved={false} onSave={() => {}} />
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}><Trophy size={16} color={COLORS.amber} /> Your Best Angles</h3>
          <Card>
            {offers.length === 0 && library.length === 0 ? (
              <div style={{ fontSize: 12.5, color: COLORS.dim, lineHeight: 1.6 }}>
                Once you test content, your best-performing angle categories will rank here. For now, here's the category baseline from the Angle Library.
              </div>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: offers.length === 0 ? 12 : 0 }}>
              {bestAngles.map((a) => (
                <div key={a.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }}>{a.name}</span>
                    <span style={{ fontFamily: "monospace", color: COLORS.dim }}>{a.score}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 4, background: COLORS.surface2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${a.score}%`, background: `linear-gradient(90deg, ${COLORS.amber}, ${COLORS.violet})`, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VIRAL RADAR
   ============================================================ */

function ViralCard({ v, compact, openWorkflow, saved, onSave }) {
  const PIcon = PLATFORM_ICON[v.platform] || Music2;
  return (
    <Card hoverable style={{ display: "flex", gap: 14, padding: 14 }}>
      <div style={{
        width: compact ? 56 : 80, height: compact ? 56 : 80, borderRadius: 10, flexShrink: 0,
        background: `linear-gradient(135deg, ${COLORS.violet}33, ${COLORS.amber}33)`,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
      }}>
        <PIcon size={compact ? 20 : 26} color={COLORS.text} style={{ opacity: 0.8 }} />
        <div style={{ position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", animation: "scan 3s infinite linear" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: COLORS.dim, fontFamily: "monospace" }}>{v.creator}</span>
          <span style={{ fontSize: 11, color: COLORS.dim }}>· {timeAgo(v.posted)}</span>
          {v.velocity > 400 && <Badge tone="amber">↑ {v.velocity}% velocity</Badge>}
        </div>
        <div style={{ fontWeight: 600, fontSize: compact ? 13 : 14, marginBottom: 6, lineHeight: 1.35 }}>{v.hookText}</div>
        {!compact && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            <Badge>{v.type}</Badge>
            <Badge tone="violet">{v.trigger}</Badge>
          </div>
        )}
        <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: COLORS.dim, fontFamily: "monospace", marginBottom: compact ? 0 : 10, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} />{fmtNum(v.views)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart size={12} />{fmtNum(v.likes)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={12} />{fmtNum(v.comments)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Share2 size={12} />{fmtNum(v.shares)}</span>
          <span>{v.engagement.toFixed(1)}% eng.</span>
        </div>
        {!compact && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn size="sm" variant="primary" icon={Sparkles} onClick={() => openWorkflow(v)}>Analyze</Btn>
            <Btn size="sm" variant="outline" icon={Wand2} onClick={() => openWorkflow(v)}>Extract Angle</Btn>
            <Btn size="sm" variant={saved ? "default" : "ghost"} icon={saved ? Check : Save} onClick={onSave}>{saved ? "Saved" : "Save"}</Btn>
          </div>
        )}
      </div>
      {compact && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
          <Btn size="sm" variant="primary" icon={Sparkles} onClick={() => openWorkflow(v)}>Analyze</Btn>
        </div>
      )}
    </Card>
  );
}

function ViralRadar({ viral, savedViralIds, setSavedViralIds, openWorkflow, showToast }) {
  const [sortBy, setSortBy] = useState("viral");
  const [minViews, setMinViews] = useState(0);
  const [contentType, setContentType] = useState("all");
  const [search, setSearch] = useState("");

  let list = viral.filter((v) =>
    v.views >= minViews &&
    (contentType === "all" || v.type === contentType) &&
    (search === "" || v.topic.toLowerCase().includes(search.toLowerCase()) || v.hookText.toLowerCase().includes(search.toLowerCase()))
  );

  const sorters = {
    viral: (a, b) => b.views - a.views,
    growing: (a, b) => b.velocity - a.velocity,
    engagement: (a, b) => b.engagement - a.engagement,
    recent: (a, b) => b.posted - a.posted,
    replicable: (a, b) => b.replicability - a.replicability,
  };
  list = [...list].sort(sorters[sortBy]);

  function toggleSave(id) {
    setSavedViralIds((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
    showToast(savedViralIds.includes(id) ? "Removed from saved" : "Saved viral source");
  }

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", padding: 22, marginBottom: 20, background: `radial-gradient(circle at 20% 20%, rgba(245,166,35,0.12), transparent 55%), radial-gradient(circle at 80% 80%, rgba(139,124,246,0.12), transparent 55%)`, border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Radar size={18} color={COLORS.amber} />
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Viral Radar</h1>
        </div>
        <p style={{ color: COLORS.dim, fontSize: 13, margin: 0 }}>Discover viral content worth reverse-engineering — not copying.</p>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: COLORS.dim }} />
          <Input placeholder="Search topic or hook..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 30 }} />
        </div>
        <Select value={sortBy} onChange={setSortBy} options={[
          { value: "viral", label: "Sort: Most Viral" },
          { value: "growing", label: "Sort: Fastest Growing" },
          { value: "engagement", label: "Sort: Highest Engagement" },
          { value: "recent", label: "Sort: Most Recent" },
          { value: "replicable", label: "Sort: Most Replicable" },
        ]} style={{ width: 200 }} />
        <Select value={contentType} onChange={setContentType} options={[{ value: "all", label: "All formats" }, ...CONTENT_TYPES.map((t) => ({ value: t, label: t }))]} style={{ width: 150 }} />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {[0, 500000, 1000000, 2000000].map((v) => (
          <Pill key={v} active={minViews === v} onClick={() => setMinViews(v)}>{v === 0 ? "Any views" : `${fmtNum(v)}+ views`}</Pill>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((v) => (
          <ViralCard key={v.id} v={v} openWorkflow={openWorkflow} saved={savedViralIds.includes(v.id)} onSave={() => toggleSave(v.id)} />
        ))}
        {list.length === 0 && <EmptyState icon={Radar} title="No results" sub="Try loosening your filters." />}
      </div>
    </div>
  );
}

/* ============================================================
   WORKFLOW MODAL — Analyze → Extract Angle → Adapt → Hooks → Script
   ============================================================ */

function WorkflowModal({ item, offers, activeOfferId, onClose, addToLibrary, setExtracted, showToast }) {
  const [step, setStep] = useState("analyze"); // analyze -> angles -> offer -> hooks -> script
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [angles, setAngles] = useState(null);
  const [chosenAngle, setChosenAngle] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(activeOfferId);
  const [adaptation, setAdaptation] = useState(null);
  const [hooks, setHooks] = useState(null);
  const [chosenHook, setChosenHook] = useState(null);
  const [script, setScript] = useState(null);
  const ranAnalysis = useRef(false);

  const selectedOffer = offers.find((o) => o.id === selectedOfferId);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const result = await callClaude(
        `You are a viral content intelligence analyst for a CPA/affiliate marketing tool. You analyze WHY content went viral — never suggest copying it. Respond with ONLY valid JSON, no markdown fences, matching this exact shape:
{"hook":"string - what happens in first 1-3 seconds","curiosityGap":"string","emotionalTrigger":"string","patternInterrupt":"string","audience":"string","retentionMechanism":"string","payoff":"string","commentTrigger":"string","shareTrigger":"string","replicability":"string - can this be adapted to other niches, explain briefly","scores":{"hook":0-100,"curiosity":0-100,"retention":0-100,"engagement":0-100,"replicability":0-100,"cpaAdaptability":0-100}}`,
        `Analyze this viral post:\nTopic: ${item.topic}\nHook/opening line: "${item.hookText}"\nContent type: ${item.type}\nPsychological trigger: ${item.trigger}\nPlatform: ${item.platform}\nViews: ${item.views}, Engagement rate: ${item.engagement.toFixed(1)}%, Velocity: ${item.velocity}%`
      );
      setAnalysis(result);
    } catch (e) {
      showToast("Analysis failed — try again", true);
    } finally {
      setLoading(false);
    }
  }, [item, showToast]);

  useEffect(() => {
    if (!ranAnalysis.current) {
      ranAnalysis.current = true;
      runAnalysis();
    }
  }, [runAnalysis]);

  async function runExtractAngle() {
    setLoading(true);
    try {
      const result = await callClaude(
        `You are an angle extraction engine. Given a viral video's SOURCE CONTENT, identify the UNDERLYING TRANSFERABLE ANGLE (the reusable content concept, stripped of the specific creator/product/story) and its CONTENT STRUCTURE (how it's presented). Then generate 10 NEW EXECUTIONS — original ideas across different categories that use the same psychological mechanism but are NOT copies. Categories to draw from: ${ANGLE_CATEGORIES.map((c) => c.name).join(", ")}.
${COMPLIANCE_RULES}
Respond with ONLY valid JSON:
{"sourceContent":"string - what the original creator actually made","underlyingAngle":"string - the transferable concept","contentStructure":"string - how it was presented","newExecutions":[{"category":"string","angle":"string - the new angle title","description":"string - one sentence"}]} — newExecutions must have exactly 10 items.`,
        `Source viral content:\nTopic: ${item.topic}\nHook: "${item.hookText}"\nType: ${item.type}\nTrigger: ${item.trigger}`
      );
      setAngles(result);
      setExtracted((prev) => [{ id: uid(), sourceId: item.id, sourceTopic: item.topic, createdAt: Date.now(), ...result }, ...prev]);
      setStep("angles");
    } catch (e) {
      showToast("Angle extraction failed — try again", true);
    } finally {
      setLoading(false);
    }
  }

  async function runAdapt() {
    if (!selectedOffer) { showToast("Select an offer first", true); return; }
    setLoading(true);
    try {
      const result = await callClaude(
        `You are a CPA offer adaptation engine. Take a transferable content angle and adapt it to a specific CPA offer, preserving the psychological mechanism, content structure, curiosity pattern and emotional trigger — but replacing the original product, story, claims and wording with content relevant to the new offer. Never produce a direct copy of source content.
${COMPLIANCE_RULES}
Only use claims within "allowedClaims" and avoid anything in "forbiddenClaims". Respond with ONLY valid JSON:
{"adaptedConcept":"string - the new content concept in 2-3 sentences","openingLine":"string - a natural opening line","whyItFits":"string - one sentence on why this mechanism fits the offer","ctaStyle":"string - example natural CTA line, not salesy"}`,
        `Angle category: ${chosenAngle.category}\nAngle: ${chosenAngle.angle}\nDescription: ${chosenAngle.description}\nUnderlying mechanism: ${angles.underlyingAngle}\nContent structure: ${angles.contentStructure}\n\nOffer:\nName: ${selectedOffer.name}\nCategory: ${selectedOffer.category}\nAudience: ${selectedOffer.audience}\nDesired action: ${selectedOffer.action}\nMain benefit: ${selectedOffer.benefit}\nAllowed claims: ${selectedOffer.allowedClaims}\nForbidden claims: ${selectedOffer.forbiddenClaims}`
      );
      setAdaptation(result);
      setStep("offer-result");
    } catch (e) {
      showToast("Adaptation failed — try again", true);
    } finally {
      setLoading(false);
    }
  }

  async function runHooks() {
    setLoading(true);
    try {
      const result = await callClaude(
        `You generate scroll-stopping video hooks (opening 1-3 second lines) for CPA/affiliate content creators. Hooks must sound like a real creator talking, not an ad.
${COMPLIANCE_RULES}
Respond with ONLY valid JSON: {"hooks":[{"text":"string","score":0-100,"why":"string - one sentence explaining the score"}]} with exactly 5 items.`,
        `Generate 5 hooks for this adapted content concept:\n${adaptation.adaptedConcept}\nOpening line reference: ${adaptation.openingLine}\nOffer: ${selectedOffer.name} (${selectedOffer.category})\nAudience: ${selectedOffer.audience}`
      );
      setHooks(result.hooks);
      setStep("hooks");
    } catch (e) {
      showToast("Hook generation failed — try again", true);
    } finally {
      setLoading(false);
    }
  }

  async function runScript() {
    setLoading(true);
    try {
      const result = await callClaude(
        `You are a short-form video script generator for CPA/affiliate marketers. Produce a natural, native-feeling creator script/execution plan.
${COMPLIANCE_RULES}
Respond with ONLY valid JSON:
{"hook":"string","visual":"string - what appears on screen","dialogue":"string - what the creator says, full script","bRoll":"string - suggested footage","textOverlay":"string - on-screen text","retentionBeat":"string - where the next curiosity point is introduced","reveal":"string - what gets revealed","cta":"string - natural CTA line","duration":"15s | 30s | 45s | 60s"}`,
        `Build a full execution using this hook: "${chosenHook.text}"\nAdapted concept: ${adaptation.adaptedConcept}\nAngle category: ${chosenAngle.category}\nOffer: ${selectedOffer.name}\nCTA style reference: ${adaptation.ctaStyle}\nAudience: ${selectedOffer.audience}`
      );
      setScript(result);
      setStep("script");
    } catch (e) {
      showToast("Script generation failed — try again", true);
    } finally {
      setLoading(false);
    }
  }

  function saveEverything() {
    addToLibrary({
      type: "script",
      title: chosenHook.text,
      category: chosenAngle.category,
      angle: chosenAngle.angle,
      offerName: selectedOffer?.name,
      hookScore: chosenHook.score,
      script,
      sourceTopic: item.topic,
      tags: [chosenAngle.category, item.trigger],
    });
    onClose();
  }

  const trailSteps = [
    { label: "Viral Source", active: step === "analyze" },
    { label: "Analysis", active: step === "analyze" && analysis },
    { label: "Angle", active: step === "angles" },
    { label: "Adaptation", active: step === "offer-result" },
    { label: "Hook", active: step === "hooks" },
    { label: "Script", active: step === "script" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fadeIn 0.15s ease" }}>
      <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 16, maxWidth: 780, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.topic}</div>
            <GenealogyTrail steps={trailSteps} />
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.dim, cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div style={{ padding: 20, overflowY: "auto" }}>
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 0", color: COLORS.dim, gap: 10 }}>
              <Loader2 size={22} className="spin" style={{ animation: "pulse 1.2s infinite" }} />
              <div style={{ fontSize: 13 }}>Thinking...</div>
            </div>
          )}

          {!loading && step === "analyze" && analysis && (
            <div>
              <SectionTitle icon={Sparkles} title="Why This Went Viral" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 10, marginBottom: 18 }}>
                {Object.entries(analysis.scores || {}).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                    <ScoreRing value={v} label={k.replace(/([A-Z])/g, " $1").toUpperCase()} />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                {[
                  ["Hook", analysis.hook], ["Curiosity Gap", analysis.curiosityGap],
                  ["Emotional Trigger", analysis.emotionalTrigger], ["Pattern Interrupt", analysis.patternInterrupt],
                  ["Audience", analysis.audience], ["Retention Mechanism", analysis.retentionMechanism],
                  ["Payoff", analysis.payoff], ["Comment Trigger", analysis.commentTrigger],
                  ["Share Trigger", analysis.shareTrigger], ["Replicability", analysis.replicability],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: COLORS.dim, fontWeight: 700, marginBottom: 3, letterSpacing: 0.3 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{val}</div>
                  </div>
                ))}
              </div>
              <Btn variant="primary" icon={Wand2} onClick={runExtractAngle} full>Extract Angle</Btn>
            </div>
          )}

          {!loading && step === "angles" && angles && (
            <div>
              <SectionTitle icon={GitBranch} title="Angle Extraction" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                <MiniBlock label="SOURCE CONTENT" text={angles.sourceContent} />
                <MiniBlock label="UNDERLYING ANGLE" text={angles.underlyingAngle} tone="amber" />
                <MiniBlock label="CONTENT STRUCTURE" text={angles.contentStructure} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.dim, marginBottom: 8, letterSpacing: 0.3 }}>10 NEW EXECUTIONS — choose one</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {angles.newExecutions.map((e, i) => (
                  <Card key={i} hoverable onClick={() => setChosenAngle(e)} style={{
                    padding: 12, cursor: "pointer",
                    borderColor: chosenAngle === e ? COLORS.amber : COLORS.border,
                    background: chosenAngle === e ? "rgba(245,166,35,0.06)" : COLORS.surface,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <Badge tone="violet">{e.category}</Badge>
                      {chosenAngle === e && <Check size={13} color={COLORS.amber} />}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{e.angle}</div>
                    <div style={{ fontSize: 12, color: COLORS.dim }}>{e.description}</div>
                  </Card>
                ))}
              </div>
              <Btn variant="primary" icon={ArrowRight} full disabled={!chosenAngle} onClick={() => setStep("offer")}>Continue with selected angle</Btn>
            </div>
          )}

          {!loading && step === "offer" && (
            <div>
              <SectionTitle icon={Target} title="Adapt To My Offer" />
              {offers.length === 0 ? (
                <EmptyState icon={Target} title="No offers yet" sub="Set up an offer first so the adaptation can be tailored to it." />
              ) : (
                <>
                  <Field label="Choose offer">
                    <Select value={selectedOfferId || ""} onChange={setSelectedOfferId} options={offers.map((o) => ({ value: o.id, label: o.name }))} />
                  </Field>
                  <Btn variant="primary" icon={Wand2} full onClick={runAdapt}>Adapt to this offer</Btn>
                </>
              )}
            </div>
          )}

          {!loading && step === "offer-result" && adaptation && (
            <div>
              <SectionTitle icon={Target} title="Adapted Concept" />
              <Card style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 10 }}>{adaptation.adaptedConcept}</div>
                <div style={{ fontSize: 12, color: COLORS.dim, marginBottom: 4 }}>OPENING LINE</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>"{adaptation.openingLine}"</div>
                <div style={{ fontSize: 12, color: COLORS.dim, marginBottom: 4 }}>WHY IT FITS</div>
                <div style={{ fontSize: 12.5, marginBottom: 10 }}>{adaptation.whyItFits}</div>
                <div style={{ fontSize: 12, color: COLORS.dim, marginBottom: 4 }}>NATURAL CTA STYLE</div>
                <div style={{ fontSize: 12.5, fontStyle: "italic" }}>"{adaptation.ctaStyle}"</div>
              </Card>
              <Btn variant="primary" icon={Zap} full onClick={runHooks}>Generate 5 Hooks</Btn>
            </div>
          )}

          {!loading && step === "hooks" && hooks && (
            <div>
              <SectionTitle icon={Zap} title="Choose a Hook" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {hooks.map((h, i) => (
                  <Card key={i} hoverable onClick={() => setChosenHook(h)} style={{
                    padding: 12, display: "flex", gap: 12, alignItems: "center", cursor: "pointer",
                    borderColor: chosenHook === h ? COLORS.amber : COLORS.border,
                    background: chosenHook === h ? "rgba(245,166,35,0.06)" : COLORS.surface,
                  }}>
                    <ScoreRing value={h.score} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>"{h.text}"</div>
                      <div style={{ fontSize: 11.5, color: COLORS.dim }}>{h.why}</div>
                    </div>
                    {chosenHook === h && <Check size={15} color={COLORS.amber} />}
                  </Card>
                ))}
              </div>
              <Btn variant="primary" icon={FileText} full disabled={!chosenHook} onClick={runScript}>Generate Full Execution</Btn>
            </div>
          )}

          {!loading && step === "script" && script && (
            <div>
              <SectionTitle icon={FileText} title="Content Execution" />
              <Card style={{ marginBottom: 14 }}>
                {[
                  ["Hook", script.hook], ["Visual", script.visual], ["Dialogue", script.dialogue],
                  ["B-Roll", script.bRoll], ["Text Overlay", script.textOverlay],
                  ["Retention Beat", script.retentionBeat], ["Reveal", script.reveal],
                  ["CTA", script.cta], ["Duration", script.duration],
                ].map(([label, val]) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: COLORS.dim, fontWeight: 700, letterSpacing: 0.3, marginBottom: 2 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{val}</div>
                  </div>
                ))}
              </Card>
              <Btn variant="primary" icon={Save} full onClick={saveEverything}>Save to Content Library</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
      <Icon size={16} color={COLORS.amber} />
      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{title}</span>
    </div>
  );
}
function MiniBlock({ label, text, tone }) {
  return (
    <div style={{ padding: 10, borderRadius: 8, background: tone === "amber" ? "rgba(245,166,35,0.08)" : COLORS.surface2, border: `1px solid ${tone === "amber" ? "rgba(245,166,35,0.25)" : COLORS.border}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: tone === "amber" ? COLORS.amber : COLORS.dim, marginBottom: 4, letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 12, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

/* ============================================================
   ANGLE LIBRARY
   ============================================================ */

function AnglesLibrary({ extracted, library }) {
  const [active, setActive] = useState(null);
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Angle Library</h1>
      <p style={{ color: COLORS.dim, fontSize: 13, marginBottom: 20 }}>10 reusable angle categories, plus every angle you've extracted from viral sources.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginBottom: 28 }}>
        {ANGLE_CATEGORIES.map((c) => (
          <Card key={c.id} hoverable onClick={() => setActive(active === c.id ? null : c.id)}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: COLORS.dim, lineHeight: 1.5, marginBottom: active === c.id ? 10 : 0 }}>{c.desc}</div>
            {active === c.id && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8, paddingTop: 10, borderTop: `1px solid ${COLORS.border}` }}>
                {c.examples.map((ex, i) => (
                  <div key={i} style={{ fontSize: 11.5, color: COLORS.text, background: COLORS.surface2, padding: "6px 8px", borderRadius: 6 }}>"{ex}"</div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}><GitBranch size={16} color={COLORS.violet} /> Extracted From Viral Sources</h3>
      {extracted.length === 0 ? (
        <EmptyState icon={GitBranch} title="No angles extracted yet" sub="Go to Viral Radar and click Extract Angle on a trending post." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {extracted.map((e) => (
            <Card key={e.id}>
              <div style={{ fontSize: 11, color: COLORS.dim, marginBottom: 6 }}>Extracted from: <span style={{ color: COLORS.text }}>{e.sourceTopic}</span> · {timeAgo(e.createdAt)}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{e.underlyingAngle}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {e.newExecutions?.slice(0, 4).map((ne, i) => <Badge key={i} tone="violet">{ne.category}</Badge>)}
                {e.newExecutions?.length > 4 && <Badge>+{e.newExecutions.length - 4} more</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   HOOK LAB
   ============================================================ */

function HookLab({ activeOffer, addToLibrary, showToast }) {
  const [category, setCategory] = useState(ANGLE_CATEGORIES[0].id);
  const [trigger, setTrigger] = useState("");
  const [rage, setRage] = useState([]);
  const [count, setCount] = useState(10);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  function toggleRage(id) {
    setRage((r) => r.includes(id) ? r.filter((x) => x !== id) : [...r, id]);
  }

  async function generate() {
    if (!topic.trim()) { showToast("Describe the topic or offer first", true); return; }
    setLoading(true);
    setResults(null);
    try {
      const catObj = ANGLE_CATEGORIES.find((c) => c.id === category);
      const result = await callClaude(
        `You generate scroll-stopping short-form video hooks for CPA/affiliate marketers. Each hook is a single opening line (1-3 seconds of spoken content).
${COMPLIANCE_RULES}
Respond with ONLY valid JSON: {"hooks":[{"text":"string","score":0-100,"why":"string one sentence"}]} with exactly ${Math.min(count, 25)} items.`,
        `Topic/offer: ${topic}\nAngle category: ${catObj.name} — ${catObj.desc}\n${trigger ? `Psychological trigger: ${trigger}\n` : ""}${rage.length ? `Ragebait layers to weave in: ${rage.map((r) => RAGEBAIT_LAYERS.find((x) => x.id === r).name).join(", ")}\n` : ""}${activeOffer ? `Offer audience: ${activeOffer.audience}` : ""}`,
        2500
      );
      setResults(result.hooks);
    } catch (e) {
      showToast("Hook generation failed — try again", true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Hook Lab</h1>
      <p style={{ color: COLORS.dim, fontSize: 13, marginBottom: 20 }}>Generate and score batches of opening hooks.</p>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <Card>
          <Field label="Topic / offer context">
            <TextArea placeholder="e.g. budgeting app for people paid biweekly" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </Field>
          <Field label="Angle category">
            <Select value={category} onChange={setCategory} options={ANGLE_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} />
          </Field>
          <Field label="Psychological trigger (optional)">
            <Select value={trigger} onChange={setTrigger} options={[{ value: "", label: "Any" }, ...TRIGGERS]} />
          </Field>
          <Field label="Ragebait layers (optional)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {RAGEBAIT_LAYERS.map((r) => <Pill key={r.id} active={rage.includes(r.id)} onClick={() => toggleRage(r.id)}>{r.name}</Pill>)}
            </div>
          </Field>
          <Field label="How many">
            <div style={{ display: "flex", gap: 6 }}>
              {[10, 25].map((n) => <Pill key={n} active={count === n} onClick={() => setCount(n)}>{n} hooks</Pill>)}
            </div>
          </Field>
          <Btn variant="primary" icon={loading ? Loader2 : Zap} full onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Hooks"}</Btn>
        </Card>

        <div>
          {loading && <EmptyState icon={Zap} title="Scoring hooks..." sub="This usually takes a few seconds." />}
          {!loading && !results && <EmptyState icon={Zap} title="No hooks yet" sub="Fill in the panel and generate your first batch." />}
          {!loading && results && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {results.map((h, i) => (
                <Card key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12 }}>
                  <ScoreRing value={h.score} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>"{h.text}"</div>
                    <div style={{ fontSize: 11.5, color: COLORS.dim }}>{h.why}</div>
                  </div>
                  <Btn size="sm" variant="ghost" icon={Save} onClick={() => addToLibrary({ type: "hook", title: h.text, hookScore: h.score, category: ANGLE_CATEGORIES.find((c) => c.id === category).name, tags: [] })} />
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SCRIPT STUDIO
   ============================================================ */

function ScriptStudio({ activeOffer, addToLibrary, showToast }) {
  const [category, setCategory] = useState(ANGLE_CATEGORIES[0].id);
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [audience, setAudience] = useState(activeOffer?.audience || "");
  const [length, setLength] = useState("30s");
  const [platform, setPlatform] = useState("TikTok");
  const [tone, setTone] = useState("Casual / relatable");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [organicLoading, setOrganicLoading] = useState(false);

  async function generate() {
    if (!topic.trim()) { showToast("Describe the topic or offer first", true); return; }
    setLoading(true);
    setScript(null);
    try {
      const catObj = ANGLE_CATEGORIES.find((c) => c.id === category);
      const result = await callClaude(
        `You are a short-form video script generator for CPA/affiliate marketers, producing native, non-ad-feeling creator content.
${COMPLIANCE_RULES}
Respond with ONLY valid JSON:
{"hook":"string","setup":"string","curiosity":"string - the information gap introduced","storyOrDemo":"string","reveal":"string","cta":"string","hookScore":0-100,"hookScoreWhy":"string"}`,
        `Topic/offer: ${topic}\nAngle category: ${catObj.name} — ${catObj.desc}\nPsychological trigger: ${trigger}\nAudience: ${audience || "general"}\nLength: ${length}\nPlatform: ${platform}\nTone: ${tone}`,
        1800
      );
      setScript(result);
    } catch (e) {
      showToast("Script generation failed — try again", true);
    } finally {
      setLoading(false);
    }
  }

  async function makeOrganic() {
    if (!script) return;
    setOrganicLoading(true);
    try {
      const result = await callClaude(
        `You review short-form video scripts for CPA marketers and rewrite them to feel like native creator content. Identify sales language, excessive claims, repetitive CTAs, product-first openings, corporate wording, unrealistic promises, and over-explanation — then rewrite to remove them while preserving the same claims/compliance boundaries (never add new claims).
${COMPLIANCE_RULES}
Respond with ONLY valid JSON with the SAME shape as input: {"hook":"string","setup":"string","curiosity":"string","storyOrDemo":"string","reveal":"string","cta":"string","hookScore":0-100,"hookScoreWhy":"string","issuesFound":["string"]}`,
        `Rewrite this script to feel less like an ad:\n${JSON.stringify(script)}`,
        1800
      );
      setScript(result);
    } catch (e) {
      showToast("Rewrite failed — try again", true);
    } finally {
      setOrganicLoading(false);
    }
  }

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Script Studio</h1>
      <p style={{ color: COLORS.dim, fontSize: 13, marginBottom: 20 }}>Build a full hook → setup → curiosity → reveal → CTA script from scratch.</p>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <Card>
          <Field label="Topic / offer context">
            <TextArea placeholder="What is this content about?" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </Field>
          <Field label="Category"><Select value={category} onChange={setCategory} options={ANGLE_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} /></Field>
          <Field label="Psychological trigger"><Select value={trigger} onChange={setTrigger} options={TRIGGERS} /></Field>
          <Field label="Audience"><Input placeholder="e.g. students, new parents" value={audience} onChange={(e) => setAudience(e.target.value)} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Length"><Select value={length} onChange={setLength} options={["15s", "30s", "45s", "60s"]} /></Field>
            <Field label="Platform"><Select value={platform} onChange={setPlatform} options={["TikTok", "Instagram Reels", "YouTube Shorts"]} /></Field>
          </div>
          <Field label="Tone"><Select value={tone} onChange={setTone} options={["Casual / relatable", "Confident / punchy", "Skeptical / analytical", "Warm / storyteller"]} /></Field>
          <Btn variant="primary" icon={loading ? Loader2 : FileText} full onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Script"}</Btn>
        </Card>

        <div>
          {loading && <EmptyState icon={FileText} title="Writing script..." sub="Building hook, structure, and reveal." />}
          {!loading && !script && <EmptyState icon={FileText} title="No script yet" sub="Fill in the panel to generate your first script." />}
          {!loading && script && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${COLORS.border}` }}>
                <ScoreRing value={script.hookScore} size={44} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Hook Score: {script.hookScore}/100</div>
                  <div style={{ fontSize: 12, color: COLORS.dim }}>{script.hookScoreWhy}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="outline" icon={organicLoading ? Loader2 : Wand2} onClick={makeOrganic} disabled={organicLoading}>{organicLoading ? "Rewriting..." : "Make Organic"}</Btn>
                  <Btn size="sm" variant="primary" icon={Save} onClick={() => { addToLibrary({ type: "script", title: script.hook, hookScore: script.hookScore, category: ANGLE_CATEGORIES.find((c) => c.id === category).name, script, tags: [trigger] }); }}>Save</Btn>
                </div>
              </div>
              {script.issuesFound && script.issuesFound.length > 0 && (
                <div style={{ marginBottom: 12, padding: 10, borderRadius: 8, background: "rgba(139,124,246,0.08)", border: `1px solid rgba(139,124,246,0.25)` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.violet, marginBottom: 4 }}>ISSUES FIXED</div>
                  <div style={{ fontSize: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {script.issuesFound.map((iss, i) => <Badge key={i} tone="violet">{iss}</Badge>)}
                  </div>
                </div>
              )}
              {[["Hook", script.hook], ["Setup", script.setup], ["Curiosity Gap", script.curiosity], ["Story / Demo", script.storyOrDemo], ["Reveal", script.reveal], ["CTA", script.cta]].map(([label, val]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: COLORS.dim, fontWeight: 700, letterSpacing: 0.3, marginBottom: 2 }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.55 }}>{val}</div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   OFFERS
   ============================================================ */

function emptyOffer() {
  return { id: uid(), name: "", category: "", audience: "", action: "", geo: "", benefit: "", allowedClaims: "", forbiddenClaims: "", landingPage: "", conversionEvent: "", brandRestrictions: "", complianceNotes: "" };
}

function OffersPage({ offers, setOffers, activeOfferId, setActiveOfferId, showToast }) {
  const [draft, setDraft] = useState(emptyOffer());
  const [editing, setEditing] = useState(false);

  function save() {
    if (!draft.name.trim()) { showToast("Give the offer a name", true); return; }
    setOffers((o) => {
      const exists = o.find((x) => x.id === draft.id);
      return exists ? o.map((x) => x.id === draft.id ? draft : x) : [draft, ...o];
    });
    if (!activeOfferId) setActiveOfferId(draft.id);
    setDraft(emptyOffer());
    setEditing(false);
    showToast("Offer saved");
  }

  function edit(o) { setDraft(o); setEditing(true); }
  function del(id) {
    setOffers((o) => o.filter((x) => x.id !== id));
    if (activeOfferId === id) setActiveOfferId(null);
  }

  const fields = [
    ["name", "Offer name"], ["category", "Offer category"], ["audience", "Target audience"],
    ["action", "Desired action"], ["geo", "Geographic market"], ["benefit", "Main benefit"],
    ["allowedClaims", "Allowed claims"], ["forbiddenClaims", "Forbidden claims"],
    ["landingPage", "Landing page URL"], ["conversionEvent", "Conversion event"],
    ["brandRestrictions", "Brand restrictions"], ["complianceNotes", "Compliance notes"],
  ];

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Offers</h1>
      <p style={{ color: COLORS.dim, fontSize: 13, marginBottom: 20 }}>Define an offer so generated content knows what it's promoting — and what it can't claim.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{editing ? "Edit offer" : "New offer"}</div>
          {fields.map(([key, label]) => (
            <Field key={key} label={label}>
              {key === "allowedClaims" || key === "forbiddenClaims" || key === "complianceNotes" ? (
                <TextArea value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
              ) : (
                <Input value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
              )}
            </Field>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" icon={Save} onClick={save} full>{editing ? "Update Offer" : "Save Offer"}</Btn>
            {editing && <Btn variant="ghost" onClick={() => { setDraft(emptyOffer()); setEditing(false); }}>Cancel</Btn>}
          </div>
        </Card>

        <div>
          {offers.length === 0 ? (
            <EmptyState icon={Target} title="No offers yet" sub="Add your first CPA offer to unlock adaptations and angle matching." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {offers.map((o) => (
                <Card key={o.id} style={{ borderColor: o.id === activeOfferId ? COLORS.amber : COLORS.border }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{o.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.dim }}>{o.category} · {o.audience}</div>
                    </div>
                    {o.id === activeOfferId && <Badge tone="amber">Active</Badge>}
                  </div>
                  <div style={{ fontSize: 12.5, marginTop: 8, color: COLORS.text }}>{o.benefit}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {o.id !== activeOfferId && <Btn size="sm" variant="outline" onClick={() => setActiveOfferId(o.id)}>Set Active</Btn>}
                    <Btn size="sm" variant="ghost" onClick={() => edit(o)}>Edit</Btn>
                    <Btn size="sm" variant="danger" icon={Trash2} onClick={() => del(o.id)}>Delete</Btn>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {offers.length > 0 && (
            <Card style={{ marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <ShieldCheck size={15} color={COLORS.violet} />
                <span style={{ fontWeight: 700, fontSize: 13 }}>Angle Match Recommendations</span>
              </div>
              <div style={{ fontSize: 12, color: COLORS.dim, marginBottom: 10 }}>Suggested categories for your active offer (heuristic — refine as you test).</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Storytime", 94], ["Broke But Smart", 91], ["Honest Review", 88], ["Show Don't Tell", 85],
                ].map(([n, s]) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{n}</span>
                    <span style={{ fontSize: 11.5, fontFamily: "monospace", color: COLORS.dim }}>{s}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONTENT LIBRARY
   ============================================================ */

const STATUS_OPTS = ["draft", "posted", "testing", "winner", "loser"];
const STATUS_TONE = { draft: "default", posted: "violet", testing: "amber", winner: "win", loser: "lose" };

function ContentLibrary({ library, setLibrary, showToast }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState(null);

  const filtered = library.filter((l) =>
    (filterType === "all" || l.type === filterType) &&
    (filterStatus === "all" || l.status === filterStatus) &&
    (search === "" || (l.title || "").toLowerCase().includes(search.toLowerCase()))
  );

  function updateItem(id, patch) {
    setLibrary((lib) => lib.map((l) => l.id === id ? { ...l, ...patch } : l));
  }
  function removeItem(id) {
    setLibrary((lib) => lib.filter((l) => l.id !== id));
    setDetail(null);
    showToast("Removed from library");
  }

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Content Library</h1>
      <p style={{ color: COLORS.dim, fontSize: 13, marginBottom: 20 }}>Every saved angle, hook, and script — plus performance tracking.</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: COLORS.dim }} />
          <Input placeholder="Search saved content..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 30 }} />
        </div>
        <Select value={filterType} onChange={setFilterType} options={[{ value: "all", label: "All types" }, { value: "hook", label: "Hooks" }, { value: "script", label: "Scripts" }, { value: "angle", label: "Angles" }]} style={{ width: 140 }} />
        <Select value={filterStatus} onChange={setFilterStatus} options={[{ value: "all", label: "All statuses" }, ...STATUS_OPTS.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))]} style={{ width: 150 }} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="Nothing saved yet" sub="Save hooks and scripts from Hook Lab, Script Studio, or Viral Radar." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((l) => (
            <Card key={l.id} hoverable onClick={() => setDetail(l)} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {l.hookScore != null && <ScoreRing value={l.hookScore} size={36} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                <div style={{ fontSize: 11.5, color: COLORS.dim, display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                  <span style={{ textTransform: "capitalize" }}>{l.type}</span>
                  {l.category && <>· {l.category}</>}
                  · {timeAgo(l.createdAt)}
                </div>
              </div>
              <Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge>
            </Card>
          ))}
        </div>
      )}

      {detail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setDetail(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 16, maxWidth: 620, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{detail.title}</div>
                <div style={{ fontSize: 12, color: COLORS.dim }}>{detail.type} · {detail.category}</div>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", color: COLORS.dim, cursor: "pointer" }}><X size={18} /></button>
            </div>

            <Field label="Status">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STATUS_OPTS.map((s) => <Pill key={s} active={detail.status === s} onClick={() => { updateItem(detail.id, { status: s }); setDetail({ ...detail, status: s }); }}>{s}</Pill>)}
              </div>
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {["views", "likes", "comments", "shares", "saves", "clicks", "leads", "cpa", "epc"].map((metric) => (
                <Field key={metric} label={metric.toUpperCase()}>
                  <Input type="number" value={detail.metrics?.[metric] ?? ""} onChange={(e) => {
                    const metrics = { ...(detail.metrics || {}), [metric]: e.target.value };
                    updateItem(detail.id, { metrics });
                    setDetail({ ...detail, metrics });
                  }} />
                </Field>
              ))}
            </div>

            {detail.script && (
              <Card style={{ marginBottom: 12 }}>
                {Object.entries(detail.script).filter(([k]) => k !== "issuesFound").map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10.5, color: COLORS.dim, fontWeight: 700, letterSpacing: 0.3 }}>{k.replace(/([A-Z])/g, " $1").toUpperCase()}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{String(v)}</div>
                  </div>
                ))}
              </Card>
            )}

            <Btn variant="danger" icon={Trash2} onClick={() => removeItem(detail.id)}>Remove from library</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PERFORMANCE
   ============================================================ */

function Performance({ library }) {
  const tested = library.filter((l) => ["testing", "winner", "loser"].includes(l.status));
  const winners = library.filter((l) => l.status === "winner");

  const byCategory = {};
  tested.forEach((l) => {
    const cat = l.category || "Uncategorized";
    if (!byCategory[cat]) byCategory[cat] = { total: 0, winners: 0 };
    byCategory[cat].total += 1;
    if (l.status === "winner") byCategory[cat].winners += 1;
  });
  const catRows = Object.entries(byCategory).map(([cat, v]) => ({ cat, rate: v.total ? Math.round((v.winners / v.total) * 100) : 0, total: v.total }))
    .sort((a, b) => b.rate - a.rate);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Performance</h1>
      <p style={{ color: COLORS.dim, fontSize: 13, marginBottom: 20 }}>Track what you've posted and let winners guide your next angles.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>
        <Card><div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>{tested.length}</div><div style={{ fontSize: 11.5, color: COLORS.dim }}>Content Tested</div></Card>
        <Card><div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", color: COLORS.win }}>{winners.length}</div><div style={{ fontSize: 11.5, color: COLORS.dim }}>Winners</div></Card>
        <Card><div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>{tested.length ? Math.round((winners.length / tested.length) * 100) : 0}%</div><div style={{ fontSize: 11.5, color: COLORS.dim }}>Win Rate</div></Card>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Win Rate by Category</h3>
      {catRows.length === 0 ? (
        <EmptyState icon={BarChart3} title="No tested content yet" sub="Mark items as testing, winner, or loser in your Content Library to see intelligence here." />
      ) : (
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {catRows.map((r) => (
              <div key={r.cat}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>{r.cat}</span>
                  <span style={{ fontFamily: "monospace", color: COLORS.dim }}>{r.rate}% ({r.total} tested)</span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: COLORS.surface2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${r.rate}%`, background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.amber})`, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
          {catRows.length > 1 && (
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "rgba(245,166,35,0.08)", border: `1px solid rgba(245,166,35,0.25)`, fontSize: 12.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Info size={14} color={COLORS.amber} style={{ marginTop: 1, flexShrink: 0 }} />
              <span>Your <strong>{catRows[0].cat}</strong> angles are outperforming the rest at a {catRows[0].rate}% win rate. Lean into that category in Hook Lab and Script Studio.</span>
            </div>
          )}
        </Card>
      )}

      {winners.length > 0 && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "24px 0 12px" }}>Winners</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {winners.map((w) => (
              <Card key={w.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Trophy size={16} color={COLORS.win} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{w.title}</div>
                  <div style={{ fontSize: 11.5, color: COLORS.dim }}>{w.category}</div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
