"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { LeadsTable } from "@/components/leads-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Lead, Priority } from "@/lib/types";

type FilterPriority = Priority | "ALL";

const FILTER_OPTIONS: { label: string; value: FilterPriority }[] = [
  { label: "All", value: "ALL" },
  { label: "Hot", value: "HOT" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterPriority>("ALL");

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  }, []);

  useEffect(() => {
    fetchLeads().finally(() => setLoading(false));
  }, [fetchLeads]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeads();
    setIsRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      await fetch("/api/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Delete failed:", err);
      await fetchLeads();
    }
  };

  const handleStatusChange = async (id: string, status: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error("Status update failed:", err);
      await fetchLeads();
    }
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
          <div className="p-2 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20">
            <Users size={16} className="text-[#4F46E5]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">All Leads</h1>
            <p className="text-xs text-white/40">
              {loading ? "Loading..." : `${filtered.length} of ${leads.length} leads`}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || loading}>
          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
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

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/30 text-sm">
          Loading leads...
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/30 text-sm gap-2">
          <p>No leads yet.</p>
          <p className="text-xs">Submit a lead from the Qualify page to see it here.</p>
        </div>
      ) : (
        <LeadsTable leads={filtered} onDelete={handleDelete} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
