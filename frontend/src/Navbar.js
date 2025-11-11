import { Link } from "react-router-dom"

export default function NavBar() {
	return (
		<>
			<nav className ="navbar" style={{position : 'sticky', top : 0, justifyContent: "space-between"}}>
				<div style={{backgroundColor: "rgba(50, 200, 50, 0.5)", height: "50px"}}>
					<span style={{float: "left", margin:"10px"}}>
						<Link to="/">SaveBites</Link>
					</span>
					<span style={{float: "right", margin: "10px"}}>
						<Link to="/signup">Sign Up</Link>
					</span>
					<span style={{float: "right", margin: "10px"}}>
						<Link to="/login">Log In</Link>
					</span>
					<span style={{float: "right", margin: "10px"}}>
						<Link to="/profile">Profile</Link>
					</span>
				</div>
			</nav>
		</>
	)
}