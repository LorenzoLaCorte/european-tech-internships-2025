"""
The frontend --- built on top of this backend --- will include additional details, and the possibility to filter.
This will be great for example, to filter job postings by keywords, which can be also in the description!

Thus, having:
- toggles to filter by location, 
- searchbar to look for company
- searchbar to look for title or something in the description

The backend will be responsible for fetching the data from the DB, and returning it to the frontend.
"""

from flask import Flask, jsonify, request, send_from_directory
from db import create_session, Job as DBJob
import requests
import random
import re
import os
from sqlalchemy import or_
from flask_cors import CORS


app = Flask(__name__) # served from the root URL

CORS(app)  # Enable CORS for all routes

# Set to True to use mock data, False to use real data
MOCK = False  

SEARCHABLE_COLUMNS = [
    DBJob.company,
    DBJob.title,
    DBJob.location,
    DBJob.description,
    DBJob.employment_type,
    DBJob.seniority_level,
    DBJob.job_function,
    DBJob.industries,
]

def token_filter(token: str):
    """
    Return an OR-clause that checks this token against every searchable column.
    """
    like = f"%{token}%"
    return or_(*[col.ilike(like) for col in SEARCHABLE_COLUMNS])


def split_tokens(text: str) -> list[str]:
    """
    Lower-case & split on any run of whitespace.
    """
    return re.split(r"\s+", text.strip().lower())


def get_jobs_paginated(page: int, limit: int, search: str):
    """
    Retrieve paginated job postings from the database.    
    """
    session = create_session()
    query = session.query(DBJob)

    if search:
        for tok in split_tokens(search):
            query = query.filter(token_filter(tok)) # AND across tokens, OR inside each token
    
    print(f"Query: {query}, with {page=}, {limit=}, {search=}")
    jobs = (
        query.offset((page - 1) * limit)
             .limit(limit)
             .all()
    )

    results = [
        {
            "company": j.company,
            "title": j.title,
            "location": j.location,
            "link": j.link,
            "description": j.description,
            "employment_type": j.employment_type,
            "seniority_level": j.seniority_level,
            "job_function": j.job_function,
            "industries": j.industries,
        }
        for j in jobs
    ]
    session.close()
    return jsonify(results)


def get_mock_jobs(page, limit, search):
    """
    Retrieve mock job postings.
    """
    company = ["Google", "Facebook", "Amazon", "Microsoft", "Apple"]
    locations = ["Berlin", "Paris", "London", "Madrid", "Rome"]
    titles = ["Software Engineer", "Software Engineer Intern", "Data Scientist", "Product Manager", "UX Designer", "Intern"]
    mock_data = [{
            "company": random.choice(company),
            "title": random.choice(titles),
            "location": random.choice(locations),
            "link": "https://example.com",
            "description": "Short mock description",
            "employment_type": "Internship",
            "seniority_level": "Intern",
            "job_function": "Engineering",
            "industries": "Tech"
        } for _ in range(1000)]

    if search:
        tokens = split_tokens(search)
        def job_matches(job):
            def field_contains(tok):
                return any(tok in str(job[f]).lower() for f in job.keys())
            return all(field_contains(tok) for tok in tokens)

        mock_data = [job for job in mock_data if job_matches(job)]


    # Paginate the mock data
    start = (page - 1) * limit
    end = start + limit
    mock_data = mock_data[start:end]

    return jsonify(mock_data)


@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    """
    Get paginated job postings from the database.
    Query parameters:
        - page: The page number to retrieve (default: 1)
        - limit: The number of job postings per page (default: 10)
        - search: A search term to filter job postings (default: "")
    Returns:
        - A JSON response containing a list of job postings.
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    search = request.args.get("search", "")
    
    print(f"User request: {page=}, {limit=}, {search=}")

    if MOCK:
        return get_mock_jobs(page, limit, search)
    else:
        return get_jobs_paginated(page, limit, search)


if __name__ == "__main__":
    app.run(debug=True)
