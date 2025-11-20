import { Link } from 'react-router-dom';

export default function Login() {
	return (
		<>
			<h1>Welcome Back!</h1>
			<p>Enter your credentials:</p>

			<div>
				<label>
					Email address <br />
					<input type="email" placeholder="Enter your email"></input>
				</label>
			</div>
			
			<div>
				<label>
				Password <br />
				<input type="password" placeholder="Enter your password"></input>
				</label>
			</div>

			<button>Login</button>

			<p>
				Don't have an account?&nbsp;
				<Link to="/signup">Sign Up</Link>
			</p>
		</>
	)
}