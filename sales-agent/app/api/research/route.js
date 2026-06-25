import { NextResponse } from "next/server";

const DOMAINS = {
  cloud:   "Cloud migration, AWS/Azure/GCP, infrastructure modernization, DevOps, FinOps",
  data:    "Data engineering, ML/AI adoption, analytics platforms, data governance, LLM integration",
  security:"Zero trust, SOC, compliance (SOC2/ISO27001), identity management, threat detection",
  erp:     "SAP S/4HANA migration, Oracle, ERP modernization, business process automation",
  digital: "App modernization, microservices, API platforms, product engineering, UX transformation",
  managed: "IT outsourcing, NOC/SOC, helpdesk, application managed services, SLA optimization",
};

const DOMAIN_LABELS = {
  cloud: "Cloud & Infra", data: "Data & AI", security: "Cybersecurity",
  erp: "ERP & SAP", digital: "Digital Engineering", managed: "Managed Services",
};

function buildPrompt(company, domain, salespersonName) {
  const focus = DOMAINS[domain] || "IT services broadly";
  const label = DOMAIN_LABELS[domain] || domain;

  const system = `You are an elite B2B sales intelligence analyst for an IT services company.
Your job: produce sharp, scannable pre-meeting briefing notes for a sales professional.
Domain focus: ${focus}.
Salesperson: ${salespersonName || "the sales rep"}.
Be specific, factual, and sales-actionable. Flag pain points, buying signals, and conversation starters.
Return ONLY valid JSON matching the exact schema. No markdown, no preamble.`;

  const user = `Research ${company} using web search. Find latest news, leadership changes, tech investments, and business signals.

Return this exact JSON:
{
  "companySnapshot": {
    "name": "...", "industry": "...", "hq": "...", "employees": "...",
    "revenue": "...", "stockTicker": "... or null", "website": "...",
    "oneLiner": "15-word summary"
  },
  "executiveSummary": "3-4 sentences. Why meet NOW? What's their business moment?",
  "personnelChanges": [
    { "name": "...", "change": "Joined as / Promoted to / Departed as",
      "title": "...", "date": "...", "salesSignal": "What this means for IT services sales" }
  ],
  "recentNews": [
    { "headline": "...", "date": "...", "summary": "...",
      "itRelevance": "How this creates an IT services opportunity" }
  ],
  "techLandscape": {
    "knownStack": ["..."], "recentInvestments": ["..."],
    "gaps": ["Likely technology gaps based on: ${focus}"],
    "cloudPosture": "..."
  },
  "painPoints": [
    { "pain": "...", "evidence": "...", "ourAngle": "How we solve this" }
  ],
  "buyingSignals": [
    { "signal": "...", "strength": "HIGH|MEDIUM|LOW", "source": "..." }
  ],
  "competitiveIntel": {
    "knownVendors": ["..."], "incumbents": ["..."],
    "displacementOpportunity": "..."
  },
  "conversationStarters": [
    { "opener": "...", "context": "Why this lands well" }
  ],
  "domainFocus": {
    "area": "${label}",
    "keyMessage": "Single most relevant pitch for this domain at this company",
    "suggestedServices": ["...", "...", "..."],
    "avoidTopics": ["Topics likely to fall flat or be sensitive"]
  },
  "meetingChecklist": ["...", "...", "...", "...", "..."],
  "riskFlags": [{ "flag": "...", "mitigation": "..." }],
  "confidence": "HIGH|MEDIUM|LOW",
  "dataFreshness": "Estimated recency"
}`;

  return { system, user };
}

export async function POST(req) {
  try {
    const { company, domain, salespersonName } = await req.json();

    if (!company?.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const { system, user } = buildPrompt(company.trim(), domain || "cloud", salespersonName?.trim() || "");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: user }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Anthropic API error: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
    const raw = textBlocks.join("");
    const clean = raw.replace(/```json|```/g, "").trim();

    let brief;
    try {
      brief = JSON.parse(clean);
    } catch {
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) brief = JSON.parse(match[0]);
      else return NextResponse.json({ error: "Failed to parse agent response" }, { status: 500 });
    }

    return NextResponse.json({ brief });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
