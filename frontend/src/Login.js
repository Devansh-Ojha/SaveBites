import "./Login.css";
import "./buttons.css";
import { useState } from 'react';
import { getUserProfile } from "./api.js";
import { Link, useNavigate } from 'react-router-dom';


export default function Login({setPantryItems, setUsername}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault(); //prevent page reload
		setErrorMsg("");

		const form = e.target;
		const formData = new FormData(form);

		const formJson = Object.fromEntries(formData.entries());
		try {
			//const user = getUserProfile(email);
			const res = await fetch("http://localhost:3001/login", {
				method: "POST",
				headers: {
				"Content-Type": "application/json",
				},
				body: JSON.stringify(formJson)
			});

			const data = await res.json();

			if (!res.ok) {
				setErrorMsg(data.error || "Login failed");
				return;
			}
			setUsername(formJson["username"]);

			try {
				const ingredients = await fetch(`http://localhost:3001/user-ingredients/${formJson["username"]}`, {
					method: "GET",
				});
				
				if (ingredients.ok) {
					const ingredient_data = await ingredients.json();
					setPantryItems(Object.keys(ingredient_data)[0]);
				}
			} catch (err) {
				console.error(err)
				console.log("Could not get ingredients.")
			}

			//navigate(`/user/${formJson.username}`);
			navigate("/profile");
			
		} catch (err) {
			console.error(err);
			setErrorMsg("Could not log in");
		}
	}
	return (
		<div className="login-page-container">
			<div className="login-form-box">
			<h1 className="login-title">Welcome Back!</h1>
			<p className="login-subtitle">Enter your credentials:</p>

			<p style={{color: "red"}}>{errorMsg}</p>
			<form className="login-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label style={{paddingBottom: "1px"}}>
						Username <br />
					</label>
					<input 
						className="form-input" 
						type="text" 
						name="username"
						placeholder="Enter your username" 
						value={email} 
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				
				<div className="form-group">
					<label style={{paddingBottom: "1px"}}>
					Password <br />
					</label>
					<input 
						className="form-input" 
						name="password"
						type="password" 
						placeholder="Enter your password" 
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						/>
				</div>

				<button type="submit" className="btn-primary">Login</button>
			</form>
			<p className="signup-prompt">
				Don't have an account?&nbsp;
				<Link to="/signup">Sign Up</Link>
			</p>
			</div>
		</div>
	)
}