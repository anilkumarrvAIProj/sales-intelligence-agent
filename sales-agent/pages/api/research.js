export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { company, domain, salespersonName } = req.body;
  if (!company) return res.status(400).json({ error: "Company name required" });

  const DOMAINS = {
    cloud:    "Cloud migration, AWS/Azure/GCP, infrastructure modernization, DevOps, FinOps",
    data:     "Data engineering, ML/AI adoption, analytics platforms, data governance, LLM integration",
    security: "Zero trust, SOC, compliance (SOC2/ISO27001), identity management, threat detection",
    erp:      "SAP S/4HANA migration, Oracle, ERP modernization, business process automation",
    digital:  "App modernization, microservices, API platforms, product engineering, UX transformation",
    managed:  "IT outsourcing, NOC/SOC, helpdesk, application managed services, SLA optimization",
  };

  const domainFocus = DOMAINS[domain] || DOMAINS.cloud;

  const systemPrompt = `You are an elite B2B sales intelligence analyst for an IT services company.
Your job is to produce sharp, scannable pre-meeting briefing notes for a sales professional.
Focus area: ${domainFocus}.
Salesperson: ${salespersonName || "the sales rep"}.
Be specific, factual, and sales-actionable. Flag pain points, buying signals, and conversation starters.
Always return ONLY valid JSON matching the exact schema provided. No markdown, no preamble, no trailing text.`;

  const userPrompt = `Research ${company} and generate a sales intelligence brief. Use web search to find the latest news, leadership changes, tech investments, and business signals.

Return this exact JSON schema:
{
  "companySnapshot": {
    "name": "...",
    "industry": "...",
    "hq": "...",
    "employees": "...",
    "revenue": "...",
    "stockTicker": "... or null",
    "website": "...",
    "oneLiner": "15-word summary of what this company does"
  },
  "executiveSummary": "3-4 sentence meeting context. Why are we meeting them NOW?",
  "personnelChanges": [
    { "name": "...", "change": "Joined as / Promoted to / Departed as", "title": "...", "date": "...", "salesSignal": "What this means for IT services sales" }
  ],
  "recentNews": [
    { "headline": "...", "date": "...", "summary": "...", "itRelevance": "How this creates an IT services opportunity" }
  ],
  "techLandscape": {
    "knownStack": ["..."],
    "recentInvestments": ["..."],
    "gaps": ["Likely technology gaps based on domain focus"],
    "cloudPosture": "..."
  },
  "painPoints": [
    { "pain": "...", "evidence": "...", "ourAngle": "How we solve this" }
  ],
  "buyingSignals": [
    { "signal": "...", "strength": "HIGH|MEDIUM|LOW", "source": "..." }
  ],
  "competitiveIntel": {
    "knownVendors": ["..."],
    "incumbents": ["..."],
    "displacementOpportunity": "..."
  },
  "conversationStarters": [
    { "opener": "...", "context": "Why this lands well" }
  ],
  "domainFocus": {
    "area": "...",
    "keyMessage": "The single most relevant pitch for this domain at this company",
    "suggestedServices": ["...", "...", "..."],
    "avoidTopics": ["Topics likely to fall flat or be sensitive"]
  },
  "meetingChecklist": ["...", "...", "...", "...", "..."],
  "riskFlags": [
    { "flag": "...", "mitigation": "..." }
  ],
  "confidence": "HIGH|MEDIUM|LOW",
  "dataFreshness": "Estimated recency of information"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: systemPrompt,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();

    if (data.error) return res.status(500).json({ error: data.error.message });

    const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
    const raw = textBlocks.join("");
    const clean = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else return res.status(500).json({ error: "Failed to parse agent response" });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
