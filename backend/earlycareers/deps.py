from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from earlycareers.core.database import engine


def get_session() -> Generator[Session]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
