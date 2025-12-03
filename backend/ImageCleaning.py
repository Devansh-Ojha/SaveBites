import cv2 as cv
from skimage.transform import rotate
import pytesseract as pyt
import re
import numpy as np
import requests
import os
from dotenv import load_dotenv
from deskew import determine_skew
import sys
import json

load_dotenv()

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise RuntimeError("Missing API_KEY. Put it in a .env file in the project root.")


# path to receipt image
img_path = sys.argv[1]#"backend/test_images/test_image15.png"

# common words on a receipt to ignore
skip_words = [
                "tax ", "tip ", "subtotal ", "total ", "am ", "pm ",
                "address ", "terminal ", "table ", "check ", "date ", "amount ",
                "amt ", "balance ", "tab ", "trace ", "admin ", "fee ", 
                "item ", "items ", "sold ", "cash ", "card ", "credit ", "debit ", 
                "visa ", "mastercard ", "amex ", "discover ", "feedback ", "rewards program ",
                "auth ", "approval ", "aid ", "emv ", "contactless ", "swipe ", "tap ",
                "pin ", "signature ", "merchant copy ", "customer copy ", "change ", "balance ",
                "subtotal ", "sales tax ", "rounding ", "due ", "amount due ",
                "cash back ", "gratuity ", "fee ", "surcharge ",
                "coupon ", "mfr ", "manufacturer ", "loyalty ", "reward ", "rewards ", "points ",
                "promo ", "discount ", "bogo ", "member price ", "savings ",
                "order ", "trans ", "txn ", "transaction ", "invoice ", "ref ",
                "terminal ", "register ", "reg ", "cashier ", "assoc ", "operator ", "batch ",
                "app ", "app code ", "store ", "lock ", "drawer ", "lane ",
                "market ", "grocery ", "supermarket ", "store ", "pharmacy ",
                "thank you ", "come again ", "survey "
             ]

# takes a path to an image and returns the image, converted to grayscale, as numpy array  
def imageToGrayScale(input_path):
    img = cv.imread(input_path)
    return cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# measure sharpness of image using variance. if the variance is high, edges are clear so don't apply a blur.
# if variance is low, image is slightly out of focus, apply a blur to remove noise
def blur(gray):
    sharp = cv.Laplacian(gray, cv.CV_64F).var()
    if sharp > 150:          # tune 80–150 range for your set
        return gray          # no blur
    return cv.GaussianBlur(gray, (3,3), 0)

