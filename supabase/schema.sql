-- Real Estate Lead Qualification Engine — Supabase Schema

create extension if not exists "uuid-ossp";

create table public.leads (
  id            uuid default uuid_generate_v4() primary key,
  created_at    timestamptz default now() not null,

  -- Lead input
  name          text not null,
  email         text not null,
  location      text not null,
  property_type text not null,
  budget        text not null,
  message       text not null,

  -- Qualification result (stored as jsonb)
  qualification jsonb,

  -- Status lifecycle
  status        text default 'qualified' check (status in ('pending','qualified','contacted','closed'))
);

-- Index for fast dashboard queries
create index leads_created_at_idx   on public.leads (created_at desc);
create index leads_status_idx       on public.leads (status);
create index leads_priority_idx     on public.leads ((qualification->>'priority'));

-- RLS
alter table public.leads enable row level security;

-- Allow all for demo (restrict in production)
create policy "allow_all" on public.leads for all using (true) with check (true);

-- View: dashboard stats
create or replace view public.lead_stats as
select
  count(*)                                                        as total_leads,
  count(*) filter (where qualification->>'priority' = 'HOT')     as hot_leads,
  count(*) filter (where qualification->>'priority' = 'HIGH')    as high_leads,
  count(*) filter (where qualification->>'priority' = 'MEDIUM')  as medium_leads,
  count(*) filter (where qualification->>'priority' = 'LOW')     as low_leads,
  round(avg((qualification->>'lead_score')::numeric), 1)         as avg_score,
  count(*) filter (where status = 'contacted')                   as contacted_leads,
  count(*) filter (where status = 'closed')                      as closed_leads
from public.leads;
