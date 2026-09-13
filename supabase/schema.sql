-- KBC Gold Jewel — schema for the tables the app needs but the database is missing.
-- Safe to run more than once. Run in: Supabase dashboard -> SQL Editor.

-- ---------------------------------------------------------------------------
-- 1. Admin check. Defined once, reused by every policy below.
--    Mirrors AdminAuthContext: the role lives in the JWT's app_metadata, which
--    only the service key can set, so a user cannot grant it to themselves.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- ---------------------------------------------------------------------------
-- 2. Missing tables
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references auth.users (id) on delete set null,
  name       text not null,
  email      text not null unique,
  avatar     text,
  status     text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text not null unique,
  customer_id      uuid references public.customers (id) on delete set null,
  -- Name and email are snapshots: the order keeps what was true when it was placed.
  customer_name    text not null,
  customer_email   text not null,
  -- items and shipping_address are jsonb, matching products.images / products.variants.
  items            jsonb not null default '[]'::jsonb,
  shipping_address jsonb not null default '{}'::jsonb,
  subtotal         integer not null default 0,
  shipping         integer not null default 0,
  tax              integer not null default 0,
  total            integer not null default 0,
  status           text not null default 'pending'
                     check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status   text not null default 'pending'
                     check (payment_status in ('paid', 'pending', 'refunded', 'failed')),
  created_at       timestamptz not null default now()
);

create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_created_at_idx  on public.orders (created_at desc);
create index if not exists products_category_id_idx on public.products (category_id);

-- Slugs are used as lookup keys by getProduct()/getCategory(), so they must be unique.
create unique index if not exists categories_slug_key on public.categories (slug);
create unique index if not exists products_slug_key   on public.products (slug);

-- ---------------------------------------------------------------------------
-- 3. Customer.orderCount / Customer.totalSpent are derived, so they are computed
--    here rather than stored — one source of truth, nothing to keep in sync.
--    Read this view instead of the customers table.
-- ---------------------------------------------------------------------------
create or replace view public.customers_with_stats
with (security_invoker = on) as
select
  c.*,
  count(o.id)::int                     as order_count,
  coalesce(sum(o.total), 0)::int       as total_spent
from public.customers c
left join public.orders o on o.customer_id = c.id
group by c.id;

-- ---------------------------------------------------------------------------
-- 4. Row level security. Without this the publishable key can write freely.
-- ---------------------------------------------------------------------------
alter table public.products   enable row level security;
alter table public.categories enable row level security;
alter table public.customers  enable row level security;
alter table public.orders     enable row level security;

-- Catalog: anyone may read, only an admin may write.
drop policy if exists "catalog read"  on public.products;
drop policy if exists "catalog write" on public.products;
create policy "catalog read"  on public.products for select using (true);
create policy "catalog write" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "catalog read"  on public.categories;
drop policy if exists "catalog write" on public.categories;
create policy "catalog read"  on public.categories for select using (true);
create policy "catalog write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- Customers and orders: an admin sees everything, a signed-in customer sees only their own.
drop policy if exists "customers admin" on public.customers;
drop policy if exists "customers own"   on public.customers;
create policy "customers admin" on public.customers for all using (public.is_admin()) with check (public.is_admin());
create policy "customers own"   on public.customers for select using (user_id = auth.uid());

drop policy if exists "orders admin" on public.orders;
drop policy if exists "orders own"   on public.orders;
create policy "orders admin" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "orders own"   on public.orders for select
  using (customer_id in (select id from public.customers where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 5. Seed the categories table (it is currently empty, so the admin product
--    form has nothing to select). Ids are uuids generated here — never reuse
--    the old hard-coded "cat-rings" style ids.
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, description) values
  ('Rings',     'rings',     'Solitaires, bands, and statement rings crafted for everyday elegance.'),
  ('Necklaces', 'necklaces', 'Pendants, chains, and chokers to layer or wear alone.'),
  ('Earrings',  'earrings',  'Studs, hoops, and drops for every occasion.'),
  ('Bracelets', 'bracelets', 'Bangles, cuffs, and tennis bracelets with lasting shine.'),
  ('Watches',   'watches',   'Timeless timepieces that pair precision with elegance.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 6. Product image uploads (bucket: product-images).
--    public = true only makes reads public; inserting into storage.objects is
--    still governed by RLS, so admins need an explicit write policy.
-- ---------------------------------------------------------------------------
drop policy if exists "product images read"  on storage.objects;
drop policy if exists "product images write" on storage.objects;

create policy "product images read" on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product images write" on storage.objects for all
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
