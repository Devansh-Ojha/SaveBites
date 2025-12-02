import { useState } from 'react';
//import preferences from './Preferences.js';

export default function Generate({pantryItems, time, difficulty, budget, allergens, appliances, cuisines }) {
	const [recipes, setRecipes] = useState([]);

	function generateRecipe() {
		let testRecipe = {
			ingredients: "Tomato, Egg, Flour, Cheese",
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
		<div style={{position: "relative", left: "50px"}}>
			<h1>Generate Recipes!</h1>

			<h2>Here are some of the ingredients you have:</h2>
			<div style={{position: "relative", left: "50px"}}>
				<ul>
					{
						pantryItems.map( (item) => {
							return (
								<li>{item}</li>
							)
						}
					)}
				</ul>
			</div>

			<h2>and cuisines you've chosen:</h2>
			<div style={{position: "relative", left: "50px"}}>
				<ul>
					{
						cuisines.map( (item) => {
							return (
								<li>{item}</li>
							)
						}
					)}
				</ul>
			</div>
			<h2>and appliances you own:</h2>
			<div style={{position: "relative", left: "50px"}}>
				<ul>
					{
						appliances.map( (item) => {
							return (
								<li>{item}</li>
							)
						}
					)}
				</ul>
			</div>

			<button onClick={generateRecipe}>Generate with ${budget} budget and {difficulty.toLowerCase()} difficulty within {Math.floor(time / 60)} {Math.floor(time / 60) == 1 ? "hour" : "hours"} and {time % 60} {time % 60 == 1 ? "minute" : "minutes"}</button>

			<div style={{position: "relative", left: "50px"}}>
				{recipes.map( (item) => 
					{
						return recipeDisplay(item);
					}
				)}
			</div>
		</div>
	);
}