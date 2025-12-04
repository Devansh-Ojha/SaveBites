from data_classes.UserProfile import UserProfile
from data_classes.Recipes import Recipe
from llm_pipeline.llm_recipe_generator import RecipeLLM
import json

INGREDIENT_THRESHOLD = 0.75
NUM_RECIPES = 5

class Validator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.recipeLLM = RecipeLLM(api_key)

    def regenerate_recipes(self, user: UserProfile):
        return self.recipeLLM.generate_recipes(user)

    def validate(self, user: UserProfile, recipes: list[Recipe]):
        valid = []
        for r in recipes:
            if self._is_valid_recipe(user, r):
                valid.append(r)
        while len(valid) < NUM_RECIPES:
            new_recipe = self.regenerate_recipes(user)
            if new_recipe and self._is_valid_recipe(user, new_recipe):
                valid.append(new_recipe)
        return valid

    def is_valid_recipe(self, user: UserProfile, recipe: Recipe):
        client = self.recipeLLM.client
        prompt = f"""
        Return JSON:
        {{
            "valid": boolean
        }}
        Does the recipe contain ANY ingredient that violates the user's dietary restrictions?
        Recipe ingredients: {recipe.ingredients}
        User restrictions: {user.dietary_restrictions}
        Output ONLY JSON.
        """
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        try:
            result = json.loads(response.text)
            return bool(result.get("valid", False))
        except Exception:
            print("VALIDATION JSON ERROR:", response.text)
            return False