# applies otsu threshold rather than simple threshold to determine threshold value automatically
def otsu_contrast(gray):
    _, th = cv.threshold(gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
    return th

# cleans the image, by applying previous methods
def clean_image(infile):
    gray = imageToGrayScale(infile) # convert image to gray scale
    gray = blur(gray) # apply blur if needed
    gray = cv.bilateralFilter(gray, d=9, sigmaColor=50, sigmaSpace=50) # smooths noise, while preserving edges

    angle = determine_skew(gray) # determines the tilt of the text as an angle
     # rotates image based on the calculated angle
    rotated_gray = (rotate(gray, angle, resize=True) * 255).astype(np.uint8)

    # applies the otsu contrast threshold to automatically decide thresholds per pixel rather than hard coding a value
    final = otsu_contrast(rotated_gray)
    cv.imwrite("backend/test_images/test_output.png", final) # puts the final image in test_output.png
    return final

# If you don't have tesseract executable in your PATH, include the following:
pyt.pytesseract.tesseract_cmd = r'/opt/homebrew/bin/tesseract'

# searches the usda database for the word, returns True if it finds a result for the food, False otherwise
def is_food_usda(name: str, api_key: str, min_score: int = 50) -> bool:
    url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {"api_key": api_key, "query": name, "pageSize": 5}
    r = requests.get(url, params=params, timeout=10)
    if r.status_code != 200:
        return False
    data = r.json()
    foods = data.get("foods", [])
    return any(f.get("description") for f in foods)

def decide_receipt_format(string):
    lines = receipt_text.splitlines()
    format1regex = re.compile(r"^(?=.*\b\d+(?:\.\d+)?\b)(?=.*[A-Za-z]).+$")
    format2regex = re.compile(r"^([A-Za-z\s]+).*(\d+\.\d{2})")
    # endsInPriceRegex = re.compile(r"(\d+\.\d{2})$")
    for line in lines:
        # endsInPriceRegex.match(line)
        if  all([0 for word in skip_words if word in line]) and is_food_usda(line, API_KEY):
            #checks same line format
            if format1regex.match(line):
                return item_quant_on_same_line_format(string)
            elif format2regex.match(line):
                return no_quantity_format(string)
            # elif "@" in line:
                
# takes the entire receipt text and extracts the ingredients and their quantities
def item_quant_on_same_line_format(string):
    quant = 0
    ingredients = {}
    line_array = []

    for line in string.splitlines(): # Splits big ass text into individual lines
        if re.compile(r"^(?=.*\b\d+(?:\.\d+)?\b)(?=.*[A-Za-z]).+$").match(line): # if line follows format, append
            line_array.append(line)

    for curr in line_array: # go through each line appended
        ing = ""
        quant = 0
        for item in curr.split(" "): # splits line by space, so now it is its own array
            if item.isdigit(): # checks if item is entirely digits, won't override, since 1x is a string, not digit
                quant = int(item) #sets temp_quantity to item
            elif item.isalpha(): # if item is only alphabet characters
                ing = ing + item + " " #update igredient variable, accounts for multi word ingredients
        #check usda food database for the item to see if it is a food
        if is_food_usda(ing, API_KEY):
            for word in skip_words: 
                # check if the any of the words to skip are in the item or vice versa, check that the quantity is reasonable
                if (word in ing.lower()) or (quant > 100) or (quant <= 0) or ing == "":
                    break
            else:
                ingredients.update({ing.lower(): (ingredients.get(ing.lower(), 0) + quant, "")}) # append to ingredients
            
    return ingredients

def no_quantity_format(string):
    line_array = []
    ingredients = {}    
    for line in string.split('\n'):
        print(line + string(re.compile(r"^([A-Za-z\s]+).*(\d+\.\d{2})").match(line)))
        if re.compile(r"^([A-Za-z\s]+).*(\d+\.\d{2})").match(line):
            print(line)
            line_array.append(line)
    
    for curr in line_array:
        ing = ""
        for item in curr.split(" "):
            if item.isalpha():
                ing = ing + item + " "
        if is_food_usda(ing, API_KEY):
            for word in skip_words:
                if (word in ing.lower()) or ing == "":
                    break
            else:
                ingredients.update({ing.lower(): ingredients.get(ing.lower(), 0) + 1})

    return ingredients

def trader_joes_format(string):
    line_array = []
    ingredients = {}
    print(string)    
    for curr in string.split('\n'):
        searchRegex = re.compile(r"([\D]+)\d*")
        match = re.search(searchRegex, curr)
        if match:
            line = match.group(1)
            for i in line.split(" "):
                if is_food_usda(i, API_KEY):
                    ingredients.update({line.lower(): (ingredients.get(line.lower(), (0, ""))[0] + 1, "")})
                    break; 
    return ingredients

# converts the hash map to a table, just for demonstration purposes
def show_data_as_table(dictionary):
    rows = []
    for name, (qty, unit) in dictionary.items():
        ingredient = name.strip()                  # remove trailing space
        qty_str = f"{qty} {unit}".strip()          # hide unit if empty
        rows.append((ingredient, qty_str))

    # Column widths
    w1 = max(len("Item"), *(len(r[0]) for r in rows)) if rows else len("Item")
    w2 = max(len("Quantity"),  *(len(r[1]) for r in rows)) if rows else len("Quantity")

    # Print table
    print(f"{'Item':<{w1}} | {'Quantity':<{w2}}")
    print(f"{'-'*w1}-+-{'-'*w2}")
    for ing, q in rows:
        print(f"{ing:<{w1}} | {q:<{w2}}")

clean_image(img_path)
receipt_text = pyt.image_to_string('backend/test_images/test_output.png')
extracted_ingredients = decide_receipt_format(receipt_text)
print(json.dumps(extracted_ingredients))
#extracted_ingredients = trader_joes_format(receipt_text)
#show_data_as_table(extracted_ingredients)


# grocery_items = []
# # Compile the regex pattern for efficiency. See the breakdown above for an explanation.
# item_pattern = re.compile(r"^([\w\s.&'-]+?)\s+.*?([\d,]+\.\d{2})$")

# # Process the raw text line by line
# for line in receipt_text.split('\n'):
#     # Search for a match in the current line
#     match = item_pattern.match(line)
    
#     # If a line matches the item pattern...
#     if match:
#         # Extract the item name (Group 1) and price (Group 2) and remove extra whitespace
#         item_name = match.group(1).strip()
#         quantity = match.group(2).strip()
        
#         # Filter out common non-item keywords to avoid false positives
#         if "total" not in item_name.lower() and "tax" not in item_name.lower():
#             grocery_items.append({"item": item_name, "quantity": quantity})

# # --- 4. Final Output ---
# print("Extracted Grocery Items:")
# for item in grocery_items:
#     print(f"- {item['item']}: ${item['quantity']}")


# SKIP_WORDS = {"subtotal", "tax", "tip", "total", "balance", "change", "card", "cash", "tender"}

# def normalize(line: str) -> str:
#     # kill leader dots and collapse spaces; strip currency spaces like "$9.50"
#     line = re.sub(r"[.\·]{2,}", " ", line)
#     line = re.sub(r"\s{2,}", " ", line)
#     line = line.replace("$ ", "$").strip()
#     return line

# def parse_price(s: str) -> float:
#     # tolerant to OCR: commas, stray $
#     return float(s.replace("$", "").replace(",", "").replace("O", "0"))

# # ---------- Patterns (compiled once) ----------
# PATTERNS = [
#     # 1) qty prefix: "2 FILET MIGNON $98.00" or "2x FILET MIGNON $98.00"
#     ("qty_prefix", re.compile(
#         r"^\s*(?P<qty>\d+(?:\.\d+)?)\s*(?:x|X|\*)?\s+(?P<name>[A-Za-z][\w\s.&'/-]+?)\s+\$?(?P<total>-?[\d,]+\.\d{2})\s*$"
#     )),
#     # 2) qty suffix: "FILET MIGNON x2 $98.00"
#     ("qty_suffix", re.compile(
#         r"^(?P<name>[A-Za-z][\w\s.&'/-]+?)\s*(?:x|X|\*)\s*(?P<qty>\d+(?:\.\d+)?)\s+\$?(?P<total>-?[\d,]+\.\d{2})\s*$"
#     )),
#     # 3) qty @ unit: "ITEM 2 @ 0.99 ... 1.98" (total optional)
#     ("qty_at_unit", re.compile(
#         r"^(?P<name>[A-Za-z][\w\s.&'/-]+?)\s+(?P<qty>\d+(?:\.\d+)?)\s*@\s*\$?(?P<unit>[\d,]+\.\d{2})(?:.*?\$?(?P<total>-?[\d,]+\.\d{2}))?\s*$"
#     )),
#     # 4) weighted produce: "APPLES 1.23 lb @ 1.99/lb ... 2.45"
#     ("weighted", re.compile(
#         r"^(?P<name>[A-Za-z][\w\s.&'/-]+?)\s+(?P<qty>\d+(?:\.\d+)?)\s*(?:lb|lbs|kg)\s*@\s*\$?(?P<unit>[\d,]+\.\d{2})\s*(?:/?(?:lb|lbs|kg))?(?:.*?\$?(?P<total>-?[\d,]+\.\d{2}))?\s*$",
#         re.IGNORECASE
#     )),
#     # 5) name + price at end: "MILK ... 3.49" → qty=1
#     ("name_price", re.compile(
#         r"^(?P<name>[A-Za-z][\w\s.&'/-]+?)\s+\$?(?P<total>-?[\d,]+\.\d{2})\s*$"
#     )),
#     # 6) price then name (rare): "$3.49 MILK"
#     ("price_name", re.compile(
#         r"^\$?(?P<total>-?[\d,]+\.\d{2})\s+(?P<name>[A-Za-z][\w\s.&'/-]+?)\s*$"
#     )),
# ]

# # Continuation line like: "2 @ 0.99 ... 1.98"
# CONT_LINE = re.compile(
#     r"^\s*(?P<qty>\d+(?:\.\d+)?)\s*@\s*\$?(?P<unit>[\d,]+\.\d{2})(?:.*?\$?(?P<total>-?[\d,]+\.\d{2}))?\s*$"
# )

# def parse_receipt_text(text: str):
#     items = []
#     last_item = None

#     for raw in text.splitlines():
#         line = normalize(raw)
#         if not line:
#             continue
#         if any(w in line.lower() for w in SKIP_WORDS):
#             last_item = None
#             continue

#         matched = False
#         for kind, pat in PATTERNS:
#             m = pat.match(line)
#             if not m:
#                 continue

#             name = m.group("name").strip()
#             qty = float(m.group("qty")) if m.groupdict().get("qty") else 1.0
#             total = parse_price(m.group("total")) if m.groupdict().get("total") else None
#             unit = parse_price(m.group("unit")) if m.groupdict().get("unit") else None

#             # Compute total if missing for qty@unit/weighted
#             if total is None and unit is not None:
#                 total = round(qty * unit, 2)

#             # Ensure ints where appropriate (e.g., "2" not "2.0")
#             qty = int(qty) if qty.is_integer() else qty

#             items.append({
#                 "item": name,
#                 "quantity": qty,
#                 "unit_price": unit if unit is not None else None,
#                 "line_total": total
#             })
#             last_item = items[-1]
#             matched = True
#             break

#         if matched:
#             continue

#         # Try continuation for the previous line (e.g., previous line was just the name)
#         m = CONT_LINE.match(line)
#         if m and last_item is not None and last_item.get("unit_price") is None:
#             qty = float(m.group("qty"))
#             unit = parse_price(m.group("unit"))
#             total = parse_price(m.group("total")) if m.group("total") else round(qty * unit, 2)
#             last_item["quantity"] = int(qty) if qty.is_integer() else qty
#             last_item["unit_price"] = unit
#             last_item["line_total"] = total
#             continue

#         # If nothing matched, reset continuation chain
#         last_item = None

#     # Optional: drop None fields for cleanliness
#     for it in items:
#         if it["unit_price"] is None:
#             del it["unit_price"]
#     return items

# print(receipt_text)
# with open('rawtext.txt', 'w', encoding='unicode-escape') as f:
#     f.write(receipt_text)

# items = parse_receipt_text(receipt_text)
# for it in items:
#     if "unit_price" in it:
#         print(f"{it['item']} x{it['quantity']} @ ${it['unit_price']:.2f}")
#     else:
#         print(f"{it['item']} x{it['quantity']}")
