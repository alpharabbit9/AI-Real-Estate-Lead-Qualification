"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, RefreshCw, TrendingUp } from "lucide-react";
import { StatsGrid } from "@/components/stats-grid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "@/lib/utils";
import type { Lead, Priority } from "@/lib/types";

const PRIORITY_BADGE: Record<Priority, "hot" | "high" | "medium" | "low"> = {
  HOT: "hot", HIGH: "high", MEDIUM: "medium", LOW: "low",
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.qualification?.priority === "HOT").length,
    high: leads.filter((l) => l.qualification?.priority === "HIGH").length,
    avgScore:
      leads.reduce((sum, l) => sum + (l.qualification?.lead_score ?? 0), 0) / (leads.length || 1),
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
          <div className="p-2 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20">
            <LayoutDashboard size={16} className="text-[#4F46E5]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            <p className="text-xs text-white/40">Real-time lead intelligence</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || loading}>
          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/30 text-sm">
          Loading leads...
        </div>
      ) : (
        <>
          <StatsGrid stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-5">Priority Breakdown</h3>
              {leads.length === 0 ? (
                <p className="text-xs text-white/25 text-center py-4">No leads yet</p>
              ) : (
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
              )}
            </Card>

            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Priority Queue</h3>
                <Badge variant="accent" className="text-[10px]">Live</Badge>
              </div>
              {leads.length === 0 ? (
                <p className="text-xs text-white/25 text-center py-4">Submit a lead to see it here</p>
              ) : (
                <div className="space-y-2">
                  {[...leads]
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
              )}
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={14} className="text-[#4F46E5]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Recent Activity</h3>
            </div>
            {leads.length === 0 ? (
              <p className="text-xs text-white/25 text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {leads.slice(0, 10).map((lead, i) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
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
            )}
          </Card>
        </>
      )}
    </div>
  );
}
