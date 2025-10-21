from data_classes.UserProfile import UserProfile
from data_classes.UserPantry import Pantry
from data_classes.Recipes import Recipe
from validator.Validator import Validator

class Ranker:
  def __init__(self, api_key):
    self.validator = Validator(api_key)
  def rank(self, user_profile, pantry, recipes):
    valid_recipes = self.validator.validator(user_profile, pantry, recipes)
    ranking = {}
    for recipe in valid_recipes:
      cuisine_score = -1
      for integer in range(len(user_profile.cuisine_preferences)):
        if recipe.cuisine == user_profile.cuisine_preferences[integer]:
          cuisine_score = integer
      if cuisine_score == -1:
        cuisine_score = 0
      elif cuisine_score != -1:
        cuisine_score = len(user_profile.cuisine_preferences) - cuisine_score
      budget_score = user_profile.budget_usd - recipe.price_estimate_usd)
      time_score = profile.time_available - recipe.cook_minutes
      a = 1
      b = 1
      c = 1
      recipe_score = (a * cuisine_score) + (b * budget_score) + (c * time_score)
      ranking[recipe] = recipe_score
      sorted_ranking = [rank for rank in ranking]
      sorted_ranking.sort(key=lambda x: ranking[x])
    return sorted_ranking
