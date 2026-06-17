import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white",
        hot:    "bg-red-500/15 text-red-400 border border-red-500/30",
        high:   "bg-orange-500/15 text-orange-400 border border-orange-500/30",
        medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
        low:    "bg-gray-500/15 text-gray-400 border border-gray-500/30",
        accent: "bg-[#E2E8F0]/15 text-[#E2E8F0] border border-[#E2E8F0]/30",
        outline:"border border-white/10 text-white/60",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
