import { useReducer } from 'react';

function reducer(state, action) {
	if (state == action.type) {
		return "";
	}
	return action.type;
}

export default function UserProfile({name}) {
	const [state, dispatch] = useReducer(reducer, "");

	const testRecipes = ["hamburger", "rice"];
	const testReviews = ["hamburger was good", "rice was dry"];
	const testEmail = "somebody@example.com";
	const testTheme = "Light Mode"

	const elements = {
		"": <div></div>,
		"recipes": <div style={{float: "right", margin: "100px"}}>
						Recipes:
						<ul>
							<li>{testRecipes[0]}</li>
							<li>{testRecipes[1]}</li>
						</ul>
				
					</div>,
		"reviews": <div style={{float: "right", margin: "100px"}}>
						Reviews:
						<ul>
							<li>{testReviews[0]}</li>
							<li>{testReviews[1]}</li>
						</ul>
				
					</div>,
		"details": <div style={{float: "right", margin: "100px"}}>
						Account Details:
						<p>Email: {testEmail}</p>
					</div>,
		"settings": <div style={{float: "right", margin: "100px"}}>
						Settings and Preferences:
						<p>Theme: {testTheme}</p>
					</div>,
		"help": <div style={{float: "right", margin: "100px"}}>
						Help:
					</div>,
	}

	return (
		<>
			<h1>Hi {name}!</h1>

			<button style={{position: "absolute", top: "150px"}} onClick={() => {
				dispatch({type: "recipes"})
			}}>
				View Saved Recipes
			</button>

			<button style={{position: "absolute", top: "200px"}} onClick={() => {
				dispatch({type: "reviews"})
			}}>
				View Past Reviews
			</button>

			<button style={{position: "absolute", top: "250px"}} onClick={() => {
				dispatch({type: "details"})
			}}>
				Account Details
			</button>

			<button style={{position: "absolute", top: "300px"}} onClick={() => {
				dispatch({type: "settings"})
			}}>
				Settings and Preferences
			</button>

			<button style={{position: "absolute", top: "350px"}} onClick={() => {
				dispatch({type: "help"})
			}}>
				Help and Support
			</button>

			{ elements[state] }
			
		
		</>
	)
}