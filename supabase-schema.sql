-- ─── ISQ Studios — Supabase Schema ──────────────────────────────────────────
-- Run this entire file in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tgiedzllcimqpgudoekk/sql/new

-- ─── Variants ────────────────────────────────────────────────────────────────
create table if not exists public.variants (
  id            uuid primary key default gen_random_uuid(),
  sku           text unique not null,
  product_id    text not null,
  gsm           text not null,
  color         text not null,
  size          text not null,
  price         numeric(10,2) not null,
  qty           integer not null default 0,
  weight        integer not null default 0,
  barcode       text,
  availability  text not null default 'in_stock'
                check (availability in ('in_stock','low_stock','out_of_stock')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger variants_updated_at
  before update on public.variants
  for each row execute function public.set_updated_at();

-- ─── Orders ──────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  customer_email  text,
  customer_name   text,
  status          text not null default 'pending'
                  check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  subtotal        numeric(10,2) not null default 0,
  shipping        numeric(10,2) not null default 0,
  total           numeric(10,2) not null default 0,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ─── Order Items ─────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  sku           text not null,
  product_name  text not null,
  color         text not null,
  size          text not null,
  gsm           text,
  price         numeric(10,2) not null,
  qty           integer not null default 1,
  image_url     text,
  created_at    timestamptz not null default now()
);

-- ─── Media ───────────────────────────────────────────────────────────────────
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  category    text not null check (category in ('tee','cap')),
  gsm         text,
  color       text not null,
  angle       text not null,
  url         text not null,
  filename    text not null,
  created_at  timestamptz not null default now()
);

-- ─── Row Level Security (open for now — lock down before going live) ──────────
alter table public.variants   enable row level security;
alter table public.orders     enable row level security;
alter table public.order_items enable row level security;
alter table public.media      enable row level security;

-- Allow anon reads on variants and media (public store)
create policy "Public read variants"  on public.variants   for select using (true);
create policy "Public read media"     on public.media       for select using (true);

-- Allow anon inserts on orders (customers placing orders)
create policy "Anon insert orders"      on public.orders      for insert with check (true);
create policy "Anon insert order_items" on public.order_items for insert with check (true);

-- Allow anon reads on orders (for order confirmation page)
create policy "Anon read orders"      on public.orders      for select using (true);
create policy "Anon read order_items" on public.order_items for select using (true);

-- Allow all operations for admin (anon key — tighten with auth later)
create policy "Admin all variants"    on public.variants   for all using (true);
create policy "Admin all media"       on public.media      for all using (true);
create policy "Admin all orders"      on public.orders     for all using (true);
