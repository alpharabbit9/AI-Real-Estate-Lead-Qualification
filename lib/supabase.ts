import { createClient } from "@supabase/supabase-js";
import type { Lead } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function insertLead(lead: Omit<Lead, "id" | "created_at" | "status">): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .insert({ ...lead, status: "qualified" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<void> {
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
