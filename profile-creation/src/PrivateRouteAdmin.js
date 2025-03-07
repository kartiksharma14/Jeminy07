import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function PrivateRouteAdmin({ children }) {
  const token = localStorage.getItem("adminToken");

  console.log("Checking admin token in PrivateRouteAdmin:", token);

  if (!token) {
    console.log("Redirecting to /admin/login: No Token Found");
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    console.log("Decoded Admin Token:", decodedToken);

    // Check if adminId exists in token payload
    if (!decodedToken || !decodedToken.id) {
      console.log("Invalid token: Redirecting to /admin/login");
      return <Navigate to="/admin/login" replace />;
    }

    // Token is valid; allow access
    return children;
  } catch (error) {
    console.log("Error decoding token:", error);
    return <Navigate to="/admin/login" replace />;
  }
}

export default PrivateRouteAdmin;
