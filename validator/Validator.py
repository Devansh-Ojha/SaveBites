from data_classes.UserProfile import UserProfile
from data_classes.Recipes import Recipe
from data_classes.UserPantry import Pantry
from llm_pipeline.llm_recipe_generator import RecipeLLM

INGREDIENT_THRESHOLD = 0.75
NUM_RECIPES = 5

class Validator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.recipe_llm = RecipeLLM(api_key)

    def validator(self, user: UserProfile, pantry: Pantry, recipes: list[Recipe]):
        valid_recipes = []
        invalid_feedback = []

        # takes in a list of Recipe objects and checks if they're valid
        for recipe in recipes:
            is_valid, feedback = self._is_valid_recipe(user, pantry, recipe)
            if is_valid:
                valid_recipes.append(recipe)
            else:
                invalid_feedback.append(feedback)

        # regenerates remaining recipes based on feedback during validation process
        while len(valid_recipes) < NUM_RECIPES:
            print(f"Only {len(valid_recipes)} valid recipes found. Regenerating...")

            feedback_summary = self._build_feedback_summary(invalid_feedback)
            regen_prompt = self._build_regenerate_prompt(user, feedback_summary)

            response = self.recipe_llm.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=regen_prompt,
            )

            new_recipes = self.recipe_llm.parse_json(response.text)

            for recipe in new_recipes:
                is_valid, feedback = self._is_valid_recipe(user, pantry, recipe)
                if is_valid:
                    valid_recipes.append(recipe)
                else:
                    invalid_feedback.append(feedback)

        return valid_recipes

    # validates recipes and provides feedback for reprompting when invalid
    def _is_valid_recipe(self, user: UserProfile, pantry: Pantry, recipe: Recipe):
        failed_checks = []

        for restriction in user.dietary_restrictions:
            if restriction.lower() in [ing.lower() for ing in recipe.ingredients]:
                failed_checks.append(f"Contains restricted ingredient '{restriction}'.")

        for appliance in recipe.appliances:
            if appliance.lower() not in [a.lower() for a in user.appliances]:
                failed_checks.append(f"Uses unavailable appliance '{appliance}'.")

        overlap = sum(1 for ing in recipe.ingredients if ing.lower() in [i.lower() for i in pantry.items])
        total_ingredients = len(recipe.ingredients)
        ingredient_ratio = overlap / total_ingredients if total_ingredients else 0

        if ingredient_ratio < INGREDIENT_THRESHOLD:
            failed_checks.append(
                f"Only {ingredient_ratio*100:.1f}% of ingredients available (needs ≥ {INGREDIENT_THRESHOLD*100:.0f}%)."
            )

        if failed_checks:
            return False, {"title": recipe.title, "issues": failed_checks}
        return True, None

    # builds prompt for reprompting LLM
    def _build_feedback_summary(self, feedback_list):
        summary = "These issues need correction:\n"
        for feedback in feedback_list:
            summary += f"- Recipe '{feedback['title']}' failed because:\n"
            for issue in feedback["issues"]:
                summary += f"  • {issue}\n"
        return summary.strip()

    def _build_regenerate_prompt(self, user: UserProfile, feedback_text: str):
        prompt = f"""
        You are a recipe generator. Create new recipes that fix the following problems:

        {feedback_text}

        User Information:
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
        - Improve overlap with user's available ingredients.

        Output format:
        JSON object for each recipe with:
        Title
        Ingredients: list of lists (name, quantity, unit)
        Instructions: list of strings
        Estimated Cost: float (USD)
        Estimated Time: float (minutes)
        Cuisine Type
        Tags: list of strings

        Each recipe should be separated by semicolons and contain no markdown formatting.
        """
        return prompt.strip()
