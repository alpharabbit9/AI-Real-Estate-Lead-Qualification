import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Priority } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "HOT":    return "#FF4444";
    case "HIGH":   return "#FF8C00";
    case "MEDIUM": return "#FFD700";
    case "LOW":    return "#6B7280";
  }
}

export function getPriorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case "HOT":    return "badge-hot";
    case "HIGH":   return "badge-high";
    case "MEDIUM": return "badge-medium";
    case "LOW":    return "badge-low";
  }
}

export function getScoreBarClass(priority: Priority): string {
  switch (priority) {
    case "HOT":    return "score-bar-hot";
    case "HIGH":   return "score-bar-high";
    case "MEDIUM": return "score-bar-medium";
    case "LOW":    return "score-bar-low";
  }
}

export function formatCurrency(value: string): string {
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function getScoreLabel(score: number): string {
  if (score >= 9) return "Exceptional";
  if (score >= 7) return "Strong";
  if (score >= 5) return "Moderate";
  return "Weak";
}
