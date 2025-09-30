class UserProfile():
    
    # similar to static class variables in Java, shared by all instances of this class
    class_user_id = 1

    def __init__(self, dietary_restrictions, cuisine_preferences, budget, time_available, appliances):

        # auto generate unique user id for all users
        self.user_id = f"{UserProfile.class_user_id:05d}"
        UserProfile.class_user_id += 1

        # set ()
        self.dietary_restrictions = dietary_restrictions
        # 
        self.cusine_preferences = cuisine_preferences
        # int 
        self.budget = budget
        # int
        self.time_available = time_available
        # set ()
        self.appliances = appliances
        
        # { ingredient : { "quantity" : count, "expiration date" : datetime object }} 
        self.pantry = {}
        # [ ingredient ]
        self.purchase_history = []
        # [ { recipe : rating} ]
        self.recipe_ratings = []
        # can make a max heap using second tuple element (rating)?
        # [ (recipe, rating) ]
        # if we train a model, how can we use "semantic similarity" but it's recipes instead of words?
        self.liked_recipes = []
        # can make a max heap
        # [ (recipe, rating)]
        self.disliked_recipes = []

    def 
