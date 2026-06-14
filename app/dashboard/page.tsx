"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, RefreshCw, TrendingUp } from "lucide-react";
import { StatsGrid } from "@/components/stats-grid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "@/lib/utils";
import type { Lead, Priority } from "@/lib/types";

const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    phone: "+1 310 555 0192",
    location: "Beverly Hills, CA",
    budget: "$2,000,000 – $5,000,000",
    category: "Real Estate",
    message: "Pre-approved mortgage, need to move within 30 days. Looking for modern villa with pool.",
    status: "qualified",
    qualification: {
      lead_score: 9,
      priority: "HOT",
      buyer_intent: "Ready buyer with pre-approval and urgent 30-day deadline.",
      urgency: "Immediate",
      estimated_value: "High",
      summary: "Pre-approved luxury buyer with urgent 30-day deadline.",
      recommended_action: "Call immediately.",
      agent_message: "Prioritize over all other leads immediately.",
      google_sheets_row: {
        name: "Sarah Mitchell", email: "sarah@example.com", phone: "+1 310 555 0192",
        location: "Beverly Hills, CA", budget: "$2,000,000 – $5,000,000", category: "Real Estate",
        lead_score: 9, priority: "HOT", urgency: "Immediate",
        summary: "Pre-approved luxury buyer with urgent 30-day deadline.",
        recommended_action: "Call immediately.",
      },
    },
  },
  {
    id: "2",
    created_at: new Date(Date.now() - 5400000).toISOString(),
    name: "Marcus Chen",
    email: "marcus@example.com",
    phone: "+1 646 555 0187",
    location: "Manhattan, NY",
    budget: "$700,000 – $1,000,000",
    category: "Real Estate",
    message: "Looking for a 2-bed condo in Midtown. Have pre-approval, flexible but prefer Q1.",
    status: "contacted",
    qualification: {
      lead_score: 7,
      priority: "HIGH",
      buyer_intent: "Qualified buyer with financing in place targeting Q1 close.",
      urgency: "1–3 Months",
      estimated_value: "Medium",
      summary: "Pre-approved Manhattan condo buyer, Q1 target close.",
      recommended_action: "Call within 24 hours.",
      agent_message: "Strong candidate — follow up by end of week.",
      google_sheets_row: {
        name: "Marcus Chen", email: "marcus@example.com", phone: "+1 646 555 0187",
        location: "Manhattan, NY", budget: "$700,000 – $1,000,000", category: "Real Estate",
        lead_score: 7, priority: "HIGH", urgency: "1–3 Months",
        summary: "Pre-approved Manhattan condo buyer, Q1 target close.",
        recommended_action: "Call within 24 hours.",
      },
    },
  },
  {
    id: "3",
    created_at: new Date(Date.now() - 10800000).toISOString(),
    name: "Jennifer Walsh",
    email: "j.walsh@example.com",
    phone: "",
    location: "Austin, TX",
    budget: "$400,000 – $700,000",
    category: "Real Estate",
    message: "Just started looking. Not sure about timeline. Want 3 bed, 2 bath in good school district.",
    status: "qualified",
    qualification: {
      lead_score: 5,
      priority: "MEDIUM",
      buyer_intent: "Early-stage buyer exploring options with no defined timeline.",
      urgency: "Unknown",
      estimated_value: "Medium",
      summary: "Early-stage buyer, school district focus, no urgency defined.",
      recommended_action: "Add to nurture email sequence.",
      agent_message: "Nurture sequence. Check back in 30 days.",
      google_sheets_row: {
        name: "Jennifer Walsh", email: "j.walsh@example.com", phone: "",
        location: "Austin, TX", budget: "$400,000 – $700,000", category: "Real Estate",
        lead_score: 5, priority: "MEDIUM", urgency: "Unknown",
        summary: "Early-stage buyer, school district focus, no urgency defined.",
        recommended_action: "Add to nurture email sequence.",
      },
    },
  },
  {
    id: "4",
    created_at: new Date(Date.now() - 18000000).toISOString(),
    name: "David Park",
    email: "dpark@email.com",
    phone: "",
    location: "Miami, FL",
    budget: "$200,000 – $400,000",
    category: "Real Estate",
    message: "Just curious about prices. Maybe buy in the future.",
    status: "qualified",
    qualification: {
      lead_score: 2,
      priority: "LOW",
      buyer_intent: "Casual browser with no defined intent or timeline.",
      urgency: "Unknown",
      estimated_value: "Low",
      summary: "Low intent browser, no urgency or financing signals.",
      recommended_action: "Add to newsletter drip.",
      agent_message: "Low priority — drip only.",
      google_sheets_row: {
        name: "David Park", email: "dpark@email.com", phone: "",
        location: "Miami, FL", budget: "$200,000 – $400,000", category: "Real Estate",
        lead_score: 2, priority: "LOW", urgency: "Unknown",
        summary: "Low intent browser, no urgency or financing signals.",
        recommended_action: "Add to newsletter drip.",
      },
    },
  },
];

const PRIORITY_BADGE: Record<Priority, "hot" | "high" | "medium" | "low"> = {
  HOT: "hot", HIGH: "high", MEDIUM: "medium", LOW: "low",
};

export default function DashboardPage() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.qualification?.priority === "HOT").length,
    high: leads.filter((l) => l.qualification?.priority === "HIGH").length,
    avgScore:
      leads.reduce((sum, l) => sum + (l.qualification?.lead_score ?? 0), 0) / leads.length || 0,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsRefreshing(false);
  };

  const priorities: { label: Priority; count: number; color: string }[] = [
    { label: "HOT",    count: leads.filter((l) => l.qualification?.priority === "HOT").length,    color: "#FF4444" },
    { label: "HIGH",   count: leads.filter((l) => l.qualification?.priority === "HIGH").length,   color: "#FF8C00" },
    { label: "MEDIUM", count: leads.filter((l) => l.qualification?.priority === "MEDIUM").length, color: "#FFD700" },
    { label: "LOW",    count: leads.filter((l) => l.qualification?.priority === "LOW").length,    color: "#6B7280" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20">
            <LayoutDashboard size={16} className="text-[#00E5FF]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            <p className="text-xs text-white/40">Real-time lead intelligence</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-5">Priority Breakdown</h3>
          <div className="space-y-3">
            {priorities.map(({ label, count, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">{label}</span>
                  <span className="text-white/40 tabular-nums">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: stats.total > 0 ? `${(count / stats.total) * 100}%` : "0%" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Priority Queue</h3>
            <Badge variant="accent" className="text-[10px]">Live</Badge>
          </div>
          <div className="space-y-2">
            {leads
              .sort((a, b) => (b.qualification?.lead_score ?? 0) - (a.qualification?.lead_score ?? 0))
              .slice(0, 5)
              .map((lead) => {
                const q = lead.qualification!;
                return (
                  <div key={lead.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: `${getPriorityColor(q.priority)}20`, color: getPriorityColor(q.priority) }}
                    >
                      {q.lead_score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{lead.name}</div>
                      <div className="text-xs text-white/40 truncate">{q.recommended_action}</div>
                    </div>
                    <Badge variant={PRIORITY_BADGE[q.priority]} className="text-[10px] flex-shrink-0">
                      {q.priority}
                    </Badge>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={14} className="text-[#00E5FF]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: getPriorityColor(lead.qualification?.priority ?? "LOW") }}
              />
              <span className="text-xs text-white/60 flex-1 truncate">
                <span className="text-white">{lead.name}</span>
                {" "}qualified as{" "}
                <span style={{ color: getPriorityColor(lead.qualification?.priority ?? "LOW") }}>
                  {lead.qualification?.priority}
                </span>
                {" "}— Score {lead.qualification?.lead_score}/10
              </span>
              <span className="text-[10px] text-white/25 flex-shrink-0 tabular-nums">
                {new Date(lead.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
