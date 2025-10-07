from __future__ import annotations
from dataclasses import dataclass, asdict, field
from datetime import datetime, timedelta
from typing import Dict, Optional, List, Tuple, Iterable

@dataclass
class PantryEntry():
    """
    Ingredients currently available
    Quantity remaining
    Expiry dates (from FoodKeeper dataset or scanned labels)
    Recipe Database
    RecipeNLG or Forkify API or something??
    Ingredient lists
    Cooking times
    Nutrition facts (or USDA FoodData API for calories)
    """
    name: str 
    qty: float
    unit: str
    expires_on: Optional[datetime] = None


    # ingredients = [] #ingredients currently available, quantity, and expiration dates
	

    # def __init__(self, user_id, ):
    # d

class Pantry():
    #A map for canonical ingredient names (fixes typos and duplicates)
    #this is just a shortcut for now but we can use api later
    _CANON = {
        "white rice":"rice",
        "brown rice":"rice",
        "brocolli":"broccoli",
        "garbanzo beans":"chickpeas"
    }
    
    @staticmethod
    def norm(s: str) -> str:
        """Normalized ingredient names to lowercase and fix variants."""
        s = s.strip().lower()
        return Pantry._CANON.get(s, s)

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.items: Dict[str, PantryEntry] = {}
	    