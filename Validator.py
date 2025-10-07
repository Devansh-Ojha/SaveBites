from UserProfile import UserProfile

def validator(userProfile: UserProfile, response):
  string = response[response.find("Ingredients:") + len("Ingredients:") : response.find("Instructions:")]
  