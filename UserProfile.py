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
        self.cusine_preferences = list(cuisine_preferences)
        # float 
        self.budget_usd = float(budget_usd)
        # int
        self.time_available = int(time_available)
        # set ()
        self.appliances = set(appliances)

        # """""totally optional but we can also record the ratings of the recipes from the user""""
        self.recipe_ratings: Dict[str, float] = {}

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

