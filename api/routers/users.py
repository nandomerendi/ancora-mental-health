"""Rotas de gerenciamento de perfil de usuário."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from api.models.user import UserCreate, UserOut
from api.services.supabase import get_current_user_id, get_supabase

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/me", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_profile(
    payload: UserCreate,
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[Client, Depends(get_supabase)],
) -> UserOut:
    """Cria o perfil do usuário após o primeiro login (Supabase Auth já criou o auth.users)."""
    response = (
        db.table("users")
        .insert({"id": user_id, "name": payload.name, "email": payload.email})
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Falha ao criar perfil.",
        )

    return UserOut(**response.data[0])


@router.get("/me", response_model=UserOut)
def get_profile(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db: Annotated[Client, Depends(get_supabase)],
) -> UserOut:
    """Retorna o perfil do usuário autenticado."""
    response = (
        db.table("users")
        .select("*")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil não encontrado.",
        )

    return UserOut(**response.data)
