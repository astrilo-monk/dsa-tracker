import json
import re
import os

input_file = r"C:\Users\mdowa\.gemini\antigravity\brain\cad1e2f4-c688-447a-bddc-787baf3c669a\scratch\raw_sheet.txt"
output_file = r"c:\Users\mdowa\OneDrive\Desktop\dsa-list\tracker\src\data\sheets\pratyush.json"

def get_platform(url):
    if "leetcode.com" in url: return "LeetCode"
    if "geeksforgeeks.org" in url: return "GeeksforGeeks"
    if "youtube.com" in url: return "YouTube"
    if "ideserve.co.in" in url: return "IDeserve"
    if "codertrain.co" in url: return "CoderTrain"
    return "Other"

def build_json(raw_text):
    sheet = {
        "id": "pratyush",
        "title": "Pratyush DSA Sheet",
        "slug": "pratyush",
        "description": "Complete Pratyush DSA curriculum.",
        "patterns": []
    }
    
    # Some predefined cleanup
    raw_text = re.sub(r'Page \d+', '', raw_text)
    raw_text = raw_text.replace("INSTA Channel. One question DailyPattern Question Link 1 Link 2 Link 31.", "")
    
    segments = re.split(r'(https?://[^\s]+)', raw_text)
    
    current_patt = {
        "id": "pratyush-general",
        "title": "General",
        "slug": "general",
        "groups": [{"difficulty": "Uncategorized", "questions": []}],
        "resources": []
    }
    sheet["patterns"].append(current_patt)
    
    q_id_counter = 1
    
    for i in range(0, len(segments)-1, 2):
        text_chunk = segments[i].strip()
        url = segments[i+1].strip()
        
        patt_match = re.search(r'(?:Pattern|PATTERN)[\s:]*([A-Za-z0-ms&\s]+)', text_chunk)
        if patt_match:
            title = patt_match.group(1).strip()
            slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
            current_patt = {
                "id": f"pratyush-{slug}",
                "title": title,
                "slug": slug,
                "groups": [{"difficulty": "Uncategorized", "questions": []}],
                "resources": []
            }
            sheet["patterns"].append(current_patt)
            text_chunk = text_chunk[patt_match.end():].strip()
            
        diff = "Uncategorized"
        diff_match = re.search(r'\((easy|medium|hard|med)\)', text_chunk, re.IGNORECASE)
        if diff_match:
            d = diff_match.group(1).lower()
            diff = "Medium" if d == "med" else d.capitalize()
            text_chunk = text_chunk[:diff_match.start()] + text_chunk[diff_match.end():]
        
        title = text_chunk.strip(' \t\n\r.1234567890-')
        if not title:
            title = "Problem"
            
        platform = get_platform(url)
        
        q = {
            "id": f"{current_patt['id']}-{q_id_counter}",
            "title": title,
            "difficulty": diff,
            "platform": platform,
            "links": [
                {
                    "label": platform,
                    "url": url,
                    "platform": platform,
                    "kind": "question" if platform != "YouTube" else "resource"
                }
            ]
        }
        current_patt["groups"][0]["questions"].append(q)
        q_id_counter += 1

    sheet["patterns"] = [p for p in sheet["patterns"] if p["groups"][0]["questions"]]
    return sheet

if __name__ == "__main__":
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()

    parsed_data = build_json(text)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, indent=2)

    print(f"Successfully wrote parsed JSON to {output_file}")
