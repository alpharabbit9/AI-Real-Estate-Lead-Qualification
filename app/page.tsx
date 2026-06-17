import { Sparkles, Shield, Zap, BarChart3 } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { N8nBadge } from "@/components/n8n-badge";

const FEATURES = [
  {
    icon: Zap,
    label: "Instant Scoring",
    desc: "1–10 AI score with priority classification in under 2 seconds",
  },
  {
    icon: BarChart3,
    label: "Deal Potential",
    desc: "Estimates value and urgency from natural language inquiry",
  },
  {
    icon: Shield,
    label: "Agent Notes",
    desc: "Generates email subjects and next-action recommendations",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6 pt-6">
        <div className="flex justify-center">
          <N8nBadge />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
          Qualify Every Lead
          <br />
          <span className="text-[#E2E8F0]">Instantly.</span>
        </h1>

        <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Real estate teams close more deals by prioritizing the right buyers.
          Our AI engine scores every inquiry in seconds — so agents always know
          who to call first.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/8 bg-white/3 text-sm text-white/60"
              title={desc}
            >
              <Icon size={13} className="text-[#E2E8F0]" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section>
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-[#E2E8F0]/10 border border-[#E2E8F0]/20">
              <Sparkles size={16} className="text-[#E2E8F0]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">New Lead Qualification</h2>
              <p className="text-xs text-white/40">Fill in the inquiry details below</p>
            </div>
          </div>

          {/* Form container */}
          <div className="card-premium p-6 sm:p-8">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Submit Inquiry", desc: "Paste or type the lead's inquiry details into the form above." },
            { step: "02", title: "AI Qualifies", desc: "Groq LLaMA 3.3 analyzes intent, budget, urgency, and language cues." },
            { step: "03", title: "Agents Act", desc: "Receive a score, priority tag, and exact next action to close the deal." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="card-premium p-6 relative overflow-hidden">
              <div className="text-6xl font-bold text-white/4 absolute top-2 right-4 select-none leading-none">
                {step}
              </div>
              <div className="relative">
                <div className="text-[#E2E8F0] text-xs font-mono mb-2">{step}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
