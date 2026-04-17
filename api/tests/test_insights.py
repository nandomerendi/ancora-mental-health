"""Testes das rotas de insights e cálculos de analytics."""

from datetime import date, timedelta
from typing import Any, Dict, List
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from api.services.analytics import (
    calcular_media_humor,
    calcular_streak,
    tema_mais_frequente,
    tendencia_30_dias,
)
from api.tests.conftest import TODAY, USER_ID


def _mock_insights_query(mock_db: MagicMock, rows: List[Dict[str, Any]]) -> None:
    """Configura mock para queries de insights (select → eq → order → execute)."""
    (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
        .order.return_value
        .execute.return_value
    ).data = rows


# ------------------------------------------------------------------ #
# Testes unitários do serviço de analytics (sem HTTP)
# ------------------------------------------------------------------ #

class TestCalcularStreak:
    def test_streak_zero_sem_entries(self):
        assert calcular_streak([]) == 0

    def test_streak_um_dia_hoje(self):
        assert calcular_streak([date.today()]) == 1

    def test_streak_consecutivo(self):
        hoje = date.today()
        datas = [hoje - timedelta(days=i) for i in range(5)]
        assert calcular_streak(datas) == 5

    def test_streak_quebrado(self):
        """Lacuna de 2 dias deve quebrar o streak."""
        hoje = date.today()
        datas = [hoje, hoje - timedelta(days=1), hoje - timedelta(days=3)]
        assert calcular_streak(datas) == 2

    def test_streak_apenas_ontem(self):
        ontem = date.today() - timedelta(days=1)
        assert calcular_streak([ontem]) == 1

    def test_streak_entry_antigo(self):
        """Entry de 5 dias atrás sem continuidade deve retornar 0."""
        antigo = date.today() - timedelta(days=5)
        assert calcular_streak([antigo]) == 0


class TestCalcularMediaHumor:
    def test_media_lista_vazia(self):
        assert calcular_media_humor([]) is None

    def test_media_simples(self):
        assert calcular_media_humor([1, 3, 5]) == 3.0

    def test_media_uma_casa_decimal(self):
        assert calcular_media_humor([1, 2]) == 1.5

    def test_media_valor_unico(self):
        assert calcular_media_humor([4]) == 4.0


class TestTemaMaisFrequente:
    def test_tema_lista_vazia(self):
        assert tema_mais_frequente([]) is None

    def test_tema_unico(self):
        assert tema_mais_frequente(["Trabalho"]) == "Trabalho"

    def test_tema_mais_repetido(self):
        temas = ["Trabalho", "Futuro", "Trabalho", "Saúde", "Trabalho"]
        assert tema_mais_frequente(temas) == "Trabalho"


class TestTendencia30Dias:
    def test_retorna_30_dias(self):
        resultado = tendencia_30_dias([])
        assert len(resultado) == 30

    def test_dias_sem_entry_tem_mood_none(self):
        resultado = tendencia_30_dias([])
        assert all(r["mood"] is None for r in resultado)

    def test_entry_aparece_no_dia_correto(self):
        hoje = date.today()
        entries = [{"date": hoje.isoformat(), "mood": 5}]
        resultado = tendencia_30_dias(entries)
        ultimo = resultado[-1]
        assert ultimo["date"] == hoje.isoformat()
        assert ultimo["mood"] == 5

    def test_ordem_cronologica_crescente(self):
        resultado = tendencia_30_dias([])
        datas = [r["date"] for r in resultado]
        assert datas == sorted(datas)


# ------------------------------------------------------------------ #
# Testes de integração HTTP das rotas /insights
# ------------------------------------------------------------------ #

class TestSummaryRoute:
    def test_summary_sem_entries(self, client: TestClient, mock_supabase: MagicMock):
        _mock_insights_query(mock_supabase, [])
        resp = client.get("/insights/summary")
        assert resp.status_code == 200
        data = resp.json()
        assert data["avg_mood"] is None
        assert data["streak"] == 0
        assert data["top_theme"] is None
        assert data["total_entries"] == 0

    def test_summary_com_entries(self, client: TestClient, mock_supabase: MagicMock):
        hoje = date.today().isoformat()
        ontem = (date.today() - timedelta(days=1)).isoformat()
        rows = [
            {"date": ontem, "mood": 3, "thought_theme": "Trabalho"},
            {"date": hoje, "mood": 5, "thought_theme": "Trabalho"},
        ]
        _mock_insights_query(mock_supabase, rows)

        resp = client.get("/insights/summary")
        assert resp.status_code == 200
        data = resp.json()
        assert data["avg_mood"] == 4.0
        assert data["streak"] == 2
        assert data["top_theme"] == "Trabalho"
        assert data["total_entries"] == 2


class TestTrendRoute:
    def test_trend_retorna_30_dias(self, client: TestClient, mock_supabase: MagicMock):
        _mock_insights_query(mock_supabase, [])
        resp = client.get("/insights/trend")
        assert resp.status_code == 200
        assert len(resp.json()) == 30

    def test_trend_com_entry_hoje(self, client: TestClient, mock_supabase: MagicMock):
        hoje = date.today().isoformat()
        _mock_insights_query(mock_supabase, [{"date": hoje, "mood": 4}])

        resp = client.get("/insights/trend")
        assert resp.status_code == 200
        ultimo = resp.json()[-1]
        assert ultimo["date"] == hoje
        assert ultimo["mood"] == 4
