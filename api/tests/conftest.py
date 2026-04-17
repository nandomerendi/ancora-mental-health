"""Fixtures compartilhadas entre todos os testes."""

import uuid
from contextlib import ExitStack
from datetime import date
from typing import Any, Dict, Generator, Optional
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

USER_ID = str(uuid.uuid4())
TODAY = date.today().isoformat()


def _make_entry(override: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    base: Dict[str, Any] = {
        "id": str(uuid.uuid4()),
        "user_id": USER_ID,
        "date": TODAY,
        "mood": 4,
        "body_feeling": "Calma",
        "thought_theme": "Trabalho",
        "intention": "Ser gentil comigo",
        "note": "",
        "created_at": "2024-01-01T10:00:00+00:00",
    }
    if override:
        base.update(override)
    return base


@pytest.fixture()
def entry_factory():
    return _make_entry


@pytest.fixture()
def mock_supabase() -> MagicMock:
    """Mock do cliente Supabase."""
    return MagicMock()


@pytest.fixture()
def client(mock_supabase: MagicMock) -> Generator[TestClient, None, None]:
    """TestClient com Supabase e JWT mockados via dependency_overrides."""
    # Importa app aqui para evitar leitura de env vars no nível de módulo
    from api.main import app
    from api.services.supabase import get_current_user_id, get_supabase

    app.dependency_overrides[get_supabase] = lambda: mock_supabase
    app.dependency_overrides[get_current_user_id] = lambda: USER_ID

    yield TestClient(app)

    app.dependency_overrides.clear()
