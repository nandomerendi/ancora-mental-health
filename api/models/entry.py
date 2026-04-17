from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class EntryCreate(BaseModel):
    """Payload para criar ou atualizar o check-in do dia."""
    mood: int = Field(..., ge=1, le=5, description="Humor de 1 (muito difícil) a 5 (muito bem)")
    body_feeling: Optional[str] = None
    thought_theme: Optional[str] = None
    intention: Optional[str] = None
    note: Optional[str] = None


class EntryOut(BaseModel):
    """Representação pública de um check-in."""
    id: UUID
    user_id: UUID
    date: date
    mood: int
    body_feeling: Optional[str]
    thought_theme: Optional[str]
    intention: Optional[str]
    note: Optional[str]
    created_at: datetime
