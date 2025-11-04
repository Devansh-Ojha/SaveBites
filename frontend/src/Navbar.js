import { Link } from "react-router-dom"

export default function NavBar() {
	return (
		<>
			<nav className ="navbar" style={{position : 'sticky', top : 0, justifyContent: "space-between"}}>
				<div style={{backgroundColor: "rgba(50, 200, 50, 0.5)"}}>
					<div style={{textAlign: "left"}}>
						<Link to="/">SaveBites</Link>
					</div>
					<div style={{textAlign: "right"}}>
						<Link to="/Login">Log In</Link>
					</div>
					<div style={{textAlign: "right"}}>
						<Link to="/Signup">Sign Up</Link>
					</div>
				</div>
			</nav>
		</>
	)
}