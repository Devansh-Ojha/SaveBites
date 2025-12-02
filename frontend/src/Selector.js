import { useState, Fragment } from "react";
import './buttons.css';
import './Login.css';

export default function Selector( { setState, options } ) {
	const [otherOptions, setOtherOptions] = useState([0]);
	const [otherChecked, setOtherChecked] = useState([false]);
	
	function handleSubmit(e) {
		e.preventDefault();

		const form = e.target;
		const formData = new FormData(form);

		const formJson = Object.fromEntries(formData.entries());
		
		console.log(formJson);
		let selectedOptions = [];
		for (let key in formJson) {
			if (formJson[key] == "on") {
				let otherKey = key.split(/[0-9]/);
				if (otherKey[0] == "other") {
					selectedOptions.push(formJson[`text${key.substring(5)}`]);
				}
				else {
					selectedOptions.push(key);
				}
			}
		}
		setState(selectedOptions);
	}

	function handleTextChange(e, item) {
		let temp = [...otherChecked];
		if (e.target.value != "") {
			temp[item] = true;
		}
		else {
			temp[item] = false;
		}
		setOtherChecked(temp);
	}

	function handleClick(e, item) {
		let temp = [...otherChecked];
		temp[item] = !temp[item];
		setOtherChecked(temp);
	}

	function handleAddOption() {
		let nextID = otherOptions.at(-1) + 1;
		setOtherOptions(otherOptions.concat(nextID));
		setOtherChecked(otherChecked.concat(false));
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				{
					options.map( (item) => {
						return (
							<>
								<label style={{display: "inline-block", paddingTop: "5px"}}>
									<input name={item} type="checkbox"></input> {item}
								</label>
								<br />
							</>
						)
					}
				)}
				{
					otherOptions.map(
						(item) => { 
							return (
							<>	
								<label style={{display: "inline-block", paddingTop: "5px"}}>
									<input name={`other${item}`} onChange={e => handleClick(e, item)} checked={otherChecked[item]} type="checkbox"></input> 
									<input style={{borderWidth: "1px", borderRadius: "6px"}} placeholder="Enter another option" name={`text${item}`} onChange={e => handleTextChange(e, item)}></input>
								</label>
								<br />
							</>
							);
						}
					)
				}
				<br />
				<button className="btn-primary" type="button" onClick={handleAddOption}>Add Option</button>
				<button className="btn-primary" type="submit" style={{margin: "10px"}}>Save Changes</button>
			</form>
		</>
	);
}