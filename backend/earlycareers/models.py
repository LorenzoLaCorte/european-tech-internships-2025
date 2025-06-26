from sqlmodel import Field, SQLModel


class JobBase(SQLModel):
    link: str = Field(primary_key=True)
    title: str = Field(nullable=False)
    location: str = Field(nullable=False)
    company: str = Field(nullable=False)
    description: str | None = None
    employment_type: str | None = None
    seniority_level: str | None = None
    job_function: str | None = None
    industries: str | None = None


class Job(JobBase, table=True):
    __tablename__ = "jobs"  # pyright: ignore
