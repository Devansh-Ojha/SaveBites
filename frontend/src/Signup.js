import "./Signup.css";
import "./buttons.css";
import { Link } from "react-router-dom";

export default function Signup() {
	return (
		<div className="signup-page-container">
			<div className="signup-form-box">
				<h1 className="signup-title">Get Started Now</h1>
				<form className="signup-form">
					<div className="form-group">
						<label>
							Name <br />
							<input className="form-input" placeholder="Name"></input>
						</label>
					</div>

					<div className="form-group">
						<label>
							Email address <br />
							<input className="form-input" type="email" placeholder="Enter your email"></input>
						</label>
					</div>

					<div className="form-group">
						<label>
							Password <br />
							<input className="form-input" type="password" placeholder="Enter a password"></input>
						</label>
					</div>

					<div className="form-group">
						<label>
							Confirm Password <br />
							<input className="form-input" type="password" placeholder="Confirm your password"></input>
						</label>
					</div>

					<button type="submit" className="btn-primary">Sign Up</button>
					
				</form>
				<p className="login-prompt">
					Already have an account?&nbsp;
					<Link to="/login">Log In</Link>
				</p>
			</div>
		</div>
	)
}