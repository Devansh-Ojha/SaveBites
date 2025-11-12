import { Link } from "react-router-dom";
import "./Navbar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-structure">
        <div className="navbar-links">
          <Link to="/" className="navbar-link"> 
              Home 
          </Link>
          <Link to="/generate" className="navbar-link">
            Generate Recipes
          </Link>
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
          <Link to="/login" className="navbar-link">
            Log In
          </Link>
          <Link to="/signup" className="navbar-link navbar-link--primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}