import "./Signup.css";
import "./buttons.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router';
import { useState } from "react";

import { createUser } from "./api.js";


export default function Signup() {
	const navigate = useNavigate()
    // Define state variables for form data and errors
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // To prevent double submissions

	const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        // Clear errors for the field as user types
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: null,
        }));
    };

	// Form submission logic
    async function handleSubmit(e) {
        e.preventDefault(); // Prevents the default browser page reload
        setIsSubmitting(true);
        
		const dataToSubmit = {
    		name: formData.name, // Trim whitespace
    		username: formData.username,
  			password: formData.password,
  		  	// Note: confirmPassword is purposefully left out
		};
		let confirmPassword = formData.confirmPassword;
        let password = formData.password;
        if (confirmPassword == password) {
            const jsonBody = JSON.stringify(dataToSubmit);
            console.log(formData);
            // If there are no errors, proceed with sign-up logic
            const response = await createUser(dataToSubmit);

            navigate("/login");
            console.log("Form data submitted:", formData);
        }
        else {
            setPasswordError("PLEASE ENTER THE SAME PASSWORD 🦧🦧🦧");
        }
    };

	return (
		<div className="signup-page-container">
			<div className="signup-form-box">
				<h1 className="signup-title">Get Started Now</h1>
				<form className="signup-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label style={{paddingBottom: "1px"}}>
							Name <br />
						</label>
						<input 
                            className="form-input" 
                            id="name"
                            name="name" // Used by the handleChange function
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
					</div>

					<div className="form-group">
						<label style={{paddingBottom: "1px"}}>
							Username <br />
						</label>
						<input 
                            className="form-input" 
                            id="username"
                            name="username" // Used by the handleChange function
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
					</div>

					<div className="form-group">
						<label style={{paddingBottom: "1px"}}>
							Password <br />
						</label>
						<input 
                            className="form-input" 
                            id="password"
                            type="password" 
                            name="password"
                            placeholder="Enter a password"
                            value={formData.password}
                            onChange={handleChange}
                        />
					</div>

					<div className="form-group">
						<label style={{paddingBottom: "1px"}}>
							Confirm Password <br />
						</label>
						<input 
                            className="form-input" 
                            id="confirmPassword"
                            type="password" 
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <p style={{color: "red"}}>{passwordError}</p>
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