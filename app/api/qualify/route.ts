import { NextRequest, NextResponse } from "next/server";
import type { LeadInput, QualificationResult } from "@/lib/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are an AI Lead Qualification and Logging Engine for automated business workflows.

Your job is to:
Analyze incoming leads
Score and classify them
Structure results for automation
Prepare data for Google Sheets storage

You do NOT chat.
You do NOT explain.
You ONLY return structured JSON.

CONTEXT

Businesses receive leads from websites, ads, and forms.
Most leads are not ready to convert.
Manual sorting wastes time and reduces sales speed.
Your system ensures:
High-intent leads are prioritized instantly
Low-intent leads are stored but not prioritized
Every lead is structured for Google Sheets logging

LEAD EVALUATION FRAMEWORK

Evaluate based on intent signals:

HIGH INTENT SIGNALS
Clear request (buy / hire / book / need now)
Budget provided
Short timeline (0–3 months)
Specific requirements mentioned
Action-oriented language

MEDIUM INTENT SIGNALS
Some interest shown
Partial budget or unclear range
Timeline 3–6 months
Needs more information

LOW INTENT SIGNALS
"Just browsing"
No budget
No timeline
Vague inquiry
Long-term interest (6+ months)

SCORING RULE

Return a score from 1–10:
9–10 → HOT (ready to convert)
7–8 → HIGH (strong intent)
5–6 → MEDIUM (needs nurturing)
1–4 → LOW (not qualified)

OUTPUT FORMAT (STRICT JSON ONLY)

Return exactly this structure:

{
  "lead_score": 0,
  "priority": "",
  "buyer_intent": "",
  "urgency": "",
  "estimated_value": "",
  "summary": "",
  "recommended_action": "",
  "agent_message": "",
  "google_sheets_row": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "budget": "",
    "category": "",
    "lead_score": 0,
    "priority": "",
    "urgency": "",
    "summary": "",
    "recommended_action": ""
  }
}

FIELD DEFINITIONS
lead_score: Integer 1-10 only
priority: HOT / HIGH / MEDIUM / LOW
buyer_intent: One clear sentence describing intent
urgency: Immediate / 1-3 Months / 3-6 Months / Unknown
estimated_value: Low / Medium / High
summary: Max 20-25 words describing lead quality
recommended_action: Short instruction max 10-12 words
agent_message: Internal note for sales team max 15 words

STRICT RULES
Output ONLY valid JSON
No markdown
No explanations
No extra text
Never hallucinate missing data
If data is missing leave empty string ""
Keep structure identical every time`;

function buildUserPrompt(lead: LeadInput): string {
  return `Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Location: ${lead.location}
Budget: ${lead.budget}
Category: ${lead.category}
Message: ${lead.message}`;
}

function mockQualify(lead: LeadInput): QualificationResult {
  const budgetNum = parseFloat(lead.budget.replace(/[^0-9.]/g, "")) || 0;
  const hasUrgencyWords = /quick|now|asap|urgent|immediately|soon|ready|approved/i.test(lead.message);
  const hasFinancingWords = /mortgage|approved|cash|pre-approved|financing/i.test(lead.message);
  const messageLength = lead.message.trim().length;

  let score = 5;
  if (budgetNum > 1000000) score += 2;
  else if (budgetNum > 500000) score += 1;
  if (hasUrgencyWords) score += 1;
  if (hasFinancingWords) score += 2;
  if (messageLength > 100) score += 1;
  if (messageLength < 20) score -= 2;
  score = Math.min(10, Math.max(1, score));

  const priority = score >= 9 ? "HOT" : score >= 7 ? "HIGH" : score >= 5 ? "MEDIUM" : "LOW";
  const urgency = hasUrgencyWords ? "Immediate" : hasFinancingWords ? "1–3 Months" : "Unknown";
  const summary = `${priority} priority lead with ${urgency.toLowerCase()} timeline seeking ${lead.category}.`;

  return {
    lead_score: score,
    priority,
    buyer_intent: hasFinancingWords
      ? "Buyer has financing in place and shows strong purchase intent."
      : "Buyer is exploring options with moderate purchase intent.",
    urgency,
    estimated_value: budgetNum > 800000 ? "High" : budgetNum > 400000 ? "Medium" : "Low",
    summary,
    recommended_action:
      priority === "HOT" ? "Call immediately." :
      priority === "HIGH" ? "Call within 24 hours." :
      "Add to nurture email sequence.",
    agent_message:
      priority === "HOT" ? "Prioritize over all other leads immediately." :
      priority === "HIGH" ? "Strong candidate, follow up soon." :
      "Standard nurture sequence recommended.",
    google_sheets_row: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      location: lead.location,
      budget: lead.budget,
      category: lead.category,
      lead_score: score,
      priority,
      urgency,
      summary,
      recommended_action:
        priority === "HOT" ? "Call immediately." :
        priority === "HIGH" ? "Call within 24 hours." :
        "Add to nurture email sequence.",
    },
  };
}

async function qualifyWithGroq(lead: LeadInput): Promise<QualificationResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(lead) },
      ],
      temperature: 0.1,
      max_tokens: 800,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");

  return JSON.parse(content) as QualificationResult;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lead: LeadInput = {
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      location: body.location || "",
      budget: body.budget || "",
      category: body.category || "Real Estate",
      message: body.message || "",
    };

    if (!lead.name || !lead.email || !lead.message) {
      return NextResponse.json(
        { error: "name, email, and message are required" },
        { status: 400 }
      );
    }

    // If n8n is configured — forward the full request through the automation pipeline
    // (n8n handles Groq AI + Google Sheets logging + email notification)
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nUrl && n8nUrl.startsWith("https://")) {
      const n8nRes = await fetch(n8nUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });

      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        throw new Error(`n8n webhook error: ${n8nRes.status} — ${errText}`);
      }

      const n8nData = await n8nRes.json();
      return NextResponse.json({
        success: true,
        qualification: n8nData.qualification,
        lead,
      });
    }

    // Fallback: call Groq directly (no Google Sheets, no email)
    let qualification: QualificationResult;

    try {
      if (process.env.GROQ_API_KEY) {
        qualification = await qualifyWithGroq(lead);
      } else {
        qualification = mockQualify(lead);
      }
    } catch {
      qualification = mockQualify(lead);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    const supabaseReady = supabaseUrl.startsWith("https://") && supabaseKey.length > 10;

    if (supabaseReady) {
      const { createClient } = await import("@supabase/supabase-js");
      const adminClient = createClient(supabaseUrl, supabaseKey);
      await adminClient.from("leads").insert({
        ...lead,
        qualification,
        status: "qualified",
      });
    }

    return NextResponse.json({ success: true, qualification, lead });
  } catch (error) {
    console.error("[qualify] error:", error);
    return NextResponse.json(
      { error: "Qualification failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "AI Lead Qualification Engine — online" });
}
