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

    def validate(self, user: UserProfile, pantry: Pantry, recipes: list[Recipe]):
        valid_recipes = []
        invalid_feedback = []

        # Validate initial recipes
        for recipe in recipes:
            is_valid, feedback = self._is_valid_recipe(user, pantry, recipe)
            if is_valid:
                valid_recipes.append(recipe)
            else:
                invalid_feedback.append(feedback)

        # Continue regenerating until enough valid recipes exist
        while len(valid_recipes) < NUM_RECIPES:
            feedback_summary = self._build_feedback_summary(invalid_feedback)
            regen_prompt = self._build_regenerate_prompt(user, feedback_summary)

            response = self.recipe_llm.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=regen_prompt,
                config=types.GenerateContentConfig(
                    responseMimeType="application/json",
                    thinking_config=types.ThinkingConfig(thinking_budget=0)
                ),
            )

            new_recipes = self.recipe_llm.parse_json(response.text)
            invalid_feedback = []  # reset per regeneration batch

            for recipe in new_recipes:
                is_valid, feedback = self._is_valid_recipe(user, pantry, recipe)
                if is_valid:
                    valid_recipes.append(recipe)
                    if len(valid_recipes) == NUM_RECIPES:
                        break
                else:
                    invalid_feedback.append(feedback)

        return valid_recipes

    # validates recipes and provides feedback for reprompting when invalid
    def _is_valid_recipe(self, user: UserProfile, pantry: Pantry, recipe: Recipe):
        validation_prompt = f"""
        Validate this recipe. Return ONLY JSON with:
        "valid": boolean,
        "issues": list of strings describing what must be fixed.

        Validation rules:
        1. It must NOT contain any ingredient violating the user's dietary restrictions.
        2. At least {int(INGREDIENT_THRESHOLD * 100)}% of ingredients must appear in the user's pantry.
        3. All appliances must be in the user's available appliance list.

        User restrictions: {user.dietary_restrictions}
        User pantry: {pantry.items}
        User appliances: {user.appliances}

        Recipe title: {recipe.title}
        Recipe ingredients: {recipe.ingredients}
        Recipe appliances: {recipe.appliances}

        Return only JSON.
        """

        response = self.recipe_llm.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=validation_prompt,
            config=types.GenerateContentConfig(
                responseMimeType="application/json",
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            ),
        )

        results = self.recipe_llm.parse_json(response.text)

        if results.get("valid", False):
            return True, None

        return False, {
            "title": recipe.title,
            "issues": results.get("issues", [])
        }

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
        Generate new recipes that directly fix all of the following problems:

        {feedback_text}

        User Info:
        Dietary Restrictions: {user.dietary_restrictions}
        Cuisine Preferences: {user.cuisine_preferences}
        Budget: {user.budget_usd}
        Time Available: {user.time_available}
        Appliances: {user.appliances}
        Pantry: {pantry.items}

        Requirements:
        - Respect all dietary restrictions.
        - Do not use any appliance not in the user's appliance list.
        - At least {int(INGREDIENT_THRESHOLD*100)}% of ingredients must come from the pantry.
        - Stay within budget and time constraints.
        - Match cuisine preferences when possible.

        Output strictly in JSON.
        Return a JSON list of recipe objects. No markdown.
        """
        return prompt.strip()
