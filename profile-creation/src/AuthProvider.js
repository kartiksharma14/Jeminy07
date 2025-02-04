import React, { createContext, useContext, useState } from "react";

// Create Auth Context
const AuthContext = createContext();

// AuthProvider Component
export function AuthProvider({ children }) {
  console.log(children);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true); // Mock login
  const logout = () => setIsAuthenticated(false); // Mock logout
  console.log(isAuthenticated);
  return (
    <>
  { }
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
    </>
  );
}

// Custom Hook to Access Auth
export function useAuth() {
  return useContext(AuthContext);
}
