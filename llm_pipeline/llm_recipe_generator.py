from google import genai
from google.genai import types
from data_classes.UserProfile import UserProfile
import json
from data_classes.Recipes import Recipe

class RecipeLLM:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

    def build_user_prompt(self, user: UserProfile):
        prompt = f"""
            You are a recipe generator. Create a recipe personalized for the following user:
            User ID: {user.user_id}
            Dietary Restrictions: {', '.join(user.dietary_restrictions) if user.dietary_restrictions else 'None'}
            Cuisine Preferences: {', '.join(user.cuisine_preferences) if user.cuisine_preferences else 'None'}
            Budget (USD): {user.budget_usd:.2f}
            Time Available (minutes): {user.time_available} minutes
            Available Appliances: {', '.join(user.appliances)}

            Guidelines:
            - Respect all dietary restrictions.
            - Stick to the listed cuisines if possible.
            - Keep ingredient costs within the budget.
            - Ensure cooking time does not exceed available time.
            - Only use listed appliances.

            Output format:
            The recipe should be a JSON object with the following structure:
            Title
            Ingredients: list of lists containing (name, quantity, unit)
            Instructions: list of strings (each string is a step)
            Estimated Cost: float in USD
            Estimated Time: float in minutes
            Cuisine Type
            Tags: list of strings (each string is a tag)

            The response should be a JSON object for each recipe separated by semicolons and without markdown formatting.
            """
        return prompt.strip()

    def generate_recipes(self, user: UserProfile) -> Recipe:
        prompt = self.build_user_prompt(user)
        print("Thinking...")
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            ),
        )
        return self.parse_json(response.text)
    
    def parse_json(self, response) -> Recipe:
        r = json.loads(response)
        return Recipe(r["Title"], r["Ingredients"], r["Estimated Time"], r["Estimated Cost"], r["Cuisine Type"], r["Tags"])


