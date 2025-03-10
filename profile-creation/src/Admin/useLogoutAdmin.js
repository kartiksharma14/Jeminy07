// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear the stored admin token (and any other tokens as needed)
    localStorage.removeItem('adminToken');
    // Optionally, remove other related data:
    // localStorage.removeItem('userData');

    // Redirect to the login page
    navigate('/admin/login');
  };

  return logout;
};

export default useLogout;
