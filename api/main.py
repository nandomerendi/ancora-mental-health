"""Ponto de entrada da API Âncora Mental Health."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import entries, insights, users

app = FastAPI(
    title="Âncora Mental Health API",
    description="Backend para o app de check-in diário de saúde mental.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(entries.router)
app.include_router(insights.router)
app.include_router(users.router)


@app.get("/health")
def health_check() -> dict:
    """Verifica se a API está no ar."""
    return {"status": "ok"}
