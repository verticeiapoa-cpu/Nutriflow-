-- ──────────────────────────────────────────────────────────────
-- NutriFlow — Schema Supabase
-- Execute em: Dashboard Supabase → SQL Editor → New Query
--
-- Campos em comum (todas as tabelas):
--   id           TEXT  (PK)   — gerado pelo cliente ou default gen_random_uuid()
--   created_date TIMESTAMPTZ  — default now()
--
-- Política: owner-based simples. Cada linha tem um owner_id
-- (auth.uid()) e só o dono enxerga/edita seus dados.
-- Para protótipo/consultório solo, policy aberta no final
-- (comente quando for multi-usuário).
-- ──────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- PACIENTES ────────────────────────────────────────────────────
create table if not exists public.patients (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  full_name    text not null,
  birth_date   date,
  gender       text,
  phone        text,
  email        text,
  address      text,
  objective    text,
  status       text default 'novo',
  anamnesis    text,
  notes        text,
  allergies    jsonb default '[]'::jsonb,
  medications  jsonb default '[]'::jsonb,
  diseases     jsonb default '[]'::jsonb,
  tags         jsonb default '[]'::jsonb,
  next_appointment date,
  portal_access boolean default true,
  photo_url    text,
  created_date timestamptz default now()
);

-- CONSULTAS ────────────────────────────────────────────────────
create table if not exists public.consultations (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  patient_id   text references public.patients(id) on delete cascade,
  patient_name text,
  date         date,
  time         text,
  status       text default 'agendada',
  type         text default 'Consulta',
  price        numeric default 0,
  paid         boolean default false,
  notes        text,
  created_date timestamptz default now()
);

-- ANTROPOMETRIA ────────────────────────────────────────────────
create table if not exists public.anthropometry (
  id                  text primary key default gen_random_uuid()::text,
  owner_id            uuid references auth.users(id) on delete cascade,
  patient_id          text references public.patients(id) on delete cascade,
  patient_name        text,
  date                date,
  weight              numeric,
  height              numeric,
  bmi                 numeric,
  body_fat_percent    numeric,
  muscle_mass         numeric,
  waist               numeric,
  hip                 numeric,
  arm                 numeric,
  thigh               numeric,
  notes               text,
  created_date        timestamptz default now()
);

-- EXAMES LABORATORIAIS ─────────────────────────────────────────
create table if not exists public.lab_exams (
  id                  text primary key default gen_random_uuid()::text,
  owner_id            uuid references auth.users(id) on delete cascade,
  patient_id          text references public.patients(id) on delete cascade,
  patient_name        text,
  date                date,
  exam_type           text,
  glucose             numeric,
  total_cholesterol   numeric,
  hdl                 numeric,
  ldl                 numeric,
  triglycerides       numeric,
  notes               text,
  file_url            text,
  created_date        timestamptz default now()
);

-- PLANOS ALIMENTARES ───────────────────────────────────────────
create table if not exists public.meal_plans (
  id             text primary key default gen_random_uuid()::text,
  owner_id       uuid references auth.users(id) on delete cascade,
  patient_id     text references public.patients(id) on delete cascade,
  patient_name   text,
  title          text,
  description    text,
  total_calories numeric,
  total_protein  numeric,
  total_carbs    numeric,
  total_fat      numeric,
  status         text default 'ativo',
  meals          jsonb default '[]'::jsonb,
  created_date   timestamptz default now()
);

-- DIÁRIO ALIMENTAR ─────────────────────────────────────────────
create table if not exists public.diario_alimentar (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  patient_id   text references public.patients(id) on delete cascade,
  patient_name text,
  date         date,
  refeicao     text,
  foods        jsonb default '[]'::jsonb,
  photo_url    text,
  notes        text,
  created_date timestamptz default now()
);

-- ALIMENTOS (TACO/IBGE) ────────────────────────────────────────
create table if not exists public.alimentos (
  id           text primary key default gen_random_uuid()::text,
  nome         text not null,
  categoria    text,
  kcal         numeric,
  protein      numeric,
  carbs        numeric,
  fat          numeric,
  fiber        numeric,
  created_date timestamptz default now()
);

-- PRONTUÁRIO LIVRE ─────────────────────────────────────────────
create table if not exists public.prontuario (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  patient_id   text references public.patients(id) on delete cascade,
  patient_name text,
  texto        text,
  data         text,
  hora         text,
  created_date timestamptz default now()
);

-- ORIENTAÇÕES ──────────────────────────────────────────────────
create table if not exists public.orientacoes (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  titulo       text not null,
  categoria    text,
  conteudo     text,
  tags         jsonb default '[]'::jsonb,
  created_date timestamptz default now()
);

-- ATESTADOS ────────────────────────────────────────────────────
create table if not exists public.atestados (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  patient_id   text references public.patients(id) on delete cascade,
  patient_name text,
  tipo         text,
  data         date,
  texto        text,
  created_date timestamptz default now()
);

-- RECIBOS ──────────────────────────────────────────────────────
create table if not exists public.recibos (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  patient_id   text references public.patients(id) on delete cascade,
  patient_name text,
  data         date,
  descricao    text,
  valor        numeric,
  pagamento    text,
  created_date timestamptz default now()
);

-- PEDIDO DE EXAMES ─────────────────────────────────────────────
create table if not exists public.pedido_exames (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  patient_id   text references public.patients(id) on delete cascade,
  patient_name text,
  data         date,
  exames       jsonb default '[]'::jsonb,
  preparo      text,
  observacao   text,
  created_date timestamptz default now()
);

-- MODELOS DE MENSAGEM ──────────────────────────────────────────
create table if not exists public.mensagem_templates (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  nome         text not null,
  canal        text default 'whatsapp',
  mensagem     text,
  ativo        boolean default true,
  created_date timestamptz default now()
);

-- DATAS BLOQUEADAS ─────────────────────────────────────────────
create table if not exists public.datas_bloqueadas (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  data         date not null,
  motivo       text,
  created_date timestamptz default now()
);

-- IMPRESSOS PERSONALIZADOS ─────────────────────────────────────
create table if not exists public.impressos (
  id           text primary key default gen_random_uuid()::text,
  owner_id     uuid references auth.users(id) on delete cascade,
  titulo       text,
  conteudo     text,
  tipo         text,
  created_date timestamptz default now()
);

-- ÍNDICES para queries comuns ──────────────────────────────────
create index if not exists idx_consultations_date    on public.consultations (date desc);
create index if not exists idx_consultations_patient on public.consultations (patient_id);
create index if not exists idx_patients_owner        on public.patients (owner_id);
create index if not exists idx_prontuario_patient    on public.prontuario (patient_id);

-- ──────────────────────────────────────────────────────────────
-- RLS (Row Level Security)
-- Habilite e configure as policies quando for multi-usuário.
-- Para protótipo solo, deixe desabilitado (anon key tem acesso).
-- ──────────────────────────────────────────────────────────────

-- Para habilitar depois (descomente bloco abaixo):
--
-- do $$
-- declare t text;
-- begin
--   for t in select unnest(array[
--     'patients','consultations','anthropometry','lab_exams','meal_plans',
--     'diario_alimentar','prontuario','orientacoes','atestados','recibos',
--     'pedido_exames','mensagem_templates','datas_bloqueadas','impressos'
--   ])
--   loop
--     execute format('alter table public.%I enable row level security', t);
--     execute format('create policy "owner_rw" on public.%I for all using (owner_id = auth.uid()) with check (owner_id = auth.uid())', t);
--   end loop;
-- end $$;
