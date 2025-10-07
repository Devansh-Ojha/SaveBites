# test
from Providers.LLM_test import Model
from UserProfile import UserProfile

past_purchases = {"tomato": 1}
dietary_restrictions = {"gluten", "flour"}
cuisine_preferences = ["american"]
budget = 500
time_available = 10
appliances = {"oven", "air fryer"}

test_model = Model()
test_profile = UserProfile(dietary_restrictions, cuisine_preferences, budget, time_available, appliances)

recipe = test_model.generate_recipe(test_profile)
print(recipe)