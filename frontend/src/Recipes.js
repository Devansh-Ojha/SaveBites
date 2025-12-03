import { useState } from 'react';

export default function Recipes() {
	const [recipe, setRecipe] = useState("");

	const testRecipes = ["hamburger", "rice", "stir fry", "test1", "test2", "test3", "test4", "test5", "test6",
		"test7", "test8", "test9", "test10",
	];

	const testReviews = {
		"hamburger": "hamburger was good, recipe was hard to follow",  
		"rice": "rice was dry",
		"stir fry": "good",
		"test1": "1/10",
		"test2": "2/10",
		"test3": "3/10",
		"test4": "4/10",
		"test5": "5/10",
		"test6": "6/10",
		"test7": "7/10",
		"test8": "8/10",
		"test9": "9/10",
		"test10": "10/10",
	}

	return (
		<>
			<h1 style={{textAlign: "center"}}>Past Recipes and Reviews</h1>
			<div style={{border: "2px solid black", position: "relative", left: "50px", width: "500px", height: "200px", overflowY: "scroll"}}>
				<ul>
					{testRecipes.map( (item) => 
						{
							return (
							<li style={{margin: "10px"}}>
								<button onClick={() => {setRecipe(item)}}>
									{item}
								</button>
							</li>
							);
						}
					)}
				</ul>
			</div>

			{console.log(recipe)}
			<div style={{top: "100px", border: "2px solid black", position: "relative", left: "50px", width: "500px", height: "200px", overflowY: "scroll"}}>
				<p style={{margin: "10px"}}>{recipe}</p>
				<p style={{margin: "10px"}}>{testReviews[recipe]}</p>
			</div>
		</>
	);
}