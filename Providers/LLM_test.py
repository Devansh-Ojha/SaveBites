from google import genai
from google.genai import types
from data_classes.Recipes import Recipe
from data_classes.UserProfile import UserProfile

import os
api_key = os.getenv("GOOGLE_API_KEY")

class Model():
	# change this later

	def __init__(self):
		self.client = genai.Client(api_key=api_key)

	def generate_recipe(self, UserProfile):
		response = self.client.models.generate_content(
			model="gemini-2.5-flash",
    		contents="Generate a recipe",
    		config=types.GenerateContentConfig( #configuration for the generation 
        		thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
    		),
		)
		return response.text 