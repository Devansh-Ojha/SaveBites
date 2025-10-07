from dataclasses import dataclass
from typing import List,Tuple,Set,Dict

@dataclass
class Recipe:
	#Each recipe gets a unique ID
	recipe_id: str
	#Recipe title
	title: str
	#List of ingredients, where each ingredient is (name, quantity, unit)
	ingredients: List[Tuple[str, float, str]]
	cook_minutes: int
	price_estimate_usd = float
	cuisine: str
	tags: Set[str]
	#Nutrition info(optional filled later by USDA API)
	nutrition: Dict[str,float] | None = None