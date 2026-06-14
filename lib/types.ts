export type Priority = "HOT" | "HIGH" | "MEDIUM" | "LOW";
export type Urgency = "Immediate" | "1–3 Months" | "3–6 Months" | "Unknown";
export type EstimatedValue = "Low" | "Medium" | "High";

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  location: string;
  budget: string;
  category: string;
  message: string;
}

export interface GoogleSheetsRow {
  name: string;
  email: string;
  phone: string;
  location: string;
  budget: string;
  category: string;
  lead_score: number;
  priority: Priority;
  urgency: Urgency;
  summary: string;
  recommended_action: string;
}

export interface QualificationResult {
  lead_score: number;
  priority: Priority;
  buyer_intent: string;
  urgency: Urgency;
  estimated_value: EstimatedValue;
  summary: string;
  recommended_action: string;
  agent_message: string;
  google_sheets_row: GoogleSheetsRow;
}

export interface Lead extends LeadInput {
  id: string;
  created_at: string;
  qualification: QualificationResult | null;
  status: "pending" | "qualified" | "contacted" | "closed";
}

export interface DashboardStats {
  total_leads: number;
  hot_leads: number;
  high_leads: number;
  avg_score: number;
  conversion_rate: number;
}
