"""
The frontend --- built on top of this backend --- will include additional details, and the possibility to filter.
This will be great for example, to filter job postings by keywords, which can be also in the description!

Thus, having:
- toggles to filter by location, 
- searchbar to look for company
- searchbar to look for title or something in the description

The backend will be responsible for fetching the data from the DB, and returning it to the frontend.
"""

from flask import Flask, jsonify, request
from db import create_session, Job as DBJob
import requests

app = Flask(__name__)


@app.route("/api/jobs", methods=["GET"])
def get_jobs_paginated():
    """
    Get paginated job postings from the database.
    Query parameters:
        - page: The page number to retrieve (default: 1)
        - limit: The number of job postings per page (default: 10)
    Returns:
        - A JSON response containing a list of job postings.
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    offset = (page - 1) * limit
    session = create_session()
    db_jobs = session.query(DBJob).offset(offset).limit(limit).all()
    results = []
    for db_job in db_jobs:
        results.append({
            "company": db_job.company,
            "title": db_job.title,
            "location": db_job.location,
            "link": db_job.link,
            "description": db_job.description,
            "employment_type": db_job.employment_type,
            "seniority_level": db_job.seniority_level,
            "job_function": db_job.job_function,
            "industries": db_job.industries
        })
    session.close()
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)
