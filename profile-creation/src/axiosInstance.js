import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Ensure default import for jwt-decode

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your base API URL
  timeout: 10000, // Set a timeout for requests
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    console.log("Token from localStorage:", token); // Log the token

    if (token) {
      // Check if the token has the proper JWT structure (3 parts)
      if (token.split(".").length === 3) {
        try {
          const { exp } = jwtDecode(token); // Decode the token and get the expiration time

          // Check if the token has expired
          if (Date.now() >= exp * 1000) {
            // Remove expired token and redirect to login
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");

            window.location.href = "/login"; // Redirect user to login page
            return Promise.reject(new Error("Token expired. Please log in again."));
          }

          // Attach the token to the Authorization header
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          // Catch errors during decoding and log them
          console.error("Error decoding token:", error);
          return Promise.reject(new Error("Invalid token format."));
        }
      } else {
        console.error("Invalid token format:", token);
        return Promise.reject(new Error("Invalid token format."));
      }
    }

    return config; // Return the config if the token is valid
  },
  (error) => {
    return Promise.reject(error); // Pass on any errors encountered
  }
);


export default axiosInstance;
