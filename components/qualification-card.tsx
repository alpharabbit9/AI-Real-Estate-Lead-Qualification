"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap, Clock, TrendingUp, Target, User,
  RefreshCw, Copy, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { LeadInput, QualificationResult, Priority } from "@/lib/types";
import { getPriorityColor, getScoreLabel } from "@/lib/utils";

interface QualificationCardProps {
  result: QualificationResult;
  lead: LeadInput;
  onReset?: () => void;
  compact?: boolean;
}

function ScoreRing({ score, priority }: { score: number; priority: Priority }) {
  const color = getPriorityColor(priority);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-white">{score}</div>
        <div className="text-[10px] text-white/40 uppercase tracking-wider">/ 10</div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-white/30">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">{label}</div>
        <div className="text-sm text-white/80 leading-snug">{value}</div>
      </div>
    </div>
  );
}

const PRIORITY_BADGE_VARIANT: Record<Priority, "hot" | "high" | "medium" | "low"> = {
  HOT: "hot",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

export function QualificationCard({ result, lead, onReset }: QualificationCardProps) {
  const [copied, setCopied] = useState(false);

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header Banner */}
      <Card className="overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <ScoreRing score={result.lead_score} priority={result.priority} />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={PRIORITY_BADGE_VARIANT[result.priority]} className="text-sm px-3 py-1 font-semibold">
                {result.priority === "HOT" && "🔥 "}{result.priority}
              </Badge>
              <span className="text-white/30 text-sm">{getScoreLabel(result.lead_score)} Lead</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">{lead.name}</h3>
            <p className="text-sm text-white/50 truncate">{lead.email}</p>
          </div>

          <div className="sm:text-right space-y-1 flex-shrink-0">
            <div className="text-xs text-white/40 uppercase tracking-wider">Estimated Value</div>
            <div
              className="text-2xl font-bold"
              style={{ color: getPriorityColor(result.priority) }}
            >
              {result.estimated_value}
            </div>
            <div className="text-xs text-white/40">{lead.location}</div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="px-6 pb-6">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: getPriorityColor(result.priority) }}
              initial={{ width: "0%" }}
              animate={{ width: `${result.lead_score * 10}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </div>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Qualification</h4>
          <div className="space-y-4">
            <InfoRow
              icon={<Target size={14} />}
              label="Buyer Intent"
              value={result.buyer_intent}
            />
            <InfoRow
              icon={<Clock size={14} />}
              label="Urgency"
              value={result.urgency}
            />
            <InfoRow
              icon={<TrendingUp size={14} />}
              label="Category"
              value={lead.category}
            />
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Agent Intelligence</h4>
          <div className="space-y-4">
            <InfoRow
              icon={<Zap size={14} />}
              label="Recommended Action"
              value={result.recommended_action}
            />
            <InfoRow
              icon={<User size={14} />}
              label="Agent Message"
              value={result.agent_message}
            />
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">AI Summary</h4>
        <p className="text-sm text-white/70 leading-relaxed">{result.summary}</p>
      </Card>

      {/* Actions */}
      {onReset && (
        <div className="flex flex-wrap gap-3">
          <Button variant="accent" className="flex-1 sm:flex-none" onClick={onReset}>
            <RefreshCw size={14} />
            Qualify Another Lead
          </Button>
          <Button variant="outline" onClick={copyJSON}>
            {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy JSON"}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
