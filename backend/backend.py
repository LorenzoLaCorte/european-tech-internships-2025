"""
The Frontend built on top of this backend will include additional details, and the possibility to filter.
This will be great for example, to filter job postings by keywords, which can be also in the description!!
But also to filter by location, company, etc.
The backend will be responsible for fetching the data from the DB, and returning it to the frontend.
---
This is just a mockup. The actual backend will take data from DB.
TODO: When running Jobpilot from IS, we should also push all the filtered results to a DB.
        -> with also all the additional details of the job.
    Then, we can actually use the same Job class of Jobpilot, by importing it.
"""

from flask import Flask, jsonify
import requests

INTERNSHIP_TABLE_URL = "https://raw.githubusercontent.com/LorenzoLaCorte/european-tech-internships-2025/refs/heads/main/table.md"

app = Flask(__name__)

class Job:
    def __init__(self, company, title, location, link):
        self.company = company
        self.title = title
        self.location = location
        self.link = link

    def to_dict(self):
        return {
            "company": self.company,
            "title": self.title,
            "location": self.location,
            "link": self.link
        }


def parse_markdown_table(markdown_content):
    lines = markdown_content.split("\n")
    jobs = []
    
    for line in lines[2:]:  # skip header and separator rows...
        if not line.strip():
            continue  # ...and empty lines
        
        # split row into columns by '|'
        columns = [col.strip() for col in line.split('|') if col.strip()]
        if len(columns) == 4:
            job = Job(company=columns[0], title=columns[1], location=columns[2], link=columns[3])
            jobs.append(job)
    
    return jobs


@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    """
    Returns a list of job postings
    """
    response = requests.get(INTERNSHIP_TABLE_URL)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch jobs data"}), 500
    
    markdown_content = response.text
    jobs = parse_markdown_table(markdown_content)
    
    return jsonify([job.to_dict() for job in jobs])


if __name__ == "__main__":
    app.run(debug=True)
