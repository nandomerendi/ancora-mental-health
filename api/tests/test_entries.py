"""Testes das rotas de check-in."""

from datetime import date, timedelta
from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from api.tests.conftest import TODAY, USER_ID


def _mock_upsert_response(mock_db: MagicMock, entry: dict) -> None:
    """Configura o mock para retornar um entry no upsert."""
    chain = mock_db.table.return_value.upsert.return_value.execute
    chain.return_value.data = [entry]


def _mock_select_response(mock_db: MagicMock, entries: list[dict]) -> None:
    """Configura o mock para retornar entries no select."""
    chain = (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
    )
    # encadeia: .order().range().execute() ou .eq().execute()
    chain.order.return_value.range.return_value.execute.return_value.data = entries
    chain.eq.return_value.execute.return_value.data = entries
    chain.execute.return_value.data = entries


class TestUpsertEntry:
    def test_cria_entry_do_dia(self, client: TestClient, mock_supabase: MagicMock, entry_factory):
        entry = entry_factory()
        _mock_upsert_response(mock_supabase, entry)

        resp = client.post(
            "/entries",
            json={"mood": 4, "body_feeling": "Calma", "thought_theme": "Trabalho",
                  "intention": "Ser gentil comigo", "note": ""},
        )

        assert resp.status_code == 200
        data = resp.json()
        assert data["mood"] == 4
        assert data["date"] == TODAY

    def test_mood_invalido_retorna_422(self, client: TestClient, mock_supabase: MagicMock):
        resp = client.post("/entries", json={"mood": 6})
        assert resp.status_code == 422

    def test_mood_minimo_valido(self, client: TestClient, mock_supabase: MagicMock, entry_factory):
        entry = entry_factory({"mood": 1})
        _mock_upsert_response(mock_supabase, entry)

        resp = client.post("/entries", json={"mood": 1})
        assert resp.status_code == 200
        assert resp.json()["mood"] == 1

    def test_campos_opcionais_ausentes(self, client: TestClient, mock_supabase: MagicMock, entry_factory):
        entry = entry_factory({"body_feeling": None, "thought_theme": None, "intention": None, "note": None})
        _mock_upsert_response(mock_supabase, entry)

        resp = client.post("/entries", json={"mood": 3})
        assert resp.status_code == 200

    def test_regra_um_entry_por_dia(self, client: TestClient, mock_supabase: MagicMock, entry_factory):
        """Segunda chamada no mesmo dia deve atualizar (upsert), não criar duplicata."""
        entry_original = entry_factory({"mood": 2})
        entry_atualizado = entry_factory({"mood": 5})

        _mock_upsert_response(mock_supabase, entry_original)
        resp1 = client.post("/entries", json={"mood": 2})
        assert resp1.status_code == 200

        _mock_upsert_response(mock_supabase, entry_atualizado)
        resp2 = client.post("/entries", json={"mood": 5})
        assert resp2.status_code == 200
        assert resp2.json()["mood"] == 5

        # Verifica que upsert foi chamado (não insert simples)
        assert mock_supabase.table.return_value.upsert.called


class TestListEntries:
    def test_lista_entries_do_usuario(self, client: TestClient, mock_supabase: MagicMock, entry_factory):
        entries = [entry_factory(), entry_factory({"date": (date.today() - timedelta(days=1)).isoformat()})]

        mock_db_chain = (
            mock_supabase.table.return_value
            .select.return_value
            .eq.return_value
            .order.return_value
            .range.return_value
        )
        mock_db_chain.execute.return_value.data = entries

        resp = client.get("/entries")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_limit_e_offset(self, client: TestClient, mock_supabase: MagicMock, entry_factory):
        mock_db_chain = (
            mock_supabase.table.return_value
            .select.return_value
            .eq.return_value
            .order.return_value
            .range.return_value
        )
        mock_db_chain.execute.return_value.data = [entry_factory()]

        resp = client.get("/entries?limit=10&offset=5")
        assert resp.status_code == 200

        _, kwargs = mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value.range.call_args
        # range(5, 14)
        call_args = mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value.range.call_args
        assert call_args[0] == (5, 14)

    def test_limit_invalido_retorna_422(self, client: TestClient, mock_supabase: MagicMock):
        resp = client.get("/entries?limit=0")
        assert resp.status_code == 422


class TestGetTodayEntry:
    def test_retorna_entry_de_hoje(self, client: TestClient, mock_supabase: MagicMock, entry_factory):
        entry = entry_factory()
        (
            mock_supabase.table.return_value
            .select.return_value
            .eq.return_value
            .eq.return_value
            .execute.return_value
        ).data = [entry]

        resp = client.get("/entries/today")
        assert resp.status_code == 200
        assert resp.json()["date"] == TODAY

    def test_404_quando_nao_ha_entry_hoje(self, client: TestClient, mock_supabase: MagicMock):
        (
            mock_supabase.table.return_value
            .select.return_value
            .eq.return_value
            .eq.return_value
            .execute.return_value
        ).data = []

        resp = client.get("/entries/today")
        assert resp.status_code == 404
