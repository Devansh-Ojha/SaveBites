import json
from google import genai
import google.genai as types
from data_classes.UserProfile import UserProfile
from data_classes.Recipes import Recipe
from data_classes.UserPantry import Pantry
from llm_pipeline.llm_recipe_generator import RecipeLLM

INGREDIENT_THRESHOLD = 0.75
NUM_RECIPES = 5

class Validator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.llm = RecipeLLM(api_key).client

    def validate(self, user: UserProfile, pantry: Pantry, recipes: list[Recipe]):
        valid = []

        # checks given set of recipes
        for r in recipes:
            if self._is_valid_recipe(user, r):
                valid.append(r)

        # regenerate till we have enough
        while len(valid) < NUM_RECIPES:
            regen_prompt = self._build_regenerate_prompt(user, pantry)
            response = self.llm.models.generate_content(
                model="gemini-2.5-flash",
                contents=regen_prompt,
            )

            print("REGEN RAW:", response.text)

            new_recipes_raw = self._parse_json_list(response.text)
            new_recipes = [Recipe(**rec) for rec in new_recipes_raw]

            for r in new_recipes:
                if self._is_valid_recipe(user, r):
                    valid.append(r)
                    if len(valid) == NUM_RECIPES:
                        break

        return valid


    def _parse_json_list(self, text: str):
        try:
            data = json.loads(text)
            return data if isinstance(data, list) else [data]
        except Exception:
            print("JSON PARSE ERROR:", text)
            return []

    
    def _is_valid_recipe(self, user: UserProfile, recipe: Recipe):
        prompt = f"""
        Return JSON:
        {{
            "valid": boolean
        }}

        Check only this:
        Does the recipe contain ANY ingredient that violates the user's dietary restrictions?

        Recipe ingredients: {recipe.ingredients}
        User restrictions: {user.dietary_restrictions}

        Output ONLY JSON.
        """

        response = self.llm.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        print("VALIDATION RAW:", response.text)

        try:
            result = json.loads(response.text)
            return bool(result.get("valid", False))
        except Exception:
            print("VALIDATION JSON ERROR:", response.text)
            return False

    def _build_regenerate_prompt(self, user: UserProfile, pantry: Pantry):
            return f"""
            Generate {NUM_RECIPES} recipes that obey ALL rules below.
    
            User Restrictions: {user.dietary_restrictions}
            Cuisine Preferences: {user.cuisine_preferences}
            Budget: {user.budget_usd}
            Time Available: {user.time_available}
            Appliances: {user.appliances}
            Pantry: {pantry.items}
    
            Requirements:
            - No restricted ingredients.
            - Only use appliances listed.
            - At least {int(INGREDIENT_THRESHOLD * 100)}% of ingredients must come from the pantry.
            - Stay within budget and time.
            - Prefer user cuisine preferences.
    
            Return ONLY a JSON list. Each recipe uses keys:
            "Title", "Ingredients", "Estimated Time", "Estimated Cost", "Cuisine Type", "Tags"
            No markdown. No explanations.
            """.strip()
