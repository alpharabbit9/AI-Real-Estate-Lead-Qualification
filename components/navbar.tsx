"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, LayoutDashboard, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Qualify",    href: "/",          icon: Sparkles },
  { label: "Dashboard",  href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads",      href: "/leads",     icon: Users },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center">
            <Building2 size={14} className="text-[#00E5FF]" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            LeadQual<span className="text-[#00E5FF]">.ai</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
                  active
                    ? "text-white"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <Icon size={13} />
                <span className="hidden sm:block">{label}</span>
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Status pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/8 bg-white/3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[10px] text-white/40 uppercase tracking-wider hidden sm:block">AI Online</span>
        </div>
      </div>
    </header>
  );
}
