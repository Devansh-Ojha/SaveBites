import { useState } from 'react';
import './buttons.css';
import './Generate.css'

export default function Generate({pantryItems, time, difficulty, budget, allergens, appliances, cuisines }) {
	const [recipes, setRecipes] = useState([]);

	function generateRecipe() {
		let testRecipe = {
			name: "Cheese Pizza",
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
				Name: {recipe.name} <br />
				Ingredients: {recipe.ingredients}  <br />
				Instructions: {recipe.instructions} <br />
				Appliances: {recipe.appliances} <br />
				Budget: ${recipe.budget}
			</p>
		);
	}

	function listRecipes(recipes) {
		return (
			<ul>
				{recipes.map(item => (
					<li key={item.name}>{item.name}</li>
				))}
			</ul>
		)
	}

	return (
		<div style={{display: "flex"}}>
			<div className="box" style={{left: "10px"}}>
				<h1>Create a Recipe!</h1>

				<h3>Here are some of your ingredients: </h3>
				<div style={{position: "relative", left: "50px"}}>
						{
							// display top 7 ingredients
							pantryItems.slice(0,7).map((item) => {
								return (
									<li key={item}>{item}</li>
								)
							}
						)}
				</div>

				<h3>Your top Cuisines: </h3>
				<div style={{position: "relative", left: "50px"}}>
					{
						// display top 3 cuisines
						cuisines.slice(0,3).map((item) => {
							return (
								<li key={item}>{item}</li>
							)
						}
					)}
				</div>

				<button className="btn-primary" onClick={generateRecipe}>Generate with ${budget} budget and {difficulty.toLowerCase()} difficulty within {Math.floor(time / 60)} {Math.floor(time / 60) == 1 ? "hour" : "hours"} and {time % 60} {time % 60 == 1 ? "minute" : "minutes"}</button>

			</div>

			<div className="box" style={{left: "30px"}}>
				<h1>Generated Recipe</h1>
				{recipes.length > 0 && recipeDisplay(recipes[0])}
			</div>

			<div className="box" style={{left: "50px"}}>
				<h1> Browse more Recipes </h1>
				{recipes.length > 0 && listRecipes(recipes.slice(1,))}
			</div>

		</div>
	);
}