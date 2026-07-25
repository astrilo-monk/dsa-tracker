import json
import re

input_file = r"C:\Users\mdowa\.gemini\antigravity\brain\cad1e2f4-c688-447a-bddc-787baf3c669a\scratch\clean_sheet.tsv"
output_file = r"c:\Users\mdowa\OneDrive\Desktop\dsa-list\tracker\src\data\sheets\pratyush.json"

def get_platform(url):
    if not url: return "Other"
    url = url.lower()
    if "leetcode.com" in url: return "LeetCode"
    if "geeksforgeeks.org" in url: return "GeeksforGeeks"
    if "youtube.com" in url: return "YouTube"
    if "ideserve.co.in" in url: return "IDeserve"
    if "codertrain.co" in url: return "CoderTrain"
    return "Other"

def build_json():
    sheet = {
        "id": "pratyush",
        "title": "Pratyush DSA Sheet",
        "slug": "pratyush",
        "description": "Complete Pratyush DSA curriculum.",
        "patterns": []
    }

    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    current_pattern = None
    question_counter = 1

    for line in lines[1:]: # Skip header
        line = line.strip('\n')
        cols = line.split('\t')
        
        # Determine if this is a pattern header
        # Pattern rows typically have no links, or start with "1. Pattern: " in the Pattern or Question column
        if len(cols) >= 2 and (cols[0].strip().lower().startswith("pattern") or cols[1].strip().lower().startswith("pattern") or re.match(r'^\d+\.', cols[1].strip())):
            title = cols[0].strip() or cols[1].strip()
            # Clean up things like "1. Pattern: Two Pointers" -> "Pattern: Two Pointers"
            title = re.sub(r'^\d+\.\s*', '', title)
            if not title.lower().startswith("pattern"):
                title = "Pattern: " + title
                
            slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
            current_pattern = {
                "id": f"pratyush-{slug}",
                "title": title,
                "slug": slug,
                "groups": [
                    {"difficulty": "Easy", "questions": []},
                    {"difficulty": "Medium", "questions": []},
                    {"difficulty": "Hard", "questions": []},
                    {"difficulty": "Uncategorized", "questions": []}
                ],
                "resources": []
            }
            sheet["patterns"].append(current_pattern)
            continue
            
        # Or if the first column is a category name like "Traversal" or "Validation"
        if cols[0].strip() and not cols[1].strip() and len(cols) < 3:
             # It's a category
             title = cols[0].strip()
             slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
             current_pattern = {
                 "id": f"pratyush-{slug}",
                 "title": title,
                 "slug": slug,
                 "groups": [
                     {"difficulty": "Easy", "questions": []},
                     {"difficulty": "Medium", "questions": []},
                     {"difficulty": "Hard", "questions": []},
                     {"difficulty": "Uncategorized", "questions": []}
                 ],
                 "resources": []
             }
             sheet["patterns"].append(current_pattern)
             continue
             
        if not current_pattern:
             current_pattern = {
                 "id": "pratyush-general",
                 "title": "General",
                 "slug": "general",
                 "groups": [
                     {"difficulty": "Easy", "questions": []},
                     {"difficulty": "Medium", "questions": []},
                     {"difficulty": "Hard", "questions": []},
                     {"difficulty": "Uncategorized", "questions": []}
                 ],
                 "resources": []
             }
             sheet["patterns"].append(current_pattern)

        if len(cols) < 2:
            continue
            
        raw_title = cols[1].strip()
        
        # Handle cases where the first column has something like "Search", "Validation"
        if cols[0].strip() and len(cols) >= 3 and raw_title:
             if cols[0].strip().lower() not in ["search", "validation", "mirror and symmetry", "traversal", "path sum", "construction", "kth", "k closest", "heap as pointer", "greedy+heap", "2 heaps"]:
                 # Just ignore column 0 if it's junk, or prepend it
                 pass
             else:
                 # Actually, create a pattern if it doesn't exist
                 title = cols[0].strip()
                 slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
                 if current_pattern["title"] != title:
                     current_pattern = {
                         "id": f"pratyush-{slug}",
                         "title": title,
                         "slug": slug,
                         "groups": [
                             {"difficulty": "Easy", "questions": []},
                             {"difficulty": "Medium", "questions": []},
                             {"difficulty": "Hard", "questions": []},
                             {"difficulty": "Uncategorized", "questions": []}
                         ],
                         "resources": []
                     }
                     sheet["patterns"].append(current_pattern)
                 
        if not raw_title:
            # Maybe it's a follow-up link row
            if len(cols) >= 3 and cols[2].strip():
                # Add to previous question if possible
                found_prev = False
                for group in current_pattern["groups"]:
                    if group["questions"]:
                        prev_q = group["questions"][-1]
                        url = cols[2].strip()
                        plat = get_platform(url)
                        prev_q["links"].append({
                            "label": plat,
                            "url": url,
                            "platform": plat,
                            "kind": "question" if plat != "YouTube" else "resource"
                        })
                        found_prev = True
                        break
            continue

        # Extract difficulty
        diff = "Uncategorized"
        diff_match = re.search(r'\((easy|medium|hard|med)\)', raw_title, re.IGNORECASE)
        if diff_match:
            d = diff_match.group(1).lower()
            diff = "Medium" if d == "med" else d.capitalize()
            raw_title = raw_title[:diff_match.start()] + raw_title[diff_match.end():]
        raw_title = raw_title.strip()
        
        links = []
        for i in range(2, 5):
            if i < len(cols) and cols[i].strip():
                url = cols[i].strip()
                plat = get_platform(url)
                links.append({
                    "label": plat,
                    "url": url,
                    "platform": plat,
                    "kind": "question" if plat != "YouTube" else "resource"
                })
                
        # If no links, maybe it's just a text question or unlinked
        platform = "Other"
        if links:
            platform = links[0]["platform"]

        q = {
            "id": f"{current_pattern['id']}-{question_counter}",
            "title": raw_title,
            "difficulty": diff,
            "platform": platform,
            "links": links
        }
        
        for group in current_pattern["groups"]:
            if group["difficulty"] == diff:
                group["questions"].append(q)
                break
                
        question_counter += 1

    # Filter out empty patterns and empty groups
    for pattern in sheet["patterns"]:
        pattern["groups"] = [g for g in pattern["groups"] if g["questions"]]
    sheet["patterns"] = [p for p in sheet["patterns"] if p["groups"]]
    return sheet

if __name__ == "__main__":
    parsed_data = build_json()

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, indent=2)

    print(f"Successfully wrote parsed JSON to {output_file}")
    total_q = sum(len(p["groups"][0]["questions"]) for p in parsed_data["patterns"])
    print(f"Total patterns: {len(parsed_data['patterns'])}")
    print(f"Total questions: {total_q}")
