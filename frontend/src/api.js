// src/backend/api_call.js (The Frontend Client)

const API_BASE_URL = "http://localhost:3001"; // Matches the port in your server.js

// Helper function to handle response logic
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "API request failed");
    }
    return response.json();
};

// --- API FUNCTIONS ---

// 1. Get User Profile
export const getUserProfile = async (username) => {
    const response = await fetch(`${API_BASE_URL}/users/${username}`);
	console.log(response);
    return handleResponse(response);
};
// export const confirmUserPassword = async (username) => {
//     const response = await fetch(`${API_BASE_URL}/users/${username}/verify-password`);
// 	console.log(response);
//     return handleResponse(response);
// };

// 2. Create New User
export const createUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

// 3. Update User Ingredients
export const updateUserIngredients = async (username, ingredientsList) => {
    const response = await fetch(`${API_BASE_URL}/user-ingredients/${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingredientsList),
    });
    return handleResponse(response);
};

// 4. Get User Ingredients
export const getUserIngredients = async (username) => {
    const response = await fetch(`${API_BASE_URL}/user-ingredients/${username}`);
    return handleResponse(response);
};