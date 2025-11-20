export default function Signup() {
	return (
		<>
			<h1>Get Started Now</h1>

			<div>
				<label>
					Name <br />
					<input placeholder="Name"></input>
				</label>
			</div>

			<div>
				<label>
					Email address <br />
					<input type="email" placeholder="Enter your email"></input>
				</label>
			</div>

			<div>
				<label>
					Password <br />
					<input type="password" placeholder="Enter a password"></input>
				</label>
			</div>

			<div>
				<label>
					Confirm Password <br />
					<input type="password" placeholder="Confirm your password"></input>
				</label>
			</div>

			<button>Sign Up</button>
		</>
	)
}