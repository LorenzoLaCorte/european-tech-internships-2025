"""
The frontend --- built on top of this backend --- will include additional details, and the possibility to filter.
This will be great for example, to filter job postings by keywords, which can be also in the description!

Thus, having:
- toggles to filter by location, 
- searchbar to look for company
- searchbar to look for title or something in the description

The backend will be responsible for fetching the data from the DB, and returning it to the frontend.
"""

from flask import Flask, jsonify
from db import create_session, Job as DBJob
import requests

app = Flask(__name__)

@app.route("/api/db-jobs", methods=["GET"])
def get_real_jobs():
    session = create_session()
    db_jobs = session.query(DBJob).all()
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
