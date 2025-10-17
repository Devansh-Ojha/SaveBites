# test
from Providers.LLM_test import Model
from data_classes.UserProfile import UserProfile
from llm_pipeline.llm_recipe_generator import RecipeLLM
import os
import json

api_key = "AIzaSyBvDGOlAUXylnsoVxwb1ANyQ1oezYAxYJU" #os.getenv("GOOGLE_API_KEY")

def main():
    test_profile = UserProfile(
        dietary_restrictions={"gluten", "flour"},
        cuisine_preferences=["american"],
        budget_usd=500,
        time_available=10,
        appliances={"oven", "air fryer"}
    )
    past_purchases = {"tomato": 1}
    llm = RecipeLLM(api_key=api_key)
    recipe = llm.generate_recipes(test_profile)

    print(recipe)


if __name__ == "__main__":
    main()