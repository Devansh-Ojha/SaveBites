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
	def __init__(self, title, ingredients, cook_minutes, price_estimate_usd, cuisine, tags):
		self.title = title
		self.ingredients = ingredients
		self.cook_minutes = cook_minutes
		self.price_estimate_usd = price_estimate_usd
		self.cuisine = cuisine
		self.tags = tags