-- HealthGrid MP: Supabase SQL Editor mein poora chalayein.
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('admin','viewer','staff')),
  facility_id text,
  name text
);
create table if not exists facilities (
  id text primary key, district text not null, data jsonb not null,
  updated_at timestamptz default now(), updated_by uuid
);
create table if not exists logs (id bigint generated always as identity primary key, ts bigint, msg text, actor text);
create table if not exists alert_state (id text primary key, created bigint not null, escalated boolean default false);
create table if not exists transfers (key text primary key, status text not null, by_user text, ts bigint);

alter table profiles enable row level security;
alter table facilities enable row level security;
alter table logs enable row level security;
alter table alert_state enable row level security;
alter table transfers enable row level security;

create or replace function public.my_role() returns text language sql security definer stable set search_path = public as $$ select role from profiles where id = auth.uid() $$;
create or replace function public.my_fac() returns text language sql security definer stable set search_path = public as $$ select facility_id from profiles where id = auth.uid() $$;

create policy "profile read" on profiles for select to authenticated using (id = auth.uid() or my_role() = 'admin');

create policy "fac read" on facilities for select to authenticated using (true);
create policy "fac insert admin" on facilities for insert to authenticated with check (my_role() = 'admin');
create policy "fac update" on facilities for update to authenticated
  using (my_role() = 'admin' or (my_role() = 'staff' and id = my_fac()))
  with check (my_role() = 'admin' or (my_role() = 'staff' and id = my_fac()));

create policy "log read" on logs for select to authenticated using (true);
create policy "log insert" on logs for insert to authenticated with check (my_role() in ('admin','staff'));

create policy "alert read" on alert_state for select to authenticated using (true);
create policy "alert insert" on alert_state for insert to authenticated with check (true);
create policy "alert update admin" on alert_state for update to authenticated using (my_role() = 'admin') with check (my_role() = 'admin');

create policy "tr read" on transfers for select to authenticated using (true);
create policy "tr insert admin" on transfers for insert to authenticated with check (my_role() = 'admin');
create policy "tr update admin" on transfers for update to authenticated using (my_role() = 'admin') with check (my_role() = 'admin');

-- Users banane ke baad (Authentication > Users > Add user, "Auto confirm" ON), role dein:
-- insert into profiles(id, role) select id, 'admin'  from auth.users where email = 'admin@example.com';
-- insert into profiles(id, role) select id, 'viewer' from auth.users where email = 'officer@example.com';
-- insert into profiles(id, role, facility_id) select id, 'staff', 'Indore-1' from auth.users where email = 'phc.indore1@example.com';
