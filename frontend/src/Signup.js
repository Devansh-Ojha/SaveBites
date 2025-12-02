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
						<label style={{paddingBottom: "1px"}}>
							Name <br />
						</label>
						<input className="form-input" placeholder="Name"></input>
					</div>

					<div className="form-group">
						<label style={{paddingBottom: "1px"}}>
							Email address <br />
						</label>
						<input className="form-input" type="email" placeholder="Enter your email"></input>
					</div>

					<div className="form-group">
						<label style={{paddingBottom: "1px"}}>
							Password <br />
						</label>
						<input className="form-input" type="password" placeholder="Enter a password"></input>
					</div>

					<div className="form-group">
						<label style={{paddingBottom: "1px"}}>
							Confirm Password <br />
						</label>
						<input className="form-input" type="password" placeholder="Confirm your password"></input>
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