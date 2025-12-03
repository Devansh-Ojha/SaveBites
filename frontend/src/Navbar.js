import { Link } from "react-router-dom";
import "./Navbar.css";
import "./buttons.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-structure">

        <div className="navbar-links-left">
          <Link to="/" className="navbar-link"> 
              Home 
          </Link>
          <Link to="/generate" className="navbar-link">
            Generate Recipes
          </Link>
          <Link to="/upload" className="navbar-link">
            Upload Receipts
          </Link>
        </div>

        <div className="navbar-links-right">
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
          <Link to="/login" className="navbar-link">
            Login
          </Link>
          <Link to="/signup" className="navbar-link navbar-link--primary">
            Signup
          </Link>
        </div>

      </div>
    </nav>
  );
}