import { useState } from "react";

export default function Selector( { setState, options } ) {
	const [numOptions, setNumOptions] = useState(1);
	
	function handleSubmit(e) {
		e.preventDefault();

		const form = e.target;
		const formData = new FormData(form);

		const formJson = Object.fromEntries(formData.entries());
		
		console.log(formJson);
		let selectedCuisines = [];
		for (let key in formJson) {
			if (formJson[key] == "on") {
				if (key == "other") {
					selectedCuisines.push(formJson["text"]);
				}
				else {
					selectedCuisines.push(key);
				}
			}
		}
		setState(selectedCuisines);
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				{
					options.map( (item) => {
						return (
							<>
							<label>
								<input name={item} type="checkbox"></input> {item}
							</label>
							<br />
							</>
						)
					}
				)}
				{
					[Array(numOptions).keys()].map((item) => { return (<><input name="other" type="checkbox"></input> <input name="text"></input> <br/></>)})
				}
				
				<button type="button" onClick={() => setNumOptions(numOptions+1)}>Add Option</button>
				<button type="submit">Save Changes</button>
				<h3>hi{numOptions}</h3>
			</form>
			<form></form> 
		</>
	);
}