-- Run this in your Supabase project's SQL Editor (Database > SQL Editor > New query).
-- Paste the whole file and click Run.

create extension if not exists "pgcrypto";

-- ───────────────────────────────────────────
-- Tables
-- ───────────────────────────────────────────

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  category text,
  description text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  name text not null,
  description text,
  price numeric,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- ───────────────────────────────────────────
-- Row Level Security
-- ───────────────────────────────────────────

alter table stores enable row level security;
alter table products enable row level security;

-- Anyone (including logged-out visitors) can read store info — needed for the public storefront page.
create policy "Public can view stores"
  on stores for select
  using (true);

-- Only the owner can create/edit/delete their own store.
create policy "Owners can insert their own store"
  on stores for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own store"
  on stores for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their own store"
  on stores for delete
  using (auth.uid() = owner_id);

-- Anyone can read products — needed for the public storefront page.
create policy "Public can view products"
  on products for select
  using (true);

-- Only the store's owner can create/edit/delete its products.
create policy "Owners can insert products for their store"
  on products for insert
  with check (
    store_id in (select id from stores where owner_id = auth.uid())
  );

create policy "Owners can update products for their store"
  on products for update
  using (
    store_id in (select id from stores where owner_id = auth.uid())
  );

create policy "Owners can delete products for their store"
  on products for delete
  using (
    store_id in (select id from stores where owner_id = auth.uid())
  );
