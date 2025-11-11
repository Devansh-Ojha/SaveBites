import { useReducer } from 'react';
import { Link } from 'react-router-dom';

function reducer(state, action) {
	if (state == action.type) {
		return "";
	}
	return action.type;
}

export default function UserProfile({name}) {
	const [state, dispatch] = useReducer(reducer, "");

	const testEmail = "somebody@example.com";
	const testTheme = "Light Mode"

	const elements = {
		"": <div></div>,
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
		<p style={{position: "relative", left: "50px"}}>
			<h1>Hi {name}!</h1>

			<Link style={{position: "absolute", top: "100px"}} to="/recipes">View Recipes and Reviews</Link>

			<button style={{position: "absolute", top: "150px"}} onClick={() => {
				dispatch({type: "details"})
			}}>
				Account Details
			</button>

			<button style={{position: "absolute", top: "200px"}} onClick={() => {
				dispatch({type: "settings"})
			}}>
				Settings and Preferences
			</button>

			<button style={{position: "absolute", top: "250px"}} onClick={() => {
				dispatch({type: "help"})
			}}>
				Help and Support
			</button>

			{ elements[state] }
		</p>
	)
}