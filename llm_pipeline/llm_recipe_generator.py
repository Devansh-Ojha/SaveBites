from google import genai
from google.genai import types
from data_classes.UserProfile import UserProfile
import json
from data_classes.Recipes import Recipe
import os
from dotenv import load_dotenv

class RecipeLLM:
    def __init__(self, api_key: str):
        load_dotenv()
        my_api_key = os.getenv("MY_API_KEY")
        self.client = genai.Client(api_key=my_api_key)

    def build_user_prompt(self, user: UserProfile, n_recipes: int = 1):
        prompt = f"""
            You are a recipe generator. Create {n_recipes} recipes personalized for the following user:
            User ID: {user.user_id}
            Dietary Restrictions: {', '.join(user.dietary_restrictions) if user.dietary_restrictions else 'None'}
            Cuisine Preferences: {', '.join(user.cuisine_preferences) if user.cuisine_preferences else 'None'}
            Budget (USD): {user.budget_usd:.2f}
            Time Available (minutes): {user.time_available}
            Available Appliances: {', '.join(user.appliances)}

            Guidelines:
            - Respect all dietary restrictions.
            - Stick to the listed cuisines if possible.
            - Keep ingredient costs within the budget.
            - Ensure cooking time does not exceed available time.
            - Only use listed appliances.

            Output format for each recipe:
            Title
            Ingredients: list of lists containing (name, quantity, unit)
            Procedure: a single string combining all instructions
            Appliances: list of appliances required
            Estimated Cost: float in USD
            Estimated Time: float in minutes
            Cuisine Type
            Tags: list of strings

            Provide each recipe as a separate JSON object, separated by semicolons. Do not use markdown formatting.
            """
        return prompt.strip()

    def generate_recipes(self, user: UserProfile, n_recipes: int = 3):
        prompt = self.build_user_prompt(user, n_recipes)
        print("Thinking...")
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                responseMimeType="application/json",
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            ),
        )
        print(response.text)

        try:
            raw_recipes = json.loads(response.text)
        except Exception as e:
            print("Failed to parse JSON:", e)
            return []

        recipes = []
        for r in raw_recipes[:n_recipes]:
            try:
                # Pass the dict directly; no json.dumps needed
                recipe_obj = self.parse_json(r)
                recipes.append(recipe_obj.__dict__)
            except Exception as e:
                print("Failed to parse recipe:", e)
        return recipes


    def parse_json(self, r: dict) -> Recipe:
        # Handle optional fields safely
        appliances = r.get("Appliances", [])
        if isinstance(appliances, str):
            appliances = [appliances]
        procedure = r.get("Procedure", "")

        return Recipe(
            title=r["Title"],
            ingredients=r["Ingredients"],
            cook_minutes=r["Estimated Time"],
            price_estimate_usd=r["Estimated Cost"],
            cuisine=r["Cuisine Type"],
            tags=r.get("Tags", []),
            appliances=appliances,
            procedure=procedure
        )

    
    """def generate_recipes(self, user: UserProfile) -> Recipe:
        prompt = self.build_user_prompt(user)
        print("Thinking...")
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                responseMimeType="application/json",
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            ),
        )
        print(response.text)
        recipe_obj = self.parse_json(response.text)
        return [recipe_obj]
    
    def parse_json(self, response) -> Recipe:
        r = json.loads(response)
        return Recipe(r["Title"], r["Ingredients"], r["Estimated Time"], r["Estimated Cost"], r["Cuisine Type"], r["Tags"], "", "")
    """
