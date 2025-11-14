import { useState } from 'react';

export default function Generate() {
	const [recipes, setRecipes] = useState([]);

	const testIngredients = ["Tomato", "Ground Beef", "Cheese", "Flour", "Herbs", "Egg", "Bell Peppers"]
	const testCuisines = ["Italian", "American"]

	function generateRecipe() {
		let testRecipe = {
			ingredients: "Tomato, Cheese, Flour",
			instructions: "Make pizza, put in oven",
			appliances: "Oven",
			budget: "10"
		};

		setRecipes(recipes.concat(testRecipe));
	}

	function recipeDisplay(recipe) {
		return (
			<p>
				Ingredients: {recipe.ingredients}  <br />
				Instructions: {recipe.instructions} <br />
				Appliances: {recipe.appliances} <br />
				Budget: ${recipe.budget}
			</p>
		);
	}

	return (
		<p style={{position: "relative", left: "50px"}}>
			<h1>Generate Recipes!</h1>

			<h2>Here are some of the ingredients you have:</h2>
			<p style={{position: "relative", left: "50px"}}>
				<ul>
					{
						testIngredients.map( (item) => {
							return (
								<li>{item}</li>
							)
						}
					)}
				</ul>
			</p>

			<h2>and cuisines you've chosen:</h2>
			<p style={{position: "relative", left: "50px"}}>
				<ul>
					{
						testCuisines.map( (item) => {
							return (
								<li>{item}</li>
							)
						}
					)}
				</ul>
			</p>

			<button onClick={generateRecipe}>Generate</button>

			<p style={{position: "relative", left: "50px"}}>
				{recipes.map( (item) => 
					{
						return recipeDisplay(item);
					}
				)}
			</p>
		</p>
	);
}