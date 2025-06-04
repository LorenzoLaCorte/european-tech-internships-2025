from sqlmodel import SQLModel, create_engine

from earlycareers.core.config import settings
from earlycareers.models import Job  # noqa: F401

engine = create_engine(str(settings.DB_URI), echo=True)

SQLModel.metadata.create_all(engine)
