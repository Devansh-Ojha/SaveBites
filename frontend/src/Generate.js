import { useState } from 'react';
import './buttons.css';
import './Generate.css'

export default function Generate({pantryItems, time, difficulty, budget, allergens, appliances, cuisines }) {
	const [recipes, setRecipes] = useState([]);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	
	function generateRecipe() {
		let testRecipe1 = {
			name: "Cheese Pizza",
		  
			ingredients: [
			  { item: "Tomato", amount: "2", unit: "" },
			  { item: "Egg", amount: "1", unit: "" },
			  { item: "Flour", amount: "200", unit: "g" },
			  { item: "Cheese", amount: "150", unit: "g" },
			  { item: "Marinara Sauce", amount: "1", unit: "cup"}
			],
		  
			instructions: [
			  "Mix the flour and egg to make dough.",
			  "Roll out the dough.",
			  "Add tomato and cheese.",
			  "Bake in oven for 20 minutes."
			],
		  
			appliances: ["Oven", "Roller"],
		  
			budget: 10,
			time: 50
		  };

		  let testRecipe2 = {
			name: "Peanutbutter and Jelly Sandwich",
			ingredients: [
				{ item: "Bread", amount: "2", unit: "slices" },
				{ item: "Peanut Butter", amount: "1", unit: "tbsp" },
				{ item: "Jelly", amount: "1", unit: "tbsp" }
			],
			instructions: [
				"Spread peanut butter.",
				"Spread jelly.",
				"Put slices together."
			],
			appliances: ["None"],
			budget: 3,
			time: 3
		};

		// React batches updates, can't use concat
		setRecipes(prev => [...prev, testRecipe1, testRecipe2]);
	}

	function recipeDisplay(recipe) {
		return (
		  <div className="recipe-card">
			<ul>
				<h2>{recipe.name}</h2>
				<p><strong>Budget:</strong> ${recipe.budget}  
				<span style={{ float: "right" }}><strong>Time:</strong> {recipe.time} min</span>
				</p>
		
				<h3>Ingredients</h3>
				<ul>
				{recipe.ingredients.map((ing, i) => (
					<li key={i}>
					{ing.item} — {ing.amount} {ing.unit}
					</li>
				))}
				</ul>
		
				<h3>Appliances</h3>
				<ul>
				{recipe.appliances.map((app, i) => (
					<li key={i}>{app}</li>
				))}
				</ul>

				<h3>Instructions</h3>
				<ol>
				{recipe.instructions.map((step, i) => (
					<li key={i}>{step}</li>
				))}
				</ol>
			</ul>
		  </div>
		);
	  }
	  
	/*
	function listRecipes(recipes) {
		return (
			<ul>
				{recipes.map(item => (
					<li key={item.name}>{item.name}</li>
				))}
			</ul>
		)
	}
	*/

	function listRecipes(recipes) {
		return (
			<ul>
				{recipes.map((item, index) => (
					<li 
					  key={index} 
					  className="recipe-list-item"
					  onClick={() => setSelectedRecipe(item)}
					  style={{ cursor: "pointer" }}
					>
						{item.name}
					</li>
				))}
			</ul>
		);
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
				{selectedRecipe ? recipeDisplay(selectedRecipe) : recipes.length > 0 && recipeDisplay(recipes[0])}
			</div>

			<div className="box" style={{left: "50px"}}>
				<h1> Browse more Recipes </h1>
				{recipes.length > 0 && listRecipes(recipes)}
			</div>

		</div>
	);
}