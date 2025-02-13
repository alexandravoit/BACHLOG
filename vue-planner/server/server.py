# PYTHON SCRIPT FOR SCRAPING OIS
from playwright.sync_api import sync_playwright
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)

CORS(app)

def getLikelySemester(sügisCount, kevadCount):

    if sügisCount > kevadCount:
        return "autumn"
    elif kevadCount > sügisCount:
        return "spring"
    else:
        return "both"

def scrape_course_semesters(course_code):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)  # Set headless=False for debugging
        page = browser.new_page()

        try:
            # Go to the course page
            page.goto(f"https://ois2.ut.ee/#/courses/{course_code}")


            try:
                # Focus the <mat-select> element
                page.focus("mat-select")

                # Trigger a click event on the <mat-select> element
                page.evaluate('''() => {
                    document.querySelector("mat-select").click();
                }''')

                # Wait for the <mat-option> elements aka versions (not providede by ois API) to appear
                page.wait_for_selector("mat-option", timeout=10000)

                # Extract all versions
                versions = page.evaluate('''() => {
                    const options = Array.from(document.querySelectorAll("mat-option"));
                    return options.map(option => option.innerText.trim());
                }''')

                print(versions)

                sügisCount = 0
                kevadCount = 0

                # SLIGHTLY FLAWED LOGIC (Does not accaunt for sessioon and päevõpe) BUT WORKS FOR NOW

                for version in versions:

                    version = version.split(", ")

                    semester = version[0].split(" ")[1]

                    if semester == "sügis":sügisCount += 1

                    if semester == "kevad":kevadCount += 1
                    
                conclusion = getLikelySemester(sügisCount, kevadCount)
                
                return {
                    "course_code": course_code,
                    "sügisCount": sügisCount,
                    "kevadCount": kevadCount,
                    "conclusion": conclusion
                }
            except:
                return {
                    "course_code": course_code,
                    "sügisCount": 0,
                    "kevadCount": 0,
                    "conclusion": "N/A"
                }
        

        except Exception as e:
            print(f"An error occurred: {e}")

        finally:
            browser.close()


@app.route('/course/<course_code>', methods=['GET'])
def course_semesters(course_code):
    result = scrape_course_semesters(course_code)
    return jsonify(result)




if __name__ == '__main__':
    app.run(debug=True, port=5001)

# TODO Better error handling needed but API works