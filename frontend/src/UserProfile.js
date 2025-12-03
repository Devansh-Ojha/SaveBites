import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import "./Profile.css";
import './buttons.css';

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
						<Link className="link" to="/preferences">
							Set Preferences
						</Link>
					</div>,
		"help": <div className="content">
						Help:
					</div>,
	}

	return (
		<div className="profile-box">
			<h1>Hi {name}!</h1>

			<Link className="link" style={{float: "left", position: "absolute", top: "175px"}} to="/recipes">View Recipes and Reviews</Link>

			<span>
				<button className="button" style={{left: "35px"}} onClick={() => {
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

				<hr style={{position: "relative", left: "-125px", top: "25px", width: "560px"}}/>
			</span>

			<div style={{position: "relative", top: "-100px"}}>
				{ elements[state] }
			</div>
		</div>
	)
}