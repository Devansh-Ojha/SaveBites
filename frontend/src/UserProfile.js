import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import "./Profile.css"

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
		"details": <div className="content">
						Account Details:
						<p>Email: {testEmail}</p>
					</div>,
		"settings": <div className="content">
						Settings and Preferences:
						<p>Theme: {testTheme}</p>
						<Link to="/preferences">
							Set Preferences
						</Link>
					</div>,
		"help": <div className="content">
						Help:
					</div>,
	}

	return (
		<div style={{position: "relative", left: "50px"}}>
			<h1>Hi {name}!</h1>

			<Link style={{float: "left", position: "absolute", top: "125px"}} to="/recipes">View Recipes and Reviews</Link>

			
			<span>
				<button className="button" style={{left: "0px"}} onClick={() => {
					dispatch({type: "details"})
				}}>
					Account Details
				</button>

				<button className="button" style={{left: "200px"}} onClick={() => {
					dispatch({type: "settings"})
				}}>
					Settings and Preferences
				</button>

				<button className="button" style={{left: "450px"}} onClick={() => {
					dispatch({type: "help"})
				}}>
					Help and Support
				</button>

				<hr style={{position: "relative", left: "-425px", top: "25px", width: "590px"}}/>
			</span>

			
			
			

			{ elements[state] }
		</div>
	)
}