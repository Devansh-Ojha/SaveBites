import { Link } from 'react-router-dom';
import "./Login.css";
import "./buttons.css";

export default function Login() {
	return (
		<div className="login-page-container">
			<div className="login-form-box">
			<h1 className="login-title">Welcome Back!</h1>
			<p className="login-subtitle">Enter your credentials:</p>

			<form className="login-form">
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
					<input className="form-input" type="password" placeholder="Enter your password"></input>
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