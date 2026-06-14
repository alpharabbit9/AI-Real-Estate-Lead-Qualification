"use client";

import { useState } from "react";
import { Users, Search, SlidersHorizontal } from "lucide-react";
import { LeadsTable } from "@/components/leads-table";
import { Input } from "@/components/ui/input";
import type { Lead, Priority } from "@/lib/types";

const DEMO_LEADS: Lead[] = [
  {
    id: "1",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    phone: "+1 310 555 0192",
    location: "Beverly Hills, CA",
    budget: "$2,000,000 – $5,000,000",
    category: "Real Estate",
    message: "Pre-approved mortgage, need to move within 30 days. Looking for modern villa with pool and smart home features.",
    status: "qualified",
    qualification: {
      lead_score: 9,
      priority: "HOT",
      buyer_intent: "Ready buyer with financing and urgent 30-day deadline.",
      urgency: "Immediate",
      estimated_value: "High",
      summary: "Pre-approved luxury buyer with urgent 30-day deadline.",
      recommended_action: "Call immediately.",
      agent_message: "Prioritize above all other leads immediately.",
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
    message: "Looking for a 2-bed condo in Midtown. Pre-approval letter ready, prefer to close by Q1.",
    status: "contacted",
    qualification: {
      lead_score: 7,
      priority: "HIGH",
      buyer_intent: "Qualified buyer with financing in place, Q1 close target.",
      urgency: "1–3 Months",
      estimated_value: "Medium",
      summary: "Pre-approved Manhattan condo buyer, Q1 timeline.",
      recommended_action: "Call within 24 hours.",
      agent_message: "Solid candidate — set call by Friday.",
      google_sheets_row: {
        name: "Marcus Chen", email: "marcus@example.com", phone: "+1 646 555 0187",
        location: "Manhattan, NY", budget: "$700,000 – $1,000,000", category: "Real Estate",
        lead_score: 7, priority: "HIGH", urgency: "1–3 Months",
        summary: "Pre-approved Manhattan condo buyer, Q1 timeline.",
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
      buyer_intent: "Early-stage buyer exploring with no defined timeline.",
      urgency: "Unknown",
      estimated_value: "Medium",
      summary: "Early-stage buyer, school district focus, undefined timeline.",
      recommended_action: "Add to nurture email sequence.",
      agent_message: "Nurture sequence. Check in monthly.",
      google_sheets_row: {
        name: "Jennifer Walsh", email: "j.walsh@example.com", phone: "",
        location: "Austin, TX", budget: "$400,000 – $700,000", category: "Real Estate",
        lead_score: 5, priority: "MEDIUM", urgency: "Unknown",
        summary: "Early-stage buyer, school district focus, undefined timeline.",
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
    message: "Just curious about investment properties in Miami. Maybe in the future.",
    status: "qualified",
    qualification: {
      lead_score: 2,
      priority: "LOW",
      buyer_intent: "Casual browser with no intent signals.",
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
  {
    id: "5",
    created_at: new Date(Date.now() - 25200000).toISOString(),
    name: "Amanda Torres",
    email: "amanda.t@company.com",
    phone: "+1 415 555 0234",
    location: "San Francisco, CA",
    budget: "$5,000,000+",
    category: "Commercial Real Estate",
    message: "We need office space for 200+ employees in SoMa. Cash purchase, board-approved. Looking to close within 60 days.",
    status: "contacted",
    qualification: {
      lead_score: 10,
      priority: "HOT",
      buyer_intent: "Corporate cash buyer with board approval and 60-day deadline.",
      urgency: "Immediate",
      estimated_value: "High",
      summary: "Board-approved cash buyer, $5M+ commercial, 60-day close.",
      recommended_action: "Escalate to senior agent immediately.",
      agent_message: "Board-approved cash purchase. Top priority.",
      google_sheets_row: {
        name: "Amanda Torres", email: "amanda.t@company.com", phone: "+1 415 555 0234",
        location: "San Francisco, CA", budget: "$5,000,000+", category: "Commercial Real Estate",
        lead_score: 10, priority: "HOT", urgency: "Immediate",
        summary: "Board-approved cash buyer, $5M+ commercial, 60-day close.",
        recommended_action: "Escalate to senior agent immediately.",
      },
    },
  },
];

type FilterPriority = Priority | "ALL";

const FILTER_OPTIONS: { label: string; value: FilterPriority }[] = [
  { label: "All", value: "ALL" },
  { label: "Hot", value: "HOT" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterPriority>("ALL");

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleStatusChange = (id: string, status: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const filtered = leads.filter((l) => {
    const matchesSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filter === "ALL" || l.qualification?.priority === filter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20">
            <Users size={16} className="text-[#00E5FF]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">All Leads</h1>
            <p className="text-xs text-white/40">{filtered.length} of {leads.length} leads</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Search by name, email, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={13} className="text-white/30 flex-shrink-0" />
          {FILTER_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                filter === value
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {label}
              {value !== "ALL" && (
                <span className="ml-1.5 text-white/30">
                  {leads.filter((l) => l.qualification?.priority === value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <LeadsTable leads={filtered} onDelete={handleDelete} onStatusChange={handleStatusChange} />
    </div>
  );
}
