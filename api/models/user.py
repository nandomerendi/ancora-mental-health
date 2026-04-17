from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Payload para criação de usuário."""
    name: str
    email: EmailStr


class UserOut(BaseModel):
    """Representação pública do usuário."""
    id: UUID
    name: str
    email: EmailStr
    plan: Literal["free", "premium"]
    created_at: datetime
