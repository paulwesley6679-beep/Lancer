import { useState, useEffect, useRef } from "react";

// ── AI ───────────────────────────────────────────────────────────────────────
const AI = async (system, user) => {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.choices?.[0]?.message?.content || "";
};

// ── HOOKS ────────────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 11, go = false) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!go) { setOut(""); return; }
    setOut(""); let i = 0;
    const t = setInterval(() => {
      if (i < text.length) { setOut(text.slice(0, ++i)); }
      else clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, go]);
  return out;
}

function useCount(n, ms = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof n !== "number") { setV(n); return; }
    const s = Date.now();
    const f = () => {
      const p = Math.min((Date.now() - s) / ms, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * n));
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [n]);
  return v;
}

// ── COMPONENTS ───────────────────────────────────────────────────────────────
const Spin = () => (
  <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #e8632220", borderTopColor: "#e86322", borderRadius: "50%", animation: "spin .7s linear infinite", verticalAlign: "middle", marginRight: 8 }} />
);

const Cursor = () => <span style={{ animation: "blink 1s step-end infinite", opacity: .7 }}>▌</span>;

const Av = ({ l, c, s = 38 }) => (
  <div style={{ width: s, height: s, borderRadius: s * .28, background: c + "22", border: `1.5px solid ${c}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: s * .38, fontWeight: 800, color: c, flexShrink: 0 }}>{l}</div>
);

const Heat = ({ v }) => {
  const c = v >= 80 ? "#e86322" : v >= 60 ? "#f0c832" : "#64748b";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ flex: 1, height: 3, background: "#1e293b", borderRadius: 2 }}>
        <div style={{ width: `${v}%`, height: "100%", background: c, borderRadius: 2, transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: 10, color: c, fontWeight: 700, minWidth: 26 }}>{v}%</span>
    </div>
  );
};

// ── DATA ─────────────────────────────────────────────────────────────────────
const LEADS = [
  { id: 1, name: "Nova Creative Studio", platform: "Instagram", heat: 94, signal: "Posted about rebranding 2 days ago and mentioned budget", avatar: "N", clr: "#e86322" },
  { id: 2, name: "Jade & Co. Marketing", platform: "LinkedIn", heat: 79, signal: "Just hired a marketing manager — content needs incoming", avatar: "J", clr: "#22c9a0" },
  { id: 3, name: "Rukkus Media Group", platform: "Facebook", heat: 71, signal: "Actively seeking content creators in their business group", avatar: "R", clr: "#8b6ef7" },
  { id: 4, name: "Bloom Wellness", platform: "Instagram", heat: 88, signal: "Launching new product line — needs packaging design ASAP", avatar: "B", clr: "#e84393" },
  { id: 5, name: "Theo Builds", platform: "Twitter/X", heat: 43, signal: "Complained about their website loading speed publicly", avatar: "T", clr: "#f0c832" },
  { id: 6, name: "Apex Digital", platform: "LinkedIn", heat: 66, signal: "Their lead designer just quit — saw the LinkedIn post", avatar: "A", clr: "#22aaff" },
];

const PIPE = [
  { name: "Byte Republic", stage: "Negotiating", val: 5500, days: 1, clr: "#e86322", av: "B" },
  { name: "Mira Wellness Co.", stage: "Proposal Sent", val: 3200, days: 5, clr: "#22c9a0", av: "M" },
  { name: "Nova Creative", stage: "DM Sent", val: 1800, days: 2, clr: "#8b6ef7", av: "N" },
  { name: "Lena Craft Co.", stage: "Won ✓", val: 2100, days: 12, clr: "#4ade80", av: "L" },
  { name: "Apex Digital", stage: "Identified", val: 4000, days: 0, clr: "#f0c832", av: "A" },
];

const GUILD = [
  { name: "Amara Diallo", role: "Brand Designer · Lagos", wins: 14, clr: "#e86322", av: "A", tip: "Stopped cold pitching. Posted value content daily. Inbound tripled in 6 weeks." },
  { name: "Kofi Mensah", role: "Copywriter · Accra", wins: 22, clr: "#22c9a0", av: "K", tip: "Income forecast saved me — caught a dry spell 3 weeks early and filled the gap in time." },
  { name: "Priya Sharma", role: "Consultant · London", wins: 31, clr: "#8b6ef7", av: "P", tip: "Voice DNA writes better than I do honestly. Reply rate went from 12% to 41% in one month." },
  { name: "Marcus Webb", role: "Video Editor · Toronto", wins: 9, clr: "#f0c832", av: "M", tip: "Guild challenges kept me accountable when motivation dropped. Community is everything." },
];

const CONTENT_IDEAS = [
  "Share a before/after of a project — clients love seeing transformation",
  "Post a 'What I wish I knew' tip in your niche — builds authority fast",
  "Show your process in a reel — how I approach a brief in 60 seconds",
  "Repost a happy client message with context — social proof that converts",
  "Ask a question your ideal client is struggling with — starts conversations",
  "Share a pricing myth in your industry — controversial = high engagement",
];

const TABS = [
  { id: "dash", icon: "◈", label: "Dashboard" },
  { id: "outreach", icon: "⟡", label: "Outreach" },
  { id: "proposals", icon: "✦", label: "Proposals" },
  { id: "pipeline", icon: "◎", label: "Pipeline" },
  { id: "content", icon: "❋", label: "Content" },
  { id: "guild", icon: "⬡", label: "Guild" },
  { id: "forecast", icon: "▲", label: "Forecast" },
];

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
function Dashboard({ niche, setNiche }) {
  const inc = useCount(4840);
  const prop = useCount(24);
  const rep = useCount(11);
  const won = useCount(3);
  const [checks, setChecks] = useState([
    { done: true, t: "Sent 5 personalized DMs via Voice DNA" },
    { done: true, t: "Published 3 content posts on Instagram" },
    { done: false, t: "Follow up with Byte Republic today" },
    { done: false, t: "Send proposal to Bloom Wellness" },
    { done: false, t: "Complete Guild weekly challenge" },
  ]);

  return (
    <div style={{ animation: "up .4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: "#334155", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Thursday · March 2026</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-.03em", background: "linear-gradient(120deg,#fff 50%,#e86322)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Good morning 👋</h1>
          <p style={{ color: "#475569", margin: 0, fontSize: 13 }}>3 follow-ups due · 2 hot leads waiting · Guild challenge active</p>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#334155", marginBottom: 4, textAlign: "right" }}>Your niche</div>
          <input value={niche} onChange={e => setNiche(e.target.value)}
            style={{ background: "#0e1422", border: "1px solid #1e293b", borderRadius: 8, padding: "7px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", textAlign: "right", width: 170 }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { l: "Proposals Sent", v: prop, c: "#e86322", sub: "+6 this week" },
          { l: "Client Replies", v: rep, c: "#22c9a0", sub: "46% reply rate" },
          { l: "Clients Won", v: won, c: "#4ade80", sub: "+$4,200 earned" },
          { l: "Voice DNA Accuracy", v: "92%", c: "#8b6ef7", sub: "Learning fast" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: "18px 20px", animation: `up .4s ease ${i * .07}s both` }}>
            <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>{s.l}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: s.c, lineHeight: 1, marginBottom: 6 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: "#334155" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>Income Forecast — This Month</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 46, fontWeight: 900, color: "#4ade80", lineHeight: 1 }}>${inc.toLocaleString()}</span>
            <span style={{ fontSize: 12, color: "#334155" }}>projected</span>
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 14 }}>$2,910 secured · $1,930 in pipeline</div>
          <div style={{ background: "#111827", borderRadius: 6, height: 5, marginBottom: 14, overflow: "hidden" }}>
            <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg,#4ade80,#22c9a0)", borderRadius: 6 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
            {[["Wk 1", "✓", "#4ade80", "#052e16"], ["Wk 2", "✓", "#4ade80", "#052e16"], ["Wk 3", "⚠", "#f0c832", "#1a1200"], ["Wk 4", "—", "#334155", "#0e1422"]].map(([w, s, c, bg], i) => (
              <div key={i} style={{ padding: "6px 0", background: bg, border: `1px solid ${c}30`, borderRadius: 8, fontSize: 11, color: c, textAlign: "center" }}>{w} {s}</div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "9px 12px", background: "#160e00", border: "1px solid #f0c83225", borderRadius: 8, fontSize: 12, color: "#f0c832" }}>⚠ Gap detected in week 3 — push 2 more outreach sessions now</div>
        </div>

        <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>Today's Actions</div>
          {checks.map((c, i) => (
            <div key={i} onClick={() => setChecks(p => p.map((x, j) => j === i ? { ...x, done: !x.done } : x))}
              style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, cursor: "pointer", opacity: c.done ? .5 : 1, transition: "opacity .2s" }}>
              <div style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${c.done ? "#4ade80" : "#1e293b"}`, background: c.done ? "#4ade8018" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                {c.done && <span style={{ color: "#4ade80", fontSize: 10 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: c.done ? "#334155" : "#94a3b8", textDecoration: c.done ? "line-through" : "none", lineHeight: 1.5 }}>{c.t}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: "9px 12px", background: "#08161e", border: "1px solid #22c9a020", borderRadius: 8, fontSize: 12, color: "#22c9a0" }}>🎯 Priority: Follow up with Byte Republic today</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { l: "Reputation Score", v: "84", sub: "Top 18%", c: "#e86322" },
          { l: "Guild Rank", v: "#12", sub: "This month", c: "#f0c832" },
          { l: "Dry Spell Risk", v: "Low", sub: "Pipeline healthy", c: "#4ade80" },
          { l: "Active Deals", v: "4", sub: "$12,600 value", c: "#22c9a0" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>{s.l}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.c, lineHeight: 1, marginBottom: 6 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: "#334155" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// OUTREACH
// ════════════════════════════════════════════════════════════════════════════
function Outreach({ niche }) {
  const [sel, setSel] = useState(null);
  const [loading, setLoad] = useState(false);
  const [dm, setDm] = useState("");
  const [go, setGo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState("All");
  const [audit, setAudit] = useState("");
  const [auditLoad, setAuditLoad] = useState(false);
  const [auditGo, setAuditGo] = useState(false);
  const [profile, setProfile] = useState("");
  const shown = useTypewriter(dm, 11, go);
  const auditShown = useTypewriter(audit, 11, auditGo);

  const genDM = async (lead) => {
    setSel(lead); setLoad(true); setDm(""); setGo(false); setCopied(false);
    try {
      const t = await AI(
        "You write short punchy human-sounding outreach DMs for freelancers on social media. 3-4 sentences max. Sound like a real person. Lead with something specific about the prospect. No fluff. No asterisks or markdown.",
        `Write a DM from a freelance ${niche} to ${lead.name} on ${lead.platform}. Signal: "${lead.signal}".`
      );
      setDm(t); setGo(true);
    } catch { setDm("Couldn't generate. Try again."); setGo(true); }
    setLoad(false);
  };

  const runAudit = async () => {
    if (!profile.trim()) return;
    setAuditLoad(true); setAudit(""); setAuditGo(false);
    try {
      const t = await AI(
        "You audit freelancer social media profiles. Be specific and actionable. Give 4-5 clear improvements. No markdown or bullet points. Write in short punchy paragraphs. Be direct like a mentor.",
        `Audit this freelance ${niche}'s profile description and give specific improvements: "${profile}"`
      );
      setAudit(t); setAuditGo(true);
    } catch { setAudit("Couldn't generate. Try again."); setAuditGo(true); }
    setAuditLoad(false);
  };

  const platforms = ["All", "Instagram", "LinkedIn", "Facebook", "Twitter/X"];
  const pClr = { Instagram: "#e84393", LinkedIn: "#0ea5e9", Facebook: "#3b82f6", "Twitter/X": "#94a3b8" };
  const filtered = filter === "All" ? LEADS : LEADS.filter(l => l.platform === filter);

  return (
    <div style={{ animation: "up .4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 5px", letterSpacing: "-.03em" }}>Social Outreach</h2>
        <p style={{ color: "#475569", margin: 0, fontSize: 13 }}>AI-detected warm leads. Click any to generate a personalized DM in your voice.</p>
      </div>

      <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
        {platforms.map(p => (
          <button key={p} onClick={() => setFilter(p)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", transition: "all .18s", background: filter === p ? "#e86322" : "transparent", borderColor: filter === p ? "#e86322" : "#1e293b", color: filter === p ? "#fff" : "#475569" }}>{p}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {filtered.map((l, i) => (
          <div key={l.id} onClick={() => genDM(l)} style={{ background: sel?.id === l.id ? "#0f1828" : "#090d18", border: `1px solid ${sel?.id === l.id ? "#e86322" : "#111827"}`, borderRadius: 13, padding: "16px 18px", cursor: "pointer", transition: "all .18s", animation: `up .3s ease ${i * .05}s both` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <Av l={l.avatar} c={l.clr} s={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{l.name}</div>
                <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: (pClr[l.platform] || "#94a3b8") + "20", color: pClr[l.platform] || "#94a3b8" }}>{l.platform}</span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#475569", fontStyle: "italic", marginBottom: 10, lineHeight: 1.5 }}>"{l.signal}"</div>
            <Heat v={l.heat} />
            <div style={{ fontSize: 11, color: "#e86322", fontWeight: 600, marginTop: 8 }}>→ Generate DM in your voice</div>
          </div>
        ))}
      </div>

      {(loading || go) && sel && (
        <div style={{ background: "#090d18", border: "1px solid #1e3a5f", borderRadius: 14, padding: 22, marginBottom: 18, animation: "up .3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Av l={sel.avatar} c={sel.clr} s={28} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{sel.name}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>Voice DNA · {sel.platform} DM</div>
              </div>
            </div>
            {go && !loading && (
              <button onClick={() => { navigator.clipboard.writeText(dm); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ padding: "6px 14px", background: copied ? "#4ade8018" : "#e8632218", border: `1px solid ${copied ? "#4ade80" : "#e86322"}`, borderRadius: 7, color: copied ? "#4ade80" : "#e86322", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {copied ? "✓ Copied!" : "Copy DM"}
              </button>
            )}
          </div>
          {loading ? <div style={{ color: "#475569", fontSize: 13 }}><Spin />Crafting your personalized DM...</div>
            : <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.9 }}>{shown}{go && dm.length > shown.length && <Cursor />}</div>}
        </div>
      )}

      <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 22 }}>
        <div style={{ fontSize: 11, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>Profile Audit — Paste Your Bio</div>
        <textarea value={profile} onChange={e => setProfile(e.target.value)} rows={3} placeholder="Paste your TikTok, X, or Instagram bio here..."
          style={{ width: "100%", background: "#0e1422", border: "1px solid #1e293b", borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 13, outline: "none", lineHeight: 1.7, resize: "none", marginBottom: 12 }} />
        <button onClick={runAudit} disabled={auditLoad || !profile.trim()} style={{ padding: "10px 22px", background: auditLoad || !profile.trim() ? "#111827" : "#e86322", border: "none", borderRadius: 9, color: auditLoad || !profile.trim() ? "#334155" : "#fff", fontWeight: 700, fontSize: 13, cursor: auditLoad || !profile.trim() ? "not-allowed" : "pointer", transition: "all .2s" }}>
          {auditLoad ? <><Spin />Auditing...</> : "✦ Audit My Profile"}
        </button>
        {(auditLoad || auditGo) && (
          <div style={{ marginTop: 16, fontSize: 13, color: "#cbd5e1", lineHeight: 1.9 }}>
            {auditLoad ? <span style={{ color: "#475569" }}><Spin />Analyzing your profile...</span>
              : <>{auditShown}{auditGo && audit.length > auditShown.length && <Cursor />}</>}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PROPOSALS
// ════════════════════════════════════════════════════════════════════════════
function Proposals({ niche, setNiche }) {
  const [job, setJob] = useState("We need a complete brand identity redesign for our wellness startup. Looking for someone modern, clean, and strategic who understands young professionals.");
  const [loading, setLoad] = useState(false);
  const [text, setText] = useState("");
  const [go, setGo] = useState(false);
  const [score, setScore] = useState(null);
  const [scoreLoad, setScLoad] = useState(false);
  const shown = useTypewriter(text, 9, go);
  const [followUp, setFu] = useState("");
  const [fuLoad, setFuLoad] = useState(false);
  const [fuGo, setFuGo] = useState(false);
  const [clientName, setClient] = useState("");
  const [daysSince, setDays] = useState("3");
  const fuShown = useTypewriter(followUp, 11, fuGo);

  const gen = async () => {
    setLoad(true); setText(""); setGo(false); setScore(null);
    try {
      const t = await AI(
        "You write winning freelance proposals. Concise, confident, specific. Never start with I came across your posting. Lead with proof you understand their exact problem. Sound like a senior professional. 4 short focused paragraphs. No markdown. End with a clear next step.",
        `Write a proposal for a freelance ${niche} for this job: "${job}"`
      );
      setText(t); setGo(true);
      setScLoad(true);
      setTimeout(async () => {
        try {
          const s = await AI("You score freelance proposals from 1-100. Return ONLY a number. Nothing else.", `Score this proposal: "${t}"`);
          setScore(parseInt(s.trim()) || 88);
        } catch { setScore(88); }
        setScLoad(false);
      }, 1200);
    } catch { setText("Couldn't generate. Try again."); setGo(true); }
    setLoad(false);
  };

  const genFU = async () => {
    setFuLoad(true); setFu(""); setFuGo(false);
    try {
      const t = await AI(
        "Write short warm human follow-up messages for freelancers. Not pushy. Not desperate. Sound confident. 2-3 sentences max. No markdown.",
        `Write a follow-up from a freelance ${niche} to ${clientName || "a client"} who received a proposal ${daysSince} days ago and has not replied.`
      );
      setFu(t); setFuGo(true);
    } catch { setFu("Couldn't generate. Try again."); setFuGo(true); }
    setFuLoad(false);
  };

  return (
    <div style={{ animation: "up .4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 5px", letterSpacing: "-.03em" }}>Proposal Generator</h2>
        <p style={{ color: "#475569", margin: 0, fontSize: 13 }}>Paste any job. Get a proposal in your voice that converts. Scored by AI.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div>
          <label style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Your Niche</label>
          <input value={niche} onChange={e => setNiche(e.target.value)} style={{ width: "100%", background: "#0e1422", border: "1px solid #1e293b", borderRadius: 9, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", marginBottom: 16 }} />
          <label style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Job Description</label>
          <textarea value={job} onChange={e => setJob(e.target.value)} rows={6}
            style={{ width: "100%", background: "#0e1422", border: "1px solid #1e293b", borderRadius: 9, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", lineHeight: 1.7, resize: "none" }} />
          <button onClick={gen} disabled={loading} style={{ marginTop: 13, width: "100%", padding: "13px", borderRadius: 10, background: loading ? "#111827" : "#e86322", border: "none", color: loading ? "#334155" : "#fff", fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", transition: "all .2s" }}>
            {loading ? <><Spin />Writing your proposal...</> : "✦ Generate With Voice DNA"}
          </button>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            {[["Tech clients", "Lead with turnaround time", "#22c9a0"], ["Creative clients", "Lead with visual case study", "#8b6ef7"], ["Startup clients", "Lead with growth impact", "#e86322"]].map(([k, v, c], i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "7px 11px", background: "#090d18", border: "1px solid #111827", borderRadius: 7, alignItems: "center" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#334155" }}><span style={{ color: c, fontWeight: 700 }}>{k}:</span> {v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 13, padding: 22, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>Voice DNA Output</div>
            {scoreLoad && <div style={{ fontSize: 11, color: "#475569" }}><Spin />Scoring...</div>}
            {score && !scoreLoad && (
              <div style={{ padding: "3px 12px", background: score >= 90 ? "#052e16" : "#0f1a0a", border: `1px solid ${score >= 90 ? "#4ade80" : "#22c9a0"}30`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: score >= 90 ? "#4ade80" : "#22c9a0" }}>
                Score: {score}%
              </div>
            )}
          </div>
          {loading && <div style={{ color: "#475569", fontSize: 13 }}><Spin />Analyzing job and writing your pitch...</div>}
          {go && !loading && <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.9, flex: 1 }}>{shown}{go && text.length > shown.length && <Cursor />}</div>}
          {!loading && !go && <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#1e293b", fontSize: 13, fontStyle: "italic" }}>Your proposal will appear here</div>}
        </div>
      </div>

      <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 22 }}>
        <div style={{ fontSize: 11, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>Follow-Up Generator</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, marginBottom: 14 }}>
          <input value={clientName} onChange={e => setClient(e.target.value)} placeholder="Client name"
            style={{ background: "#0e1422", border: "1px solid #1e293b", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
          <input value={daysSince} onChange={e => setDays(e.target.value)} placeholder="Days since proposal"
            style={{ background: "#0e1422", border: "1px solid #1e293b", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
          <button onClick={genFU} disabled={fuLoad} style={{ padding: "9px 18px", background: fuLoad ? "#111827" : "#22c9a0", border: "none", borderRadius: 8, color: fuLoad ? "#334155" : "#060810", fontWeight: 700, fontSize: 13, cursor: fuLoad ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {fuLoad ? <><Spin />Writing...</> : "Generate Follow-Up"}
          </button>
        </div>
        {(fuLoad || fuGo) && (
          <div style={{ padding: "14px 16px", background: "#0e1422", border: "1px solid #1e293b", borderRadius: 10, fontSize: 14, color: "#cbd5e1", lineHeight: 1.9 }}>
            {fuLoad ? <span style={{ color: "#475569" }}><Spin />Writing your follow-up...</span>
              : <>{fuShown}{fuGo && followUp.length > fuShown.length && <Cursor />}</>}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PIPELINE
// ════════════════════════════════════════════════════════════════════════════
function Pipeline({ niche }) {
  const [pipe, setPipe] = useState(PIPE);
  const [selected, setSel] = useState(null);
  const [fuText, setFuText] = useState("");
  const [fuLoad, setFuLoad] = useState(false);
  const [fuGo, setFuGo] = useState(false);
  const fuShown = useTypewriter(fuText, 11, fuGo);
  const total = useCount(pipe.reduce((a, b) => a + b.val, 0));
  const wonAmt = useCount(pipe.filter(p => p.stage === "Won ✓").reduce((a, b) => a + b.val, 0));
  const stages = ["Identified", "DM Sent", "Proposal Sent", "Negotiating", "Won ✓"];
  const sClr = { "Identified": "#334155", "DM Sent": "#8b6ef7", "Proposal Sent": "#f0c832", "Negotiating": "#e86322", "Won ✓": "#4ade80" };

  const genFU = async (p) => {
    setSel(p); setFuLoad(true); setFuText(""); setFuGo(false);
    try {
      const t = await AI(
        "Write short warm confident follow-up messages for freelancers. Not pushy. 2-3 sentences. Human tone. No markdown.",
        `Write a follow-up from a freelance ${niche} to ${p.name}. They are in the ${p.stage} stage and it has been ${p.days} days since last contact.`
      );
      setFuText(t); setFuGo(true);
    } catch { setFuText("Couldn't generate. Try again."); setFuGo(true); }
    setFuLoad(false);
  };

  const moveStage = (idx, dir) => {
    setPipe(prev => prev.map((p, i) => {
      if (i !== idx) return p;
      const cur = stages.indexOf(p.stage);
      const next = Math.max(0, Math.min(stages.length - 1, cur + dir));
      return { ...p, stage: stages[next] };
    }));
  };

  return (
    <div style={{ animation: "up .4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 5px", letterSpacing: "-.03em" }}>Client Pipeline</h2>
        <p style={{ color: "#475569", margin: 0, fontSize: 13 }}>Every deal tracked. Move stages, generate follow-ups, never lose a lead.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
        {[
          { l: "Total Pipeline", v: `$${total.toLocaleString()}`, c: "#e86322" },
          { l: "Won This Month", v: `$${wonAmt.toLocaleString()}`, c: "#4ade80" },
          { l: "Active Deals", v: pipe.filter(p => p.stage !== "Won ✓").length, c: "#8b6ef7" },
          { l: "Avg Close Time", v: "5 days", c: "#22c9a0" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
        {pipe.map((p, i) => (
          <div key={i} style={{ background: "#090d18", border: `1px solid ${selected?.name === p.name ? "#e86322" : "#111827"}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, animation: `up .3s ease ${i * .05}s both` }}>
            <Av l={p.av} c={p.clr} s={38} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#334155" }}>{p.days === 0 ? "Just added" : `${p.days}d since last contact`}</div>
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button onClick={() => moveStage(i, -1)} style={{ width: 24, height: 24, background: "#111827", border: "1px solid #1e293b", borderRadius: 5, color: "#475569", fontSize: 12, cursor: "pointer" }}>←</button>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: sClr[p.stage] + "18", color: sClr[p.stage], whiteSpace: "nowrap" }}>{p.stage}</span>
              <button onClick={() => moveStage(i, 1)} style={{ width: 24, height: 24, background: "#111827", border: "1px solid #1e293b", borderRadius: 5, color: "#475569", fontSize: 12, cursor: "pointer" }}>→</button>
            </div>
            <div style={{ fontWeight: 900, fontSize: 20, color: p.stage === "Won ✓" ? "#4ade80" : "#e2e8f0", minWidth: 80, textAlign: "right" }}>${p.val.toLocaleString()}</div>
            {p.stage !== "Won ✓" && (
              <button onClick={() => genFU(p)} style={{ padding: "7px 14px", background: "transparent", border: "1px solid #1e293b", borderRadius: 7, color: "#22c9a0", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                {fuLoad && selected?.name === p.name ? <><Spin />Writing...</> : "Follow Up →"}
              </button>
            )}
          </div>
        ))}
      </div>

      {(fuLoad || fuGo) && selected && (
        <div style={{ background: "#090d18", border: "1px solid #1e3a5f", borderRadius: 12, padding: 20, animation: "up .3s ease" }}>
          <div style={{ fontSize: 11, color: "#22c9a0", fontWeight: 600, marginBottom: 10 }}>Follow-up for {selected.name}</div>
          {fuLoad ? <div style={{ color: "#475569", fontSize: 13 }}><Spin />Writing your follow-up...</div>
            : <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.9 }}>{fuShown}{fuGo && fuText.length > fuShown.length && <Cursor />}</div>}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CONTENT
// ════════════════════════════════════════════════════════════════════════════
function Content({ niche }) {
  const [topic, setTopic] = useState("");
  const [platform, setPlat] = useState("TikTok");
  const [loading, setLoad] = useState(false);
  const [post, setPost] = useState("");
  const [go, setGo] = useState(false);
  const [calLoad, setCalLoad] = useState(false);
  const [calendar, setCal] = useState("");
  const [calGo, setCalGo] = useState(false);
  const shown = useTypewriter(post, 10, go);
  const calShown = useTypewriter(calendar, 10, calGo);

  const genPost = async () => {
    setLoad(true); setPost(""); setGo(false);
    try {
      const t = await AI(
        "You write high-performing social media posts for freelancers that attract clients. Write in a confident relatable human voice. No hashtag spam. Make it specific valuable and engaging. No markdown or asterisks.",
        `Write a ${platform} post for a freelance ${niche} about: "${topic || "their expertise and value"}". Goal: attract potential clients.`
      );
      setPost(t); setGo(true);
    } catch { setPost("Couldn't generate. Try again."); setGo(true); }
    setLoad(false);
  };

  const genCal = async () => {
    setCalLoad(true); setCal(""); setCalGo(false);
    try {
      const t = await AI(
        "You create weekly content calendars for freelancers. Give 5 specific post ideas for Mon-Fri. Each idea should be 1-2 sentences describing exactly what to post and why it attracts clients. No markdown. Number them 1-5.",
        `Create a 5-day content calendar for a freelance ${niche} on ${platform} to attract clients.`
      );
      setCal(t); setCalGo(true);
    } catch { setCal("Couldn't generate. Try again."); setCalGo(true); }
    setCalLoad(false);
  };

  return (
    <div style={{ animation: "up .4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 5px", letterSpacing: "-.03em" }}>Content Strategy</h2>
        <p style={{ color: "#475569", margin: 0, fontSize: 13 }}>Generate posts and weekly plans that attract clients — not just followers.</p>
      </div>

      <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
        {["TikTok", "Twitter/X", "Instagram", "LinkedIn", "Facebook"].map(p => (
          <button key={p} onClick={() => setPlat(p)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", transition: "all .18s", background: platform === p ? "#8b6ef7" : "transparent", borderColor: platform === p ? "#8b6ef7" : "#1e293b", color: platform === p ? "#fff" : "#475569" }}>{p}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>Post Generator</div>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="What is this post about? Leave blank for a surprise"
            style={{ width: "100%", background: "#0e1422", border: "1px solid #1e293b", borderRadius: 9, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", marginBottom: 12 }} />
          <button onClick={genPost} disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: 9, background: loading ? "#111827" : "#8b6ef7", border: "none", color: loading ? "#334155" : "#fff", fontSize: 13, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", transition: "all .2s" }}>
            {loading ? <><Spin />Writing post...</> : "✦ Generate Post"}
          </button>
          <div style={{ marginTop: 14, background: "#090d18", border: "1px solid #111827", borderRadius: 12, padding: 18, minHeight: 120 }}>
            {loading && <div style={{ color: "#475569", fontSize: 13 }}><Spin />Crafting your post...</div>}
            {go && !loading && <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.9 }}>{shown}{go && post.length > shown.length && <Cursor />}</div>}
            {!loading && !go && <div style={{ color: "#1e293b", fontSize: 13, fontStyle: "italic" }}>Your post will appear here</div>}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>Quick Ideas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {CONTENT_IDEAS.map((idea, i) => (
              <div key={i} onClick={() => setTopic(idea)} style={{ padding: "10px 13px", background: "#090d18", border: "1px solid #111827", borderRadius: 9, fontSize: 13, color: "#94a3b8", cursor: "pointer", lineHeight: 1.5, transition: "all .18s" }}>
                {idea}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Weekly Content Calendar</div>
            <div style={{ fontSize: 13, color: "#475569" }}>5 posts Mon–Fri built for {platform}</div>
          </div>
          <button onClick={genCal} disabled={calLoad} style={{ padding: "9px 18px", background: calLoad ? "#111827" : "#e86322", border: "none", borderRadius: 8, color: calLoad ? "#334155" : "#fff", fontWeight: 700, fontSize: 13, cursor: calLoad ? "not-allowed" : "pointer" }}>
            {calLoad ? <><Spin />Building...</> : "Generate This Week"}
          </button>
        </div>
        {(calLoad || calGo) && (
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.9 }}>
            {calLoad ? <span style={{ color: "#475569" }}><Spin />Planning your week...</span>
              : <>{calShown}{calGo && calendar.length > calShown.length && <Cursor />}</>}
          </div>
        )}
        {!calLoad && !calGo && <div style={{ color: "#1e293b", fontSize: 13, fontStyle: "italic" }}>Click generate to plan your week</div>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GUILD
// ════════════════════════════════════════════════════════════════════════════
function Guild({ niche }) {
  const [joined, setJoined] = useState(false);
  const [progress, setProgress] = useState(3);
  const [question, setQ] = useState("");
  const [answer, setAns] = useState("");
  const [ansLoad, setAnsLoad] = useState(false);
  const [ansGo, setAnsGo] = useState(false);
  const ansShown = useTypewriter(answer, 11, ansGo);

  const ask = async () => {
    if (!question.trim()) return;
    setAnsLoad(true); setAns(""); setAnsGo(false);
    try {
      const t = await AI(
        "You are a senior Guild mentor for freelancers. Experienced, direct, practical. Answer like a trusted colleague who has been in the game for years. No fluff. Real talk. 3-5 sentences max. No markdown.",
        `A freelance ${niche} asks: "${question}"`
      );
      setAns(t); setAnsGo(true);
    } catch { setAns("Couldn't connect. Try again."); setAnsGo(true); }
    setAnsLoad(false);
  };

  return (
    <div style={{ animation: "up .4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 5px", letterSpacing: "-.03em" }}>The Guild</h2>
        <p style={{ color: "#475569", margin: 0, fontSize: 13 }}>Your inner circle. Real accountability. Shared wins. Mentor on demand.</p>
      </div>

      <div style={{ background: "linear-gradient(135deg,#0a160a,#080e10)", border: "1px solid #4ade8022", borderRadius: 14, padding: 22, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#4ade80", marginBottom: 6 }}>🛡️ The Guild Pledge</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, maxWidth: 480 }}>If Lancer does not help you land at least one new client conversation in 30 days, you get a full refund and a free 1-on-1 with a Guild mentor. No questions asked.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, textAlign: "center", flexShrink: 0, marginLeft: 20 }}>
            {[["1,240", "Members", "#e86322"], ["94%", "Land in 30d", "#22c9a0"], ["4.9★", "Rating", "#f0c832"]].map(([v, l, c], i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f0c832", marginBottom: 4 }}>🏆 This Week's Challenge</div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>Send 5 personalized DMs before Friday. 142 members participating.</div>
          </div>
          <button onClick={() => setJoined(!joined)} style={{ padding: "8px 18px", background: joined ? "#4ade8018" : "#f0c832", border: `1px solid ${joined ? "#4ade80" : "#f0c832"}`, borderRadius: 9, color: joined ? "#4ade80" : "#060810", fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
            {joined ? "✓ Joined" : "Join Challenge"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10 }}>
          <div style={{ flex: 1, height: 5, background: "#111827", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(progress / 5) * 100}%`, height: "100%", background: "linear-gradient(90deg,#f0c832,#e86322)", borderRadius: 3, transition: "width .5s ease" }} />
          </div>
          <span style={{ fontSize: 11, color: "#f0c832", fontWeight: 700 }}>{progress}/5</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setProgress(n)} style={{ flex: 1, padding: "6px 0", background: n <= progress ? "#f0c83218" : "#111827", border: `1px solid ${n <= progress ? "#f0c832" : "#1e293b"}`, borderRadius: 6, color: n <= progress ? "#f0c832" : "#334155", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              {n <= progress ? "✓" : n}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 22, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>Ask a Guild Mentor — AI Powered</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input value={question} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && ask()} placeholder="Ask anything about freelancing, clients, pricing, outreach..."
            style={{ flex: 1, background: "#0e1422", border: "1px solid #1e293b", borderRadius: 9, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
          <button onClick={ask} disabled={ansLoad || !question.trim()} style={{ padding: "10px 18px", background: ansLoad || !question.trim() ? "#111827" : "#4ade80", border: "none", borderRadius: 9, color: ansLoad || !question.trim() ? "#334155" : "#060810", fontWeight: 800, fontSize: 13, cursor: ansLoad || !question.trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {ansLoad ? <><Spin />Asking...</> : "Ask Mentor"}
          </button>
        </div>
        {(ansLoad || ansGo) && (
          <div style={{ padding: "14px 16px", background: "#0e1422", border: "1px solid #4ade8020", borderRadius: 10, fontSize: 14, color: "#cbd5e1", lineHeight: 1.9 }}>
            {ansLoad ? <span style={{ color: "#475569" }}><Spin />Consulting your mentor...</span>
              : <>{ansShown}{ansGo && answer.length > ansShown.length && <Cursor />}</>}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {GUILD.map((m, i) => (
          <div key={i} style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 13, padding: 18, animation: `up .3s ease ${i * .07}s both` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
              <Av l={m.av} c={m.clr} s={42} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{m.role}</div>
                <div style={{ marginTop: 6, padding: "2px 8px", display: "inline-block", background: m.clr + "18", border: `1px solid ${m.clr}30`, borderRadius: 20, fontSize: 10, fontWeight: 700, color: m.clr }}>{m.wins} clients won</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#64748b", fontStyle: "italic", lineHeight: 1.6, borderLeft: `2px solid ${m.clr}40`, paddingLeft: 12 }}>"{m.tip}"</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FORECAST
// ════════════════════════════════════════════════════════════════════════════
function Forecast({ niche }) {
  const [situation, setSit] = useState("");
  const [advice, setAdvice] = useState("");
  const [advLoad, setAdvLoad] = useState(false);
  const [advGo, setAdvGo] = useState(false);
  const advShown = useTypewriter(advice, 11, advGo);
  const inc = useCount(4840);

  const getAdvice = async () => {
    setAdvLoad(true); setAdvice(""); setAdvGo(false);
    try {
      const t = await AI(
        "You are a freelance business advisor. Give sharp specific actionable advice about income pipeline and financial planning for freelancers. Be direct. No fluff. No markdown. 4-5 sentences.",
        `A freelance ${niche} says: "${situation || "I want to grow my monthly income and make it more predictable."}". Give them specific advice.`
      );
      setAdvice(t); setAdvGo(true);
    } catch { setAdvice("Couldn't generate. Try again."); setAdvGo(true); }
    setAdvLoad(false);
  };

  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const actuals = [1800, 2400, 2100, 3200, 3800, 4840];
  const maxVal = 6000;

  return (
    <div style={{ animation: "up .4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 5px", letterSpacing: "-.03em" }}>Income Forecast</h2>
        <p style={{ color: "#475569", margin: 0, fontSize: 13 }}>Track your earning trend. Spot gaps early. Get AI advice on growing your income.</p>
      </div>

      <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 28, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>This Month Projection</div>
          <div style={{ fontSize: 56, fontWeight: 900, color: "#4ade80", lineHeight: 1, marginBottom: 6 }}>${inc.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: "#475569" }}>$2,910 confirmed · $1,930 in active pipeline</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>vs Last Month</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#22c9a0" }}>+27%</div>
          <div style={{ fontSize: 12, color: "#334155" }}>↑ $1,040 increase</div>
        </div>
      </div>

      <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 20 }}>6-Month Trend</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 140 }}>
          {months.map((m, i) => {
            const v = actuals[i] || 0;
            const h = (v / maxVal) * 120;
            const isCur = i === 5;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: isCur ? "#4ade80" : "#475569" }}>${(v / 1000).toFixed(1)}k</div>
                <div style={{ width: "100%", height: h, borderRadius: "4px 4px 0 0", background: isCur ? "linear-gradient(180deg,#4ade80,#22c9a0)" : "#1a2535", transition: "height 1s ease" }} />
                <div style={{ fontSize: 11, color: "#334155" }}>{m}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ padding: "14px 16px", background: "#160e00", border: "1px solid #f0c83225", borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#f0c832", marginBottom: 6 }}>⚠ Gap Detected — Week 3</div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>Your pipeline is light for week 3. Push 2-3 more outreach sessions now to fill it before it becomes a dry spell.</div>
        </div>
        <div style={{ padding: "14px 16px", background: "#052e16", border: "1px solid #4ade8025", borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>✓ On Track for Record Month</div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>If Byte Republic closes this week you hit $5,400 — your highest month ever. One follow-up could make that happen.</div>
        </div>
      </div>

      <div style={{ background: "#090d18", border: "1px solid #111827", borderRadius: 14, padding: 22 }}>
        <div style={{ fontSize: 11, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>AI Income Advisor</div>
        <textarea value={situation} onChange={e => setSit(e.target.value)} rows={3} placeholder="Describe your income situation. E.g. I only have 1 client and it is stressful. What should I do?"
          style={{ width: "100%", background: "#0e1422", border: "1px solid #1e293b", borderRadius: 9, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", lineHeight: 1.7, resize: "none", marginBottom: 12 }} />
        <button onClick={getAdvice} disabled={advLoad} style={{ padding: "10px 22px", background: advLoad ? "#111827" : "#4ade80", border: "none", borderRadius: 9, color: advLoad ? "#334155" : "#060810", fontWeight: 800, fontSize: 13, cursor: advLoad ? "not-allowed" : "pointer", transition: "all .2s" }}>
          {advLoad ? <><Spin />Analyzing...</> : "Get Income Advice"}
        </button>
        {(advLoad || advGo) && (
          <div style={{ marginTop: 14, padding: "14px 16px", background: "#0e1422", border: "1px solid #4ade8020", borderRadius: 10, fontSize: 14, color: "#cbd5e1", lineHeight: 1.9 }}>
            {advLoad ? <span style={{ color: "#475569" }}><Spin />Analyzing your situation...</span>
              : <>{advShown}{advGo && advice.length > advShown.length && <Cursor />}</>}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("dash");
  const [niche, setNiche] = useState("Brand Designer");

  const screens = {
    dash: <Dashboard niche={niche} setNiche={setNiche} />,
    outreach: <Outreach niche={niche} />,
    proposals: <Proposals niche={niche} setNiche={setNiche} />,
    pipeline: <Pipeline niche={niche} />,
    content: <Content niche={niche} />,
    guild: <Guild niche={niche} />,
    forecast: <Forecast niche={niche} />,
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#060810", color: "#e2e8f0", fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes up{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        button,input,textarea{font-family:inherit;}
        input::placeholder,textarea::placeholder{color:#1e293b;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px;}
        textarea{resize:none;}
      `}</style>

      {/* DESKTOP Sidebar */}
      {!isMobile && (
        <div style={{ width: 200, background: "#07090f", borderRight: "1px solid #0f1420", display: "flex", flexDirection: "column", padding: "22px 0", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100 }}>
          <div style={{ padding: "0 18px 22px", borderBottom: "1px solid #0f1420" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#e86322,#e84393)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: "#fff", boxShadow: "0 4px 18px #e8632240" }}>L</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-.03em", color: "#fff" }}>Lancer</div>
                <div style={{ fontSize: 9, color: "#334155", letterSpacing: ".08em" }}>FREELANCE OS</div>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, background: tab === t.id ? "#e8632215" : "transparent", border: `1px solid ${tab === t.id ? "#e8632228" : "transparent"}`, color: tab === t.id ? "#e86322" : "#334155", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, transition: "all .15s", textAlign: "left", width: "100%" }}>
                <span style={{ fontSize: 14, opacity: tab === t.id ? 1 : .5 }}>{t.icon}</span>
                {t.label}
                {tab === t.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#e86322" }} />}
              </button>
            ))}
          </nav>
          <div style={{ padding: "14px 16px", borderTop: "1px solid #0f1420" }}>
            <div style={{ padding: "10px 12px", background: "#090d18", border: "1px solid #111827", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", letterSpacing: ".06em" }}>VOICE DNA ON</span>
              </div>
              <div style={{ fontSize: 10, color: "#334155", lineHeight: 1.5 }}>92% match · learning fast</div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE Top Bar */}
      {isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 54, background: "#07090f", borderBottom: "1px solid #0f1420", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#e86322,#e84393)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff" }}>L</div>
            <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-.03em", color: "#fff" }}>Lancer</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", letterSpacing: ".06em" }}>VOICE DNA ON</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        marginLeft: isMobile ? 0 : 200,
        flex: 1,
        padding: isMobile ? "70px 16px 90px" : "32px 36px",
        maxWidth: isMobile ? "100%" : 1060,
        overflowY: "auto",
        width: "100%",
      }}>
        {screens[tab]}
      </div>

      {/* MOBILE Bottom Navigation */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 64, background: "#07090f", borderTop: "1px solid #0f1420", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100, padding: "0 4px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 10px", borderRadius: 10, background: "transparent", border: "none", color: tab === t.id ? "#e86322" : "#334155", cursor: "pointer", transition: "all .15s", flex: 1 }}>
              <span style={{ fontSize: 18, opacity: tab === t.id ? 1 : .4 }}>{t.icon}</span>
              <span style={{ fontSize: 9, fontWeight: tab === t.id ? 700 : 400, letterSpacing: ".04em" }}>{t.label}</span>
              {tab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#e86322" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}