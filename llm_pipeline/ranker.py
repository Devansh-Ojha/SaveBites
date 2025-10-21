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
