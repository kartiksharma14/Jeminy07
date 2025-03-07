import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

function PrivateRouteRecruiter({ children }) {
  const token = localStorage.getItem("authToken");

  console.log("Checking auth token in PrivateRouteRecruiter:", token);

  if (!token) {
    console.log("Redirecting to /recruiter/login: No Token Found");
    return <Navigate to="/recruiter/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token); // ✅ Decode JWT
    console.log("Decoded Token:", decodedToken);

    // ✅ Check if recruiter_id exists in token payload
    if (!decodedToken || !decodedToken.email) {
      console.log("Invalid token: Redirecting to /recruiter/login");
      return <Navigate to="/recruiter/login" replace />;
    }

    // ✅ Token is valid; allow access
    return children;
  } catch (error) {
    console.log("Error decoding token:", error);
    return <Navigate to="/recruiter/login" replace />;
  }
}

export default PrivateRouteRecruiter;
