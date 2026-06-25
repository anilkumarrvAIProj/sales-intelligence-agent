"use client";
import { useState, useEffect, useRef } from "react";

const DOMAINS = [
  { id: "cloud",    label: "Cloud & Infra",        icon: "☁️",  focus: "Cloud migration, AWS/Azure/GCP, infrastructure modernization, DevOps, FinOps" },
  { id: "data",     label: "Data & AI",             icon: "🧠",  focus: "Data engineering, ML/AI adoption, analytics platforms, data governance, LLM integration" },
  { id: "security", label: "Cybersecurity",          icon: "🔒",  focus: "Zero trust, SOC, compliance (SOC2/ISO27001), identity management, threat detection" },
  { id: "erp",      label: "ERP & SAP",             icon: "⚙️",  focus: "SAP S/4HANA migration, Oracle, ERP modernization, business process automation" },
  { id: "digital",  label: "Digital Engineering",   icon: "💻",  focus: "App modernization, microservices, API platforms, product engineering, UX transformation" },
  { id: "managed",  label: "Managed Services",       icon: "🛠️",  focus: "IT outsourcing, NOC/SOC, helpdesk, application managed services, SLA optimization" },
];

// ── Word / HTML export ──────────────────────────────────────────────────────
function exportToWord(brief, company, domain, salespersonName) {
  const domainObj = DOMAINS.find(d => d.id === domain);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;font-size:11pt;color:#1a1a2e;margin:2cm}
  h1{font-size:18pt;color:#1a1a2e;border-bottom:3px solid #4f46e5;padding-bottom:6pt}
  h2{font-size:13pt;color:#4f46e5;margin-top:18pt;margin-bottom:6pt;border-left:4px solid #4f46e5;padding-left:8pt}
  .meta{background:#f0f4ff;padding:10pt;border-radius:4pt;margin-bottom:16pt;font-size:10pt;color:#4b5563}
  .card{background:#f9fafb;border-left:3px solid #e5e7eb;padding:8pt 10pt;margin:6pt 0}
  .pain{border-left-color:#ef4444}.signal{border-left-color:#10b981}
  .news{border-left-color:#3b82f6}.person{border-left-color:#8b5cf6}
  ul{margin:4pt 0;padding-left:16pt} li{margin-bottom:3pt}
  .checklist li{list-style:none;padding-left:0}
  .checklist li:before{content:"☐ ";color:#6366f1;font-weight:bold}
  table{border-collapse:collapse;width:100%;margin:8pt 0}
  td,th{border:1px solid #e5e7eb;padding:5pt 8pt;font-size:10pt}
  th{background:#f0f4ff;font-weight:bold;color:#4f46e5}
  .footer{margin-top:24pt;font-size:9pt;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:6pt}
  .sig-high{color:#16a34a;font-weight:bold}.sig-med{color:#d97706;font-weight:bold}.sig-low{color:#9ca3af}
</style></head><body>
<h1>🎯 Sales Intelligence Brief — ${brief.companySnapshot?.name || company}</h1>
<div class="meta">
  <strong>Prepared for:</strong> ${salespersonName || "Sales Representative"} &nbsp;|&nbsp;
  <strong>Domain:</strong> ${domainObj?.icon} ${domainObj?.label} &nbsp;|&nbsp;
  <strong>Date:</strong> ${date} &nbsp;|&nbsp;
  <strong>Confidence:</strong> ${brief.confidence || "MEDIUM"}
</div>

<h2>Company Snapshot</h2>
<table>
  <tr><th>Industry</th><td>${brief.companySnapshot?.industry||"—"}</td><th>HQ</th><td>${brief.companySnapshot?.hq||"—"}</td></tr>
  <tr><th>Employees</th><td>${brief.companySnapshot?.employees||"—"}</td><th>Revenue</th><td>${brief.companySnapshot?.revenue||"—"}</td></tr>
  <tr><th>Stock</th><td>${brief.companySnapshot?.stockTicker||"Private"}</td><th>Website</th><td>${brief.companySnapshot?.website||"—"}</td></tr>
</table>
<p><em>${brief.companySnapshot?.oneLiner||""}</em></p>

<h2>Why Meet Now?</h2><p>${brief.executiveSummary||"—"}</p>

${brief.personnelChanges?.length?`<h2>Personnel Changes</h2>${brief.personnelChanges.map(p=>`<div class="card person"><strong>${p.name}</strong> — ${p.change}: ${p.title} (${p.date})<br/><em>Sales signal:</em> ${p.salesSignal}</div>`).join("")}`:""}

${brief.recentNews?.length?`<h2>Recent News</h2>${brief.recentNews.map(n=>`<div class="card news"><strong>${n.headline}</strong> (${n.date})<br/>${n.summary}<br/><em>IT relevance:</em> ${n.itRelevance}</div>`).join("")}`:""}

${brief.painPoints?.length?`<h2>Pain Points</h2>${brief.painPoints.map(p=>`<div class="card pain"><strong>${p.pain}</strong><br/>Evidence: ${p.evidence}<br/><em>Our angle:</em> ${p.ourAngle}</div>`).join("")}`:""}

${brief.buyingSignals?.length?`<h2>Buying Signals</h2>${brief.buyingSignals.map(s=>`<div class="card signal"><span class="${s.strength==="HIGH"?"sig-high":s.strength==="MEDIUM"?"sig-med":"sig-low"}">[${s.strength}]</span> ${s.signal} — Source: ${s.source}</div>`).join("")}`:""}

${brief.techLandscape?`<h2>Technology Landscape</h2>
<table>
  <tr><th>Known Stack</th><td>${(brief.techLandscape.knownStack||[]).join(", ")||"—"}</td></tr>
  <tr><th>Recent Investments</th><td>${(brief.techLandscape.recentInvestments||[]).join(", ")||"—"}</td></tr>
  <tr><th>Cloud Posture</th><td>${brief.techLandscape.cloudPosture||"—"}</td></tr>
  <tr><th>Identified Gaps</th><td>${(brief.techLandscape.gaps||[]).join(", ")||"—"}</td></tr>
</table>`:""}

${brief.domainFocus?`<h2>${domainObj?.icon} Domain Pitch</h2>
<p><strong>Key message:</strong> ${brief.domainFocus.keyMessage}</p>
<p><strong>Services to pitch:</strong></p>
<ul>${(brief.domainFocus.suggestedServices||[]).map(s=>`<li>${s}</li>`).join("")}</ul>
<p><strong>Avoid:</strong> ${(brief.domainFocus.avoidTopics||[]).join(", ")}</p>`:""}

${brief.conversationStarters?.length?`<h2>Conversation Starters</h2>${brief.conversationStarters.map(c=>`<div class="card"><strong>"${c.opener}"</strong><br/><em>${c.context}</em></div>`).join("")}`:""}

${brief.meetingChecklist?.length?`<h2>Pre-Meeting Checklist</h2><ul class="checklist">${brief.meetingChecklist.map(i=>`<li>${i}</li>`).join("")}</ul>`:""}

${brief.riskFlags?.length?`<h2>Risk Flags</h2>${brief.riskFlags.map(r=>`<div class="card" style="border-left-color:#f59e0b">⚠️ <strong>${r.flag}</strong><br/>Mitigation: ${r.mitigation}</div>`).join("")}`:""}

<div class="footer">Generated by Sales Intelligence Agent · ${date} · Confidential — Internal Use Only</div>
</body></html>`;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SalesBrief_${(brief.companySnapshot?.name||company).replace(/\s+/g,"_")}_${new Date().toISOString().slice(0,10)}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Small reusable components ────────────────────────────────────────────────
function Badge({ label, color="#6366f1" }) {
  return (
    <span style={{
      display:"inline-block",fontSize:"10px",fontWeight:"700",color,
      background:color+"18",padding:"2px 8px",borderRadius:"10px",
      letterSpacing:"0.5px",border:`1px solid ${color}30`,marginRight:"4px",marginBottom:"4px"
    }}>{label}</span>
  );
}

function Card({ children, accent="#e5e7eb" }) {
  return (
    <div style={{
      background:"#f9fafb",borderLeft:`3px solid ${accent}`,
      borderRadius:"0 8px 8px 0",padding:"10px 14px",
      marginBottom:"8px",fontSize:"13px",lineHeight:"1.6"
    }}>{children}</div>
  );
}

function Section({ title, icon, children, accent="#4f46e5" }) {
  return (
    <div style={{ marginBottom:"20px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px" }}>
        <span style={{ fontSize:"15px" }}>{icon}</span>
        <span style={{ fontSize:"11px",fontWeight:"700",color:accent,letterSpacing:"1px",textTransform:"uppercase" }}>{title}</span>
        <div style={{ flex:1,height:"1px",background:accent+"25" }}/>
      </div>
      {children}
    </div>
  );
}

function CheckItem({ text }) {
  const [checked, setChecked] = useState(false);
  return (
    <div onClick={() => setChecked(p=>!p)} style={{
      display:"flex",alignItems:"flex-start",gap:"10px",padding:"10px 14px",
      borderRadius:"8px",marginBottom:"6px",cursor:"pointer",
      background:checked?"#f0fdf4":"#f9fafb",
      border:`1.5px solid ${checked?"#86efac":"#e5e7eb"}`,transition:"all 0.2s"
    }}>
      <div style={{
        width:"18px",height:"18px",borderRadius:"4px",flexShrink:0,marginTop:"1px",
        border:`2px solid ${checked?"#16a34a":"#d1d5db"}`,
        background:checked?"#16a34a":"#fff",
        display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"
      }}>
        {checked && <span style={{ color:"#fff",fontSize:"11px",fontWeight:"700" }}>✓</span>}
      </div>
      <span style={{ fontSize:"13px",color:checked?"#16a34a":"#374151",textDecoration:checked?"line-through":"none",transition:"all 0.2s" }}>{text}</span>
    </div>
  );
}

const signalColor = s => ({ HIGH:"#16a34a", MEDIUM:"#d97706", LOW:"#9ca3af" })[s]||"#9ca3af";

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("cloud");
  const [salespersonName, setSalespersonName] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const bottomRef = useRef(null);

  const handleRun = async () => {
    if (!company.trim()) return;
    setLoading(true); setBrief(null); setError(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: company.trim(), domain, salespersonName: salespersonName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setBrief(data.brief);
      setActiveTab("summary");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const TABS = [
    { id:"summary",   label:"📋 Brief",     show:true },
    { id:"people",    label:"👤 People",     show:brief?.personnelChanges?.length>0 },
    { id:"news",      label:"📰 News",       show:brief?.recentNews?.length>0 },
    { id:"tech",      label:"💻 Tech",       show:!!brief?.techLandscape },
    { id:"pitch",     label:"🎯 Pitch",      show:!!brief?.domainFocus },
    { id:"checklist", label:"✅ Checklist",  show:brief?.meetingChecklist?.length>0 },
  ].filter(t=>t.show);

  return (
    <div style={{ fontFamily:"'Inter',sans-serif",minHeight:"100vh",background:"#f0f4f8" }}>

      {/* ── Header / Input ── */}
      <div style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)",color:"#fff",padding:"0 24px" }}>
        <div style={{ maxWidth:"880px",margin:"0 auto",padding:"22px 0 0" }}>

          {/* Logo row */}
          <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px" }}>
            <div style={{ width:"38px",height:"38px",borderRadius:"10px",background:"linear-gradient(135deg,#6366f1,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>🎯</div>
            <div>
              <div style={{ fontSize:"17px",fontWeight:"800",letterSpacing:"-0.3px" }}>Sales Intelligence Agent</div>
              <div style={{ fontSize:"10px",color:"#94a3b8",letterSpacing:"1.2px" }}>IT SERVICES · AI-POWERED PRE-MEETING BRIEFING</div>
            </div>
          </div>

          {/* Input card */}
          <div style={{ background:"rgba(255,255,255,0.06)",borderRadius:"14px",border:"1px solid rgba(255,255,255,0.12)",padding:"20px" }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px" }}>
              <div>
                <label style={{ fontSize:"10px",fontWeight:"700",color:"#94a3b8",letterSpacing:"1px",display:"block",marginBottom:"6px" }}>TARGET COMPANY *</label>
                <input value={company} onChange={e=>setCompany(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleRun()}
                  placeholder="e.g. Maersk, HDFC Bank, Unilever..."
                  disabled={loading}
                  style={{ width:"100%",boxSizing:"border-box",padding:"10px 12px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:"13px",outline:"none" }}
                />
              </div>
              <div>
                <label style={{ fontSize:"10px",fontWeight:"700",color:"#94a3b8",letterSpacing:"1px",display:"block",marginBottom:"6px" }}>YOUR NAME</label>
                <input value={salespersonName} onChange={e=>setSalespersonName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  disabled={loading}
                  style={{ width:"100%",boxSizing:"border-box",padding:"10px 12px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:"13px",outline:"none" }}
                />
              </div>
            </div>

            <div style={{ marginBottom:"16px" }}>
              <label style={{ fontSize:"10px",fontWeight:"700",color:"#94a3b8",letterSpacing:"1px",display:"block",marginBottom:"8px" }}>YOUR DOMAIN FOCUS</label>
              <div style={{ display:"flex",flexWrap:"wrap",gap:"6px" }}>
                {DOMAINS.map(d=>(
                  <button key={d.id} onClick={()=>setDomain(d.id)} style={{
                    padding:"6px 14px",borderRadius:"20px",border:"1.5px solid",
                    borderColor:domain===d.id?"#6366f1":"rgba(255,255,255,0.15)",
                    background:domain===d.id?"#6366f1":"rgba(255,255,255,0.06)",
                    color:domain===d.id?"#fff":"#94a3b8",
                    fontSize:"12px",fontWeight:"600",cursor:"pointer",transition:"all 0.2s"
                  }}>{d.icon} {d.label}</button>
                ))}
              </div>
              {domain && <div style={{ fontSize:"11px",color:"#475569",marginTop:"6px" }}>
                Focus: {DOMAINS.find(d=>d.id===domain)?.focus}
              </div>}
            </div>

            <div style={{ display:"flex",justifyContent:"flex-end",gap:"10px",alignItems:"center" }}>
              {brief && (
                <button onClick={()=>exportToWord(brief,company,domain,salespersonName)} style={{
                  padding:"10px 18px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.2)",
                  background:"rgba(255,255,255,0.08)",color:"#e2e8f0",
                  fontSize:"13px",fontWeight:"600",cursor:"pointer"
                }}>📥 Download Word</button>
              )}
              <button onClick={handleRun} disabled={loading||!company.trim()} style={{
                padding:"10px 28px",borderRadius:"8px",border:"none",
                background:loading||!company.trim()?"rgba(99,102,241,0.3)":"linear-gradient(135deg,#6366f1,#06b6d4)",
                color:loading||!company.trim()?"#94a3b8":"#fff",
                fontSize:"13px",fontWeight:"700",cursor:loading||!company.trim()?"not-allowed":"pointer",
                transition:"all 0.2s",minWidth:"150px",display:"flex",alignItems:"center",gap:"8px",justifyContent:"center"
              }}>
                {loading ? (
                  <>
                    <span style={{ width:"12px",height:"12px",border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block" }}/>
                    Researching...
                  </>
                ) : "Brief Me 🚀"}
              </button>
            </div>
          </div>
          <div style={{ height:"18px" }}/>
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ maxWidth:"880px",margin:"0 auto",padding:"20px 24px" }}>

        {error && (
          <div style={{ background:"#fef2f2",border:"1.5px solid #fecaca",borderRadius:"10px",padding:"14px 18px",color:"#dc2626",fontSize:"13px",marginBottom:"16px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ background:"#fff",borderRadius:"12px",border:"1.5px solid #e2e8f0",padding:"32px",textAlign:"center" }}>
            <div style={{ fontSize:"36px",marginBottom:"12px" }}>🔍</div>
            <div style={{ fontSize:"15px",fontWeight:"700",color:"#1e293b",marginBottom:"6px" }}>Researching {company}...</div>
            <div style={{ fontSize:"12px",color:"#94a3b8" }}>Searching the web for latest news, personnel changes & business signals</div>
            <div style={{ display:"flex",justifyContent:"center",gap:"6px",marginTop:"16px" }}>
              {["Scanning news","Tracking leadership","Analysing tech stack","Building pitch"].map((s,i)=>(
                <div key={i} style={{ fontSize:"11px",background:"#f0f4ff",color:"#6366f1",padding:"4px 10px",borderRadius:"12px",fontWeight:"600",border:"1px solid #c7d2fe",opacity:0.7+i*0.1 }}>{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!brief && !loading && !error && (
          <div style={{ textAlign:"center",padding:"60px 24px",color:"#94a3b8" }}>
            <div style={{ fontSize:"52px",marginBottom:"14px" }}>🎯</div>
            <div style={{ fontSize:"20px",fontWeight:"800",color:"#1e293b",marginBottom:"8px" }}>Walk into every meeting fully prepared</div>
            <div style={{ fontSize:"14px",color:"#64748b",maxWidth:"440px",margin:"0 auto",lineHeight:"1.7" }}>
              Enter a company name, pick your IT domain, and get a tailored intelligence brief — personnel changes, pain points, buying signals, and a domain-tuned pitch.
            </div>
            <div style={{ display:"flex",gap:"8px",justifyContent:"center",marginTop:"22px",flexWrap:"wrap" }}>
              {["Live Web Search","Personnel Tracking","Domain-Tuned Pitch","Word Export","Buying Signals","Competitive Intel"].map(tag=>(
                <span key={tag} style={{ fontSize:"11px",background:"#f0f4ff",color:"#6366f1",padding:"4px 12px",borderRadius:"20px",fontWeight:"600",border:"1px solid #c7d2fe" }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Brief output */}
        {brief && (
          <div>
            {/* Company header */}
            <div style={{ background:"#fff",borderRadius:"12px",border:"1.5px solid #e2e8f0",padding:"18px 22px",marginBottom:"14px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"12px" }}>
              <div>
                <div style={{ fontSize:"22px",fontWeight:"800",color:"#1a1a2e",letterSpacing:"-0.5px" }}>{brief.companySnapshot?.name||company}</div>
                <div style={{ fontSize:"13px",color:"#64748b",marginTop:"2px" }}>{brief.companySnapshot?.oneLiner}</div>
                <div style={{ marginTop:"8px" }}>
                  {brief.companySnapshot?.industry && <Badge label={brief.companySnapshot.industry} color="#6366f1"/>}
                  {brief.companySnapshot?.hq && <Badge label={"📍 "+brief.companySnapshot.hq} color="#0ea5e9"/>}
                  {brief.companySnapshot?.employees && <Badge label={"👥 "+brief.companySnapshot.employees} color="#10b981"/>}
                  {brief.companySnapshot?.revenue && <Badge label={"💰 "+brief.companySnapshot.revenue} color="#f59e0b"/>}
                  <Badge label={"Confidence: "+(brief.confidence||"MEDIUM")} color={brief.confidence==="HIGH"?"#16a34a":"#d97706"}/>
                </div>
              </div>
              <button onClick={()=>exportToWord(brief,company,domain,salespersonName)} style={{
                padding:"10px 20px",borderRadius:"8px",border:"1.5px solid #6366f1",
                background:"#f0f4ff",color:"#6366f1",fontSize:"13px",fontWeight:"700",cursor:"pointer",whiteSpace:"nowrap"
              }}>📥 Download Word</button>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex",gap:"4px",background:"#fff",padding:"6px",borderRadius:"10px",border:"1.5px solid #e2e8f0",marginBottom:"14px",flexWrap:"wrap" }}>
              {TABS.map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
                  padding:"7px 16px",borderRadius:"7px",border:"none",fontSize:"12px",
                  fontWeight:"600",cursor:"pointer",transition:"all 0.2s",
                  background:activeTab===tab.id?"#6366f1":"transparent",
                  color:activeTab===tab.id?"#fff":"#64748b"
                }}>{tab.label}</button>
              ))}
            </div>

            {/* Tab content panels */}
            <div style={{ background:"#fff",borderRadius:"12px",border:"1.5px solid #e2e8f0",padding:"22px" }}>

              {activeTab==="summary" && (
                <>
                  <Section title="Why Meet Now" icon="⚡" accent="#6366f1">
                    <div style={{ fontSize:"14px",color:"#374151",lineHeight:"1.8",background:"#f0f4ff",padding:"14px 16px",borderRadius:"8px",borderLeft:"4px solid #6366f1" }}>
                      {brief.executiveSummary}
                    </div>
                  </Section>
                  {brief.buyingSignals?.length>0 && (
                    <Section title="Buying Signals" icon="📡" accent="#10b981">
                      {brief.buyingSignals.map((s,i)=>(
                        <Card key={i} accent={signalColor(s.strength)}>
                          <div style={{ display:"flex",justifyContent:"space-between",gap:"8px" }}>
                            <span style={{ color:"#374151" }}>{s.signal}</span>
                            <Badge label={s.strength} color={signalColor(s.strength)}/>
                          </div>
                          <div style={{ fontSize:"11px",color:"#94a3b8",marginTop:"4px" }}>Source: {s.source}</div>
                        </Card>
                      ))}
                    </Section>
                  )}
                  {brief.painPoints?.length>0 && (
                    <Section title="Pain Points" icon="🔥" accent="#ef4444">
                      {brief.painPoints.map((p,i)=>(
                        <Card key={i} accent="#ef4444">
                          <div style={{ fontWeight:"700",color:"#1e293b",marginBottom:"4px" }}>{p.pain}</div>
                          <div style={{ fontSize:"12px",color:"#64748b" }}>Evidence: {p.evidence}</div>
                          <div style={{ fontSize:"12px",color:"#6366f1",marginTop:"4px" }}>💡 Our angle: {p.ourAngle}</div>
                        </Card>
                      ))}
                    </Section>
                  )}
                  {brief.conversationStarters?.length>0 && (
                    <Section title="Conversation Starters" icon="💬" accent="#f59e0b">
                      {brief.conversationStarters.map((c,i)=>(
                        <Card key={i} accent="#f59e0b">
                          <div style={{ fontStyle:"italic",fontWeight:"600",color:"#1e293b",marginBottom:"4px" }}>"{c.opener}"</div>
                          <div style={{ fontSize:"12px",color:"#64748b" }}>{c.context}</div>
                        </Card>
                      ))}
                    </Section>
                  )}
                </>
              )}

              {activeTab==="people" && (
                <Section title="Personnel Changes" icon="👤" accent="#8b5cf6">
                  {brief.personnelChanges?.map((p,i)=>(
                    <Card key={i} accent="#8b5cf6">
                      <div style={{ fontWeight:"700",color:"#1e293b" }}>{p.name}</div>
                      <div style={{ fontSize:"12px",color:"#6366f1" }}>{p.change}: {p.title}</div>
                      <div style={{ fontSize:"11px",color:"#94a3b8",marginBottom:"6px" }}>{p.date}</div>
                      <div style={{ fontSize:"12px",color:"#374151",background:"#f5f3ff",padding:"6px 10px",borderRadius:"6px" }}>
                        🎯 Sales signal: {p.salesSignal}
                      </div>
                    </Card>
                  ))}
                </Section>
              )}

              {activeTab==="news" && (
                <Section title="Recent News" icon="📰" accent="#0ea5e9">
                  {brief.recentNews?.map((n,i)=>(
                    <Card key={i} accent="#0ea5e9">
                      <div style={{ fontWeight:"700",color:"#1e293b",marginBottom:"4px" }}>{n.headline}</div>
                      <div style={{ fontSize:"11px",color:"#94a3b8",marginBottom:"6px" }}>{n.date}</div>
                      <div style={{ fontSize:"12px",color:"#374151" }}>{n.summary}</div>
                      <div style={{ fontSize:"12px",color:"#0ea5e9",marginTop:"6px" }}>💼 IT relevance: {n.itRelevance}</div>
                    </Card>
                  ))}
                </Section>
              )}

              {activeTab==="tech" && (
                <>
                  <Section title="Technology Landscape" icon="💻" accent="#10b981">
                    {brief.techLandscape?.knownStack?.length>0 && (
                      <div style={{ marginBottom:"14px" }}>
                        <div style={{ fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px" }}>KNOWN STACK</div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:"6px" }}>
                          {brief.techLandscape.knownStack.map((t,i)=><Badge key={i} label={t} color="#10b981"/>)}
                        </div>
                      </div>
                    )}
                    {brief.techLandscape?.recentInvestments?.length>0 && (
                      <div style={{ marginBottom:"14px" }}>
                        <div style={{ fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px" }}>RECENT INVESTMENTS</div>
                        {brief.techLandscape.recentInvestments.map((t,i)=><Card key={i} accent="#10b981">💰 {t}</Card>)}
                      </div>
                    )}
                    {brief.techLandscape?.cloudPosture && (
                      <div style={{ marginBottom:"14px" }}>
                        <div style={{ fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px" }}>CLOUD POSTURE</div>
                        <Card accent="#06b6d4">☁️ {brief.techLandscape.cloudPosture}</Card>
                      </div>
                    )}
                    {brief.techLandscape?.gaps?.length>0 && (
                      <div>
                        <div style={{ fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px" }}>IDENTIFIED GAPS — OUR OPPORTUNITY</div>
                        {brief.techLandscape.gaps.map((g,i)=><Card key={i} accent="#ef4444">🎯 {g}</Card>)}
                      </div>
                    )}
                  </Section>
                  {brief.competitiveIntel && (
                    <Section title="Competitive Intel" icon="⚔️" accent="#f59e0b">
                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px" }}>
                        <div>
                          <div style={{ fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"6px" }}>KNOWN VENDORS</div>
                          {(brief.competitiveIntel.knownVendors||[]).map((v,i)=><Badge key={i} label={v} color="#6366f1"/>)}
                        </div>
                        <div>
                          <div style={{ fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"6px" }}>INCUMBENTS</div>
                          {(brief.competitiveIntel.incumbents||[]).map((v,i)=><Badge key={i} label={v} color="#f59e0b"/>)}
                        </div>
                      </div>
                      {brief.competitiveIntel.displacementOpportunity && (
                        <Card accent="#10b981">🎯 {brief.competitiveIntel.displacementOpportunity}</Card>
                      )}
                    </Section>
                  )}
                </>
              )}

              {activeTab==="pitch" && (
                <>
                  <Section title={`Domain Pitch — ${DOMAINS.find(d=>d.id===domain)?.icon} ${brief.domainFocus?.area}`} icon="🎯" accent="#6366f1">
                    <div style={{ background:"linear-gradient(135deg,#f0f4ff,#faf5ff)",border:"1.5px solid #c7d2fe",borderRadius:"10px",padding:"16px",marginBottom:"16px" }}>
                      <div style={{ fontSize:"11px",fontWeight:"700",color:"#6366f1",marginBottom:"6px" }}>KEY MESSAGE</div>
                      <div style={{ fontSize:"15px",fontWeight:"700",color:"#1e293b",lineHeight:"1.5" }}>{brief.domainFocus?.keyMessage}</div>
                    </div>
                    {brief.domainFocus?.suggestedServices?.length>0 && (
                      <div style={{ marginBottom:"14px" }}>
                        <div style={{ fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px" }}>SERVICES TO PITCH</div>
                        {brief.domainFocus.suggestedServices.map((s,i)=><Card key={i} accent="#6366f1">✅ {s}</Card>)}
                      </div>
                    )}
                    {brief.domainFocus?.avoidTopics?.length>0 && (
                      <div>
                        <div style={{ fontSize:"11px",fontWeight:"700",color:"#64748b",marginBottom:"8px" }}>TOPICS TO AVOID</div>
                        {brief.domainFocus.avoidTopics.map((t,i)=><Card key={i} accent="#f59e0b">⚠️ {t}</Card>)}
                      </div>
                    )}
                  </Section>
                  {brief.riskFlags?.length>0 && (
                    <Section title="Risk Flags" icon="⚠️" accent="#f59e0b">
                      {brief.riskFlags.map((r,i)=>(
                        <Card key={i} accent="#f59e0b">
                          <div style={{ fontWeight:"700",color:"#1e293b" }}>{r.flag}</div>
                          <div style={{ fontSize:"12px",color:"#64748b",marginTop:"4px" }}>Mitigation: {r.mitigation}</div>
                        </Card>
                      ))}
                    </Section>
                  )}
                </>
              )}

              {activeTab==="checklist" && (
                <Section title="Pre-Meeting Checklist" icon="✅" accent="#10b981">
                  {brief.meetingChecklist?.map((item,i)=><CheckItem key={i} text={item}/>)}
                </Section>
              )}

            </div>
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        input::placeholder { color: #64748b; }
        input:focus { border-color: rgba(99,102,241,0.6) !important; }
      `}</style>
    </div>
  );
}
