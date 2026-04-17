"""Cálculos de insights de saúde mental."""

from collections import Counter
from datetime import date, timedelta
from typing import Any, Dict, List, Optional


def calcular_streak(dates: List[date]) -> int:
    """
    Calcula quantos dias consecutivos até hoje o usuário fez check-in.
    A lista de datas pode estar em qualquer ordem.
    """
    if not dates:
        return 0

    unique = sorted(set(dates), reverse=True)
    today = date.today()

    # Se não há entrada hoje nem ontem, streak é 0
    if unique[0] < today - timedelta(days=1):
        return 0

    streak = 0
    expected = unique[0]

    for d in unique:
        if d == expected:
            streak += 1
            expected -= timedelta(days=1)
        else:
            break

    return streak


def calcular_media_humor(moods: List[int]) -> Optional[float]:
    """Retorna a média de humor com uma casa decimal, ou None se lista vazia."""
    if not moods:
        return None
    return round(sum(moods) / len(moods), 1)


def tema_mais_frequente(themes: List[str]) -> Optional[str]:
    """Retorna o tema de pensamento mais registrado, ou None se lista vazia."""
    if not themes:
        return None
    return Counter(themes).most_common(1)[0][0]


def tendencia_30_dias(entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Recebe lista de entries e retorna os últimos 30 dias com
    date e mood (None nos dias sem registro).
    """
    today = date.today()
    por_data: Dict[date, int] = {
        date.fromisoformat(str(e["date"])): e["mood"] for e in entries
    }

    resultado = []
    for i in range(29, -1, -1):
        d = today - timedelta(days=i)
        resultado.append({"date": d.isoformat(), "mood": por_data.get(d)})

    return resultado
