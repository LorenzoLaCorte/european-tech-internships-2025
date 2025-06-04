from __future__ import annotations

import re
from typing import TYPE_CHECKING

from sqlmodel import and_, or_, select

from .models import Job

if TYPE_CHECKING:
    from sqlalchemy.sql.elements import ColumnElement
    from sqlmodel import Session

_TOKEN_RE = re.compile(r"\w+")
_SEARCHABLE = (
    Job.company,
    Job.title,
    Job.location,
    Job.description,
    Job.employment_type,
    Job.seniority_level,
    Job.job_function,
    Job.industries,
)


def _tokens(text: str) -> list[str]:
    """Return lowercase word-tokens found in *text*."""
    return _TOKEN_RE.findall(text.lower())


def _token_filter(token: str) -> ColumnElement[bool]:
    """Filter that matches *token* against every searchable column (OR-combined)."""
    like_pattern = f"%{token}%"
    return or_(*(col.ilike(like_pattern) for col in _SEARCHABLE))  # pyright: ignore


def _search_filter(search: str) -> ColumnElement[bool] | None:
    """Return an AND-combined filter across all tokens in *search*."""
    tokens = _tokens(search)
    return and_(*(_token_filter(t) for t in tokens)) if tokens else None


def get_jobs(
    *, session: Session, page: int = 1, limit: int = 10, search: str = ""
) -> list[Job]:
    stmt = select(Job)
    search_filter = _search_filter(search)
    if search_filter is not None:
        stmt = stmt.where(search_filter)

    stmt = stmt.offset((page - 1) * limit).limit(limit)
    return list(session.exec(stmt).all())
