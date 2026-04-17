"""Rotas de insights e tendências de humor."""

from typing import Annotated, Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from supabase import Client

from api.services.analytics import (
    calcular_media_humor,
    calcular_streak,
    tema_mais_frequente,
    tendencia_30_dias,
)
from api.services.supabase import get_current_user_id, get_supabase

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/summary")
def get_summary(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[Client, Depends(get_supabase)],
) -> Dict[str, Any]:
    """Retorna média de mood, streak atual e tema de pensamento mais frequente."""
    response = (
        db.table("entries")
        .select("date, mood, thought_theme")
        .eq("user_id", user_id)
        .order("date", desc=False)
        .execute()
    )

    rows = response.data or []
    from datetime import date as _date
    dates = [_date.fromisoformat(str(r["date"])) for r in rows]
    moods = [r["mood"] for r in rows]
    themes: List[Optional[str]] = [r.get("thought_theme") for r in rows]
    themes_clean: List[str] = [t for t in themes if t]

    return {
        "avg_mood": calcular_media_humor(moods),
        "streak": calcular_streak(dates),
        "top_theme": tema_mais_frequente(themes_clean),
        "total_entries": len(rows),
    }


@router.get("/trend")
def get_trend(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[Client, Depends(get_supabase)],
) -> List[Dict[str, Any]]:
    """Retorna humor dos últimos 30 dias para renderização do gráfico."""
    response = (
        db.table("entries")
        .select("date, mood")
        .eq("user_id", user_id)
        .order("date", desc=False)
        .execute()
    )

    return tendencia_30_dias(response.data or [])
