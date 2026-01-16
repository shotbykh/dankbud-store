-- Create the products table to replace local JSON
create table products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  stock numeric default 0,
  thc text,
  lineage text,
  description text,
  effects text[], -- Array of strings
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table products enable row level security;

-- Policy: Everyone can READ products (public)
create policy "Public products are viewable by everyone"
  on products for select
  using ( true );

-- Policy: Enable all access for Anon Key (since our API uses it)
create policy "Enable all access for now"
  on products for all
  using ( true )
  with check ( true );
