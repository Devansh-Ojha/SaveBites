from typing import Set, List, Dict

class UserProfile():
    
    # similar to static class variables in Java, shared by all instances of this class
    class_user_id = 1

    def __init__(self,
                  dietary_restrictions: Set[str],
                    cuisine_preferences: List[str],
                      budget_usd: float,
                        time_available: int,
                          appliances: Set[str]):

        # auto generate unique user id for all users
        self.user_id = f"{UserProfile.class_user_id:05d}"
        UserProfile.class_user_id += 1

        # set ()
        self.dietary_restrictions = set(dietary_restrictions)
        # heap? have user presented with different types of cuisines, can pick as many as they want
        # [ (cusine, rating) ]
        # If there are 25 cuisines and they only select 5 for now, make rating of first selection have a rating
        # of 25, then each after decrement by 1
        # allow user to add new cuisine preferneces at any time, and reorder preferences as well
        self.cuisine_preferences = list(cuisine_preferences)
        # float 
        self.budget_usd = float(budget_usd)
        # int
        self.time_available = int(time_available)
        # set ()
        self.appliances = set(appliances)
        self.recipe_ratings: Dict[str, float] = {}
        def change_restrictions(add_or_remove, restriction):
            if add_or_remove == "add":
                self.dietary_restrictions.add(restriction)
            elif add_or_remove == "remove" and restriction in self.dietary_restrictions:
                self.dietary_restrictions.remove(restriction)
        def change_preferences(add_or_remove, preference):
            if add_or_remove == "add":
                self.cuisine_preferences += [preference]
            elif add_or_remove == "remove" and preference in self.cuisine_preferences:
                self.cuisine_preferences.remove(preference)
        def change_budget(set_or_increase_or_decrease, number):
            if set_or_increase_or_decrease == "set":
                budget = number
            elif set_or_increase_or_decrease == "increase":
                budget += number
            elif set_or_increase_or_decrease == "decrease":
                budget -= number
        def set_time(time):
            self.time_available = time
        def change_appliances(add_or_remove, appliance):
            if add_or_remove == "add":
                self.appliances.add(appliance)
            elif add_or_remove == "remove" and appliance in self.appliances:
                self.appliances.remove(appliance)
        def rate_recipe(recipe, rating):
            self.recipe_ratings[recipe] = rating
        """"might not need these because we are making a userpantry.py"""""

         
        # # { ingredient : { "quantity" : count, "expiration date" : datetime object }} 
        # self.pantry = {}
        # # [ ingredient ]
        # self.purchase_history = []
        # # [ { recipe : rating} ]
        # self.recipe_ratings = []
        # # can make a max heap using second tuple element (rating)?
        # # [ (recipe, rating) ]
        # # if we train a model, how can we use "semantic similarity" but it's recipes instead of words in order to recommend similar tasting recipes?
        # # Or maybe it could be similar ingredient recipes / similar cuisine
        # self.liked_recipes = []
        # # can make a max heap
        # # [ (recipe, rating)]
        # self.disliked_recipes = []

