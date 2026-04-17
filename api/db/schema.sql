-- ============================================================
-- Âncora Mental Health — DDL completo
-- Compatível com Supabase (PostgreSQL 15+)
-- ============================================================

-- Extensão para geração de UUID v4
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- Tabela: users
-- Espelha os dados do Supabase Auth + campos de negócio
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Tabela: entries
-- Um registro por usuário por dia (constraint única em user_id + date)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.entries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    mood            SMALLINT NOT NULL CHECK (mood BETWEEN 1 AND 5),
    body_feeling    TEXT,
    thought_theme   TEXT,
    intention       TEXT,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT entries_user_date_unique UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS entries_user_id_date_idx ON public.entries (user_id, date DESC);

-- ------------------------------------------------------------
-- Row Level Security (RLS) — LGPD: dados de saúde são sensíveis
-- ------------------------------------------------------------
ALTER TABLE public.users  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- users: cada usuário acessa apenas o próprio perfil
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- entries: cada usuário acessa apenas suas próprias entradas
CREATE POLICY "entries_select_own" ON public.entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "entries_insert_own" ON public.entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "entries_update_own" ON public.entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "entries_delete_own" ON public.entries
    FOR DELETE USING (auth.uid() = user_id);
