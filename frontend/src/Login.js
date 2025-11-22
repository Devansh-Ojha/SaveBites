import { Link } from 'react-router-dom';
import "./Login.css";

export default function Login() {
	return (
		<div className="login-page-container">
			<div className="login-form-box">
			<h1 className="login-title">Welcome Back!</h1>
			<p className="login-subtitle">Enter your credentials:</p>

			<form className="login-form">
				<div className="form-group">
					<label>
						Email address <br />
						<input className="form-input" type="email" placeholder="Enter your email"></input>
					</label>
				</div>
				
				<div className="form-group">
					<label>
					Password <br />
					<input className="form-input" type="password" placeholder="Enter your password"></input>
					</label>
				</div>

				<button type="submit" className="btn-login">Login</button>
			</form>

			<p className="signup-prompt">
				Don't have an account?&nbsp;
				<Link to="/signup">Sign Up</Link>
			</p>
			</div>
		</div>
	)
}