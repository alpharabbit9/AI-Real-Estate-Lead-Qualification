"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, Mail, Phone, MapPin, Tag, DollarSign, MessageSquare,
  Sparkles, Loader2, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { QualificationCard } from "@/components/qualification-card";
import type { LeadInput, QualificationResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  name:     z.string().min(2, "Name is required"),
  email:    z.string().email("Valid email required"),
  phone:    z.string().optional().default(""),
  location: z.string().min(2, "Location is required"),
  budget:   z.string().min(1, "Budget is required"),
  category: z.string().min(1, "Category is required"),
  message:  z.string().min(10, "Please provide more details (min 10 characters)"),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = [
  "Real Estate",
  "Luxury Villa",
  "Condo / Apartment",
  "Single Family Home",
  "Commercial Real Estate",
  "Investment Property",
  "Land / Lot",
  "Multi-Family",
  "Townhouse",
];

const BUDGET_RANGES = [
  "Under $200,000",
  "$200,000 – $400,000",
  "$400,000 – $700,000",
  "$700,000 – $1,000,000",
  "$1,000,000 – $2,000,000",
  "$2,000,000 – $5,000,000",
  "$5,000,000+",
];

interface FieldWrapperProps {
  icon: React.ReactNode;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FieldWrapper({ icon, label, error, children }: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-white/30">{icon}</span>
        <Label>{label}</Label>
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LeadForm() {
  const [result, setResult] = useState<QualificationResult | null>(null);
  const [submittedLead, setSubmittedLead] = useState<LeadInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Qualification failed");

      setResult(data.qualification);
      setSubmittedLead(values as LeadInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setSubmittedLead(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldWrapper icon={<User size={14} />} label="Full Name" error={errors.name?.message}>
                  <Input
                    placeholder="John Anderson"
                    {...register("name")}
                    className={cn(errors.name && "border-red-500/50")}
                  />
                </FieldWrapper>

                <FieldWrapper icon={<Mail size={14} />} label="Email Address" error={errors.email?.message}>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className={cn(errors.email && "border-red-500/50")}
                  />
                </FieldWrapper>

                <FieldWrapper icon={<Phone size={14} />} label="Phone (optional)" error={errors.phone?.message}>
                  <Input
                    type="tel"
                    placeholder="+1 555 000 0000"
                    {...register("phone")}
                  />
                </FieldWrapper>

                <FieldWrapper icon={<MapPin size={14} />} label="Preferred Location" error={errors.location?.message}>
                  <Input
                    placeholder="Beverly Hills, CA"
                    {...register("location")}
                    className={cn(errors.location && "border-red-500/50")}
                  />
                </FieldWrapper>

                <FieldWrapper icon={<Tag size={14} />} label="Category" error={errors.category?.message}>
                  <Select onValueChange={(v) => setValue("category", v, { shouldValidate: true })}>
                    <SelectTrigger className={cn(errors.category && "border-red-500/50")}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldWrapper>

                <FieldWrapper icon={<DollarSign size={14} />} label="Budget Range" error={errors.budget?.message}>
                  <Select onValueChange={(v) => setValue("budget", v, { shouldValidate: true })}>
                    <SelectTrigger className={cn(errors.budget && "border-red-500/50")}>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldWrapper>
              </div>

              <FieldWrapper icon={<MessageSquare size={14} />} label="Message / Inquiry" error={errors.message?.message}>
                <Textarea
                  placeholder="Describe what you're looking for. Include timeline, financing status, specific requirements..."
                  rows={5}
                  {...register("message")}
                  className={cn(errors.message && "border-red-500/50")}
                />
              </FieldWrapper>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <Button type="submit" variant="accent" size="lg" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Qualifying Lead...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Qualify This Lead
                    <ChevronRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <QualificationCard
              result={result}
              lead={submittedLead!}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
