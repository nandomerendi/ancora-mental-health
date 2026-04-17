"""Rotas de check-in diário."""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client

from api.models.entry import EntryCreate, EntryOut
from api.services.supabase import get_current_user_id, get_supabase

router = APIRouter(prefix="/entries", tags=["entries"])


@router.post("", response_model=EntryOut, status_code=status.HTTP_200_OK)
def upsert_entry(
    payload: EntryCreate,
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[Client, Depends(get_supabase)],
) -> EntryOut:
    """Cria ou atualiza o check-in do dia atual para o usuário autenticado."""
    today = date.today().isoformat()

    data = {
        "user_id": user_id,
        "date": today,
        "mood": payload.mood,
        "body_feeling": payload.body_feeling,
        "thought_theme": payload.thought_theme,
        "intention": payload.intention,
        "note": payload.note,
    }

    response = (
        db.table("entries")
        .upsert(data, on_conflict="user_id,date")
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Falha ao salvar o check-in.",
        )

    return EntryOut(**response.data[0])


@router.get("", response_model=list[EntryOut])
def list_entries(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[Client, Depends(get_supabase)],
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> list[EntryOut]:
    """Lista os check-ins do usuário em ordem cronológica decrescente."""
    response = (
        db.table("entries")
        .select("*")
        .eq("user_id", user_id)
        .order("date", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )

    return [EntryOut(**row) for row in response.data]


@router.get("/today", response_model=EntryOut)
def get_today_entry(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[Client, Depends(get_supabase)],
) -> EntryOut:
    """Retorna o check-in de hoje, ou 404 se ainda não foi feito."""
    today = date.today().isoformat()

    response = (
        db.table("entries")
        .select("*")
        .eq("user_id", user_id)
        .eq("date", today)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhum check-in registrado hoje.",
        )

    return EntryOut(**response.data[0])
