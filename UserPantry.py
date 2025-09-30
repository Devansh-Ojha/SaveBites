class Pantry():
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
    ingredients = [] #ingredients currently available, quantity, and expiration dates
	
    def __init__(self, user_id, ):
	    