export default function Generate() {
	const testIngredients = ["Tomato", "Ground Beef"]
	const testCuisines = ["Italian", "American"]
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

			<button>Generate</button>
		</p>
	);
}