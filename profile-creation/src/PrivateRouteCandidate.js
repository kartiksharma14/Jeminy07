import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function PrivateRouteCandidate({ children }) {
  const token = localStorage.getItem("authToken");

  console.log("Checking auth token in PrivateRoute:", token);

  if (!token) {
    console.log("Redirecting to /candidate/login: No Token Found");
    return <Navigate to="/candidate/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken);

    // ✅ Check if userId exists in token payload
    if (!decodedToken || !decodedToken.userId) {
      console.log("Invalid token: Redirecting to /candidate/login");
      return <Navigate to="/candidate/login" replace />;
    }

    // ✅ Token is valid; allow access
    return children;
  } catch (error) {
    console.log("Error decoding token:", error);
    return <Navigate to="/candidate/login" replace />;
  }
}

export default PrivateRouteCandidate;
