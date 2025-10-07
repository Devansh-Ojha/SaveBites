from google import genai
from google.genai import types
from Recipes import Recipe
from UserProfile import UserProfile

class Model():
	# change this later
	API_KEY = "AIzaSyD9-4W4UDIh4boXrFvbHYZhHXLq4M4-_VA"

	def __init__(self):
		self.client = genai.Client(api_key=Model.API_KEY)

	def generate_recipe(self, UserProfile):
		response = self.client.models.generate_content(
			model="gemini-2.5-flash",
    		contents="Generate a recipe",
    		config=types.GenerateContentConfig( #configuration for the generation 
        		thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
    		),
		)
		return response.text 