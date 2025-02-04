import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken");

  console.log("Checking auth token in PrivateRoute:", token);
  if (!token) {
    console.log("Redirecting to /candidate/login");
  }
  // ✅ If the token exists, allow access; otherwise, redirect to login
  return token ? children : <Navigate to="/candidate/login" replace />;
}

export default PrivateRoute;
