from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, Query

from earlycareers import crud
from earlycareers.deps import SessionDep  # noqa: TC001
from earlycareers.schemas import JobRead

if TYPE_CHECKING:
    from earlycareers.models import Job

router = APIRouter()


@router.get("/healthcheck/", tags=["utils"])
def healthcheck() -> bool:
    return True


@router.get("/jobs", response_model=list[JobRead], tags=["jobs"])
def get_jobs(
    *,
    session: SessionDep,
    page: int = Query(1, ge=1),  # pyright: ignore[reportCallInDefaultInitializer]
    limit: int = Query(10, ge=1, le=100),  # pyright: ignore[reportCallInDefaultInitializer]
    search: str = Query(""),  # pyright: ignore[reportCallInDefaultInitializer]
) -> list[Job]:
    return crud.get_jobs(session=session, page=page, limit=limit, search=search)


@router.get("/jobs/advanced", response_model=list[JobRead], tags=["jobs"])
def get_jobs_advanced(
    *,
    session: SessionDep,
    page: int = Query(1, ge=1),  # pyright: ignore[reportCallInDefaultInitializer]
    limit: int = Query(10, ge=1, le=100),  # pyright: ignore[reportCallInDefaultInitializer]
    title: list[str] = Query(default_factory=list),  # noqa: B008
    company: list[str] = Query(default_factory=list),  # noqa: B008
    location: list[str] = Query(default_factory=list),  # noqa: B008
    description: list[str] = Query(default_factory=list),  # noqa: B008
) -> list[Job]:
    return crud.get_jobs_advanced(
        session=session,
        page=page,
        limit=limit,
        title=title,
        company=company,
        location=location,
        description=description,
    )
