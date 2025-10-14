import cv2 as cv
from deskew import determine_skew
from skimage.transform import rotate
import pytesseract as pyt
import re

img_path = "test_images/test_image9.png"

# takes a path to an image and returns the image, converted to grayscale, as numpy array  
def imageToGrayScale(input_path):
    img = cv.imread(input_path)
    return cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# takes an image and adjusts the contrast for readability
def contrast(img):
    _, thresh_image = cv.threshold(img, 150, 255, cv.THRESH_BINARY)
    return thresh_image

# takes a path to an image, converts it to grayscale and increases contrast, then returns deskewed image
def unskew(infile):
    clean_image = contrast(imageToGrayScale(infile))
    angle = determine_skew(clean_image)
    rotated = rotate(clean_image, angle, resize=True) * 255
    cv.imwrite("test_images/test_output.png", rotated)

unskew(img_path)

# If you don't have tesseract executable in your PATH, include the following:
pyt.pytesseract.tesseract_cmd = r'/opt/homebrew/bin/tesseract'

receipt_text = pyt.image_to_string('test_images/test_output.png')

SKIP_WORDS = {"subtotal", "tax", "tip", "total", "balance", "change", "card", "cash", "tender"}

def normalize(line: str) -> str:
    # kill leader dots and collapse spaces; strip currency spaces like "$ 9.50"
    line = re.sub(r"[.\·]{2,}", " ", line)
    line = re.sub(r"\s{2,}", " ", line)
    line = line.replace("$ ", "$").strip()
    return line

def parse_price(s: str) -> float:
    # tolerant to OCR: commas, stray $
    return float(s.replace("$", "").replace(",", "").replace("O", "0"))

# ---------- Patterns (compiled once) ----------
PATTERNS = [
    # 1) qty prefix: "2 FILET MIGNON $98.00" or "2x FILET MIGNON $98.00"
    ("qty_prefix", re.compile(
        r"^\s*(?P<qty>\d+(?:\.\d+)?)\s*(?:x|X|\*)?\s+(?P<name>[A-Za-z][\w\s.&'/-]+?)\s+\$?(?P<total>-?[\d,]+\.\d{2})\s*$"
    )),
    # 2) qty suffix: "FILET MIGNON x2 $98.00"
    ("qty_suffix", re.compile(
        r"^(?P<name>[A-Za-z][\w\s.&'/-]+?)\s*(?:x|X|\*)\s*(?P<qty>\d+(?:\.\d+)?)\s+\$?(?P<total>-?[\d,]+\.\d{2})\s*$"
    )),
    # 3) qty @ unit: "ITEM 2 @ 0.99 ... 1.98" (total optional)
    ("qty_at_unit", re.compile(
        r"^(?P<name>[A-Za-z][\w\s.&'/-]+?)\s+(?P<qty>\d+(?:\.\d+)?)\s*@\s*\$?(?P<unit>[\d,]+\.\d{2})(?:.*?\$?(?P<total>-?[\d,]+\.\d{2}))?\s*$"
    )),
    # 4) weighted produce: "APPLES 1.23 lb @ 1.99/lb ... 2.45"
    ("weighted", re.compile(
        r"^(?P<name>[A-Za-z][\w\s.&'/-]+?)\s+(?P<qty>\d+(?:\.\d+)?)\s*(?:lb|lbs|kg)\s*@\s*\$?(?P<unit>[\d,]+\.\d{2})\s*(?:/?(?:lb|lbs|kg))?(?:.*?\$?(?P<total>-?[\d,]+\.\d{2}))?\s*$",
        re.IGNORECASE
    )),
    # 5) name + price at end: "MILK ... 3.49" → qty=1
    ("name_price", re.compile(
        r"^(?P<name>[A-Za-z][\w\s.&'/-]+?)\s+\$?(?P<total>-?[\d,]+\.\d{2})\s*$"
    )),
    # 6) price then name (rare): "$3.49 MILK"
    ("price_name", re.compile(
        r"^\$?(?P<total>-?[\d,]+\.\d{2})\s+(?P<name>[A-Za-z][\w\s.&'/-]+?)\s*$"
    )),
]

# Continuation line like: "2 @ 0.99 ... 1.98"
CONT_LINE = re.compile(
    r"^\s*(?P<qty>\d+(?:\.\d+)?)\s*@\s*\$?(?P<unit>[\d,]+\.\d{2})(?:.*?\$?(?P<total>-?[\d,]+\.\d{2}))?\s*$"
)

def parse_receipt_text(text: str):
    items = []
    last_item = None

    for raw in text.splitlines():
        line = normalize(raw)
        if not line:
            continue
        if any(w in line.lower() for w in SKIP_WORDS):
            last_item = None
            continue

        matched = False
        for kind, pat in PATTERNS:
            m = pat.match(line)
            if not m:
                continue

            name = m.group("name").strip()
            qty = float(m.group("qty")) if m.groupdict().get("qty") else 1.0
            total = parse_price(m.group("total")) if m.groupdict().get("total") else None
            unit = parse_price(m.group("unit")) if m.groupdict().get("unit") else None

            # Compute total if missing for qty@unit/weighted
            if total is None and unit is not None:
                total = round(qty * unit, 2)

            # Ensure ints where appropriate (e.g., "2" not "2.0")
            qty = int(qty) if qty.is_integer() else qty

            items.append({
                "item": name,
                "quantity": qty,
                "unit_price": unit if unit is not None else None,
                "line_total": total
            })
            last_item = items[-1]
            matched = True
            break

        if matched:
            continue

        # Try continuation for the previous line (e.g., previous line was just the name)
        m = CONT_LINE.match(line)
        if m and last_item is not None and last_item.get("unit_price") is None:
            qty = float(m.group("qty"))
            unit = parse_price(m.group("unit"))
            total = parse_price(m.group("total")) if m.group("total") else round(qty * unit, 2)
            last_item["quantity"] = int(qty) if qty.is_integer() else qty
            last_item["unit_price"] = unit
            last_item["line_total"] = total
            continue

        # If nothing matched, reset continuation chain
        last_item = None

    # Optional: drop None fields for cleanliness
    for it in items:
        if it["unit_price"] is None:
            del it["unit_price"]
    return items

items = parse_receipt_text(receipt_text)
for it in items:
    if "unit_price" in it:
        print(f"{it['item']} x{it['quantity']} @ ${it['unit_price']:.2f}")
    else:
        print(f"{it['item']} x{it['quantity']}")
