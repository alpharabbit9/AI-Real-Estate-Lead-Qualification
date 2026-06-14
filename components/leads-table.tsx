"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, getPriorityColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Lead, Priority } from "@/lib/types";
import { ChevronDown, Trash2, Phone } from "lucide-react";

const PRIORITY_BADGE: Record<Priority, "hot" | "high" | "medium" | "low"> = {
  HOT: "hot", HIGH: "high", MEDIUM: "medium", LOW: "low",
};

interface LeadsTableProps {
  leads: Lead[];
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Lead["status"]) => void;
}

export function LeadsTable({ leads, onDelete, onStatusChange }: LeadsTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (leads.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4">📭</div>
        <p className="text-white/50 text-sm">No leads yet. Submit your first lead to get started.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {leads.map((lead, i) => {
        const q = lead.qualification;
        const isExpanded = expanded === lead.id;
        const priority = q?.priority ?? "LOW";

        return (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className={`overflow-hidden transition-all duration-200 ${isExpanded ? "border-white/15" : "hover:border-white/12"}`}>
              {/* Row */}
              <button
                className="w-full px-5 py-4 flex items-center gap-4 text-left"
                onClick={() => setExpanded(isExpanded ? null : lead.id)}
              >
                {/* Score */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${getPriorityColor(priority)}20`,
                    color: getPriorityColor(priority),
                    border: `1px solid ${getPriorityColor(priority)}30`,
                  }}
                >
                  {q?.lead_score ?? "?"}
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{lead.name}</div>
                  <div className="text-xs text-white/40 truncate">{lead.email}</div>
                </div>

                {/* Priority */}
                <Badge variant={PRIORITY_BADGE[priority]} className="hidden sm:inline-flex">
                  {priority}
                </Badge>

                {/* Location */}
                <span className="hidden md:block text-xs text-white/40 truncate max-w-[120px]">
                  {lead.location}
                </span>

                {/* Date */}
                <span className="hidden lg:block text-xs text-white/30 flex-shrink-0">
                  {formatDate(lead.created_at)}
                </span>

                {/* Chevron */}
                <ChevronDown
                  size={14}
                  className={`text-white/30 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {/* Expanded */}
              <AnimatePresence>
                {isExpanded && q && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <Detail label="Budget" value={lead.budget} />
                        <Detail label="Category" value={lead.category} />
                        <Detail label="Urgency" value={q.urgency} />
                        <Detail label="Buyer Intent" value={q.buyer_intent} />
                        <Detail label="Recommended Action" value={q.recommended_action} />
                        <Detail label="Agent Note" value={q.agent_message} />
                      </div>

                      <div className="rounded-xl bg-white/3 border border-white/5 p-3 mb-4">
                        <p className="text-xs text-white/60 leading-relaxed">{lead.message}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="accent"
                          onClick={() => onStatusChange?.(lead.id, "contacted")}
                        >
                          <Phone size={12} />
                          Mark Contacted
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStatusChange?.(lead.id, "closed")}
                        >
                          Mark Closed
                        </Button>
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(lead.id)}
                          >
                            <Trash2 size={12} />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-white/30 mb-0.5">{label}</div>
      <div className="text-xs text-white/70 leading-snug">{value}</div>
    </div>
  );
}
