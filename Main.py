# test
from Providers.LLM_test import Model
from data_classes.UserProfile import UserProfile
from llm_pipeline.llm_recipe_generator import RecipeLLM
import os
import json

#<<<<<<< HEAD
api_key = os.getenv("GOOGLE_API_KEY")
#=======
#user_id = -1
#past_purchases = {"tomato": 2}
#dietary_restrictions = {"gluten"}
#>>>>>>> main

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
    #print(json.loads(recipe))

    #test = r'{"Title": "Quick Air Fryer Fried Chicken Bites", "Ingredients": [["boneless, skinless chicken breast", 1, "lb"], ["cornstarch", 2, "tbsp"], ["paprika", 1, "tsp"], ["garlic powder", 0.5, "tsp"], ["onion powder", 0.5, "tsp"], ["salt", 0.5, "tsp"], ["black pepper", 0.25, "tsp"], ["olive oil spray", 1, "can"]], "Instructions": ["Pat the chicken breast dry and cut into 1-inch bite-sized pieces.", "In a medium bowl, combine the cornstarch, paprika, garlic powder, onion powder, salt, and black pepper.", "Add the chicken pieces to the bowl and toss until evenly coated.", "Preheat your air fryer to 375\u00b0F (190\u00b0C) for 2 minutes.", "Lightly spray the air fryer basket with olive oil spray. Place the chicken pieces in a single layer in the air fryer basket, being careful not to overcrowd.", "Air fry for 8-10 minutes, flipping halfway through, until golden brown and cooked through (internal temperature reaches 165\u00b0F/74\u00b0C).", "Serve immediately with your favorite gluten-free dipping sauce (e.g., BBQ sauce, honey mustard)."], "Estimated Cost": 8.5, "Estimated Time": 10.0, "Cuisine Type": "American", "Tags": ["gluten-free", "flour-free", "quick", "air fryer", "chicken", "easy"]}'
    #print(json.loads(test))


if __name__ == "__main__":
    main()