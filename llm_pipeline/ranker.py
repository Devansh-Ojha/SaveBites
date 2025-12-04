from data_classes.UserProfile import UserProfile
from data_classes.UserPantry import Pantry
from data_classes.Recipes import Recipe

class Ranker:
    def __init__(self):
        pass

    def rank(self, user_profile: UserProfile, pantry: Pantry, recipes: list[Recipe]):
        unique_recipes = {}
        for recipe in recipes:
            unique_recipes[recipe.title] = recipe

        ranking = {}
        for recipe in unique_recipes.values():
            missing_ingredients = sum(1 for ing in recipe.ingredients if ing[0] not in pantry.items)
            total_ingredients = len(recipe.ingredients) if recipe.ingredients else 1
            pantry_score = 1 - (missing_ingredients / total_ingredients)

            # Time score: shorter cook time is better; invert to higher better
            time_score = max(user_profile.time_available - recipe.cook_minutes, 0) / max(user_profile.time_available, 1)

            # Appliance penalty: fraction of appliances recipe requires but user doesn't have
            missing_appliances = sum(1 for app in recipe.appliances if app not in user_profile.appliances)
            total_appliances = len(recipe.appliances) if recipe.appliances else 1
            appliance_penalty = missing_appliances / total_appliances
            appliance_score = 1 - appliance_penalty

            # Combine scores with weights (adjust as needed)
            a, b, c = 3, 1, 2  # pantry, time, appliance weights
            score = (a * pantry_score) + (b * time_score) + (c * appliance_score)

            ranking[recipe] = score

        sorted_ranking = sorted(ranking.keys(), key=lambda r: ranking[r], reverse=True)
        return sorted_ranking
