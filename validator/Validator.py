from google import genai
from google.genai import types
from data_classes.UserProfile import UserProfile
from data_classes.Recipes import Recipe
from data_classes.UserPantry import Pantry
from llm_pipeline.llm_recipe_generator import RecipeLLM

API_KEY = "AIzaSyBvDGOlAUXylnsoVxwb1ANyQ1oezYAxYJU"
INGREDIENT_THRESHOLD = 0.75

class Validator:
  def __init__(self, api_key: str):
     self.client = genai.Client(api_key= API_KEY)

  def validator(self, user: UserProfile, pantry: Pantry, recipe: Recipe):
    prompt = self.build_validator_prompt(self, user, pantry, recipe, INGREDIENT_THRESHOLD)
    response = self.client.models.generate_content(
              model="gemini-2.5-flash",
              contents=prompt,
              config=types.GenerateContentConfig(
                  thinking_config=types.ThinkingConfig(thinking_budget=0)
              ),
          ).text
    if response == "True":
      self.generate_score()
    else:
      self.regenerate_recipe()

  def build_validator_prompt(self, user: UserProfile, pantry: Pantry, recipe: Recipe, ingredient_threshold: float):
    prompt = f"""
      You are a recipe validator. Return "True" or "False" if the given recipe meets
      the following user's criteria: Dietary Restrictions, Available Applicances, and Available Ingredients.

      Does {recipe.ingredients} follow the user's dietary restrictions: {user.dietary_restrictions}?
      Does {recipe.appliances} follow the user's available appliances: {user.appliances}?
      Are at least {ingredient_threshold*100} percent of {recipe.ingredients} in the user's list of available ingredients: {pantry.items}?

      If so, this recipe passes the validator. Return "True". If not, return "False".
      """    
    return prompt.strip()

  def regenerate_recipe(self):
    return

  def generate_score(self):
    return