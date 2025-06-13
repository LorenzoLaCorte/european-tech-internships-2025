import re
import urllib.request

def get_table(url):
    with urllib.request.urlopen(url) as f:
        content = f.read().decode('utf-8')
        if "404: Not Found" in content:
            print(f"Error: Invalid content from {url}")
            exit(1)
        return content

def inject_block(template, tag, content):
    pattern = rf"(<!-- BEGIN {tag} -->)(.*?)(<!-- END {tag} -->)"
    return re.sub(pattern, rf"\1\n{content}\n\3", template, flags=re.S)

tpl = open("README.template.md").read()

urls = {
    "INTERNSHIPS": "https://raw.githubusercontent.com/LorenzoLaCorte/internship-scraper/main/output/output-internships/table.md",
    "ML_INTERNSHIPS": "https://raw.githubusercontent.com/LorenzoLaCorte/internship-scraper/refs/heads/main/output/output-ml/table.md",
    "NEWGRADS": "https://raw.githubusercontent.com/LorenzoLaCorte/internship-scraper/main/output/output-new-grads/table.md",
    "PHDS": "https://raw.githubusercontent.com/LorenzoLaCorte/internship-scraper/refs/heads/update-results-phds/output/output-phds/table.md",
}

out = tpl
for tag, url in urls.items():
    out = inject_block(out, tag, get_table(url))

with open("README.md", "w") as f:
    f.write(out)
