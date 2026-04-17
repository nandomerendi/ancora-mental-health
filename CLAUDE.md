# Âncora — Mental Health Daily Check-in

## Contexto do projeto
SaaS de check-in diário de saúde mental. Frontend React já existe em /src.
Agora estamos construindo o backend FastAPI em /api.

## Stack
- Frontend: React + Vite (já existe)
- Backend: FastAPI + Python 3.11
- Banco: Supabase (PostgreSQL)
- Deploy: Railway

## Convenções
- Python: snake_case, type hints obrigatórios, docstrings em português
- Commits: conventional commits (feat:, fix:, chore:)
- Variáveis de ambiente: nunca hardcoded, sempre via .env
- Testes: pytest, mínimo 80% de cobertura nas rotas

## Estrutura esperada do /api
api/
  routers/
    entries.py
    users.py
    insights.py
  models/
    entry.py
    user.py
  services/
    supabase.py
    analytics.py
  tests/
    test_entries.py
    test_insights.py
  main.py
  requirements.txt

## Contexto de negócio
Banco brasileiro, LGPD é constraint real.
Dados de saúde mental são sensíveis — RLS no Supabase é obrigatório.