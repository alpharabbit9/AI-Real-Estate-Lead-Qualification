"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
}

function StatCard({ label, value, sub, icon, color = "#E2E8F0", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="p-5 h-full hover:border-white/15 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
          {sub && (
            <span className="text-xs text-white/30">{sub}</span>
          )}
        </div>
        <div className="text-3xl font-bold text-white mb-1 tabular-nums">{value}</div>
        <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
      </Card>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: {
    total: number;
    hot: number;
    high: number;
    avgScore: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Leads"
        value={stats.total}
        icon={<Users size={16} />}
        color="#E2E8F0"
        delay={0}
      />
      <StatCard
        label="Hot Leads"
        value={stats.hot}
        sub="Priority"
        icon={<Zap size={16} />}
        color="#FF4444"
        delay={0.05}
      />
      <StatCard
        label="Qualified Leads"
        value={stats.high}
        icon={<TrendingUp size={16} />}
        color="#FF8C00"
        delay={0.1}
      />
      <StatCard
        label="Avg. Score"
        value={stats.avgScore > 0 ? stats.avgScore.toFixed(1) : "—"}
        sub="/ 10"
        icon={<BarChart3 size={16} />}
        color="#E2E8F0"
        delay={0.15}
      />
    </div>
  );
}
