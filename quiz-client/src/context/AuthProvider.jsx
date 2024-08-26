import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { logoutUser } from '../service/AuthService'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const login = (token) => {
    const decodedToken = jwtDecode(token); // Decode the token to get user info
    const userData = {
      email: decodedToken.sub,
      roles: decodedToken.roles,
      name: decodedToken.name
    };

    setUser(userData);
    setToken(token);  // Store the token in the state or localStorage
    localStorage.setItem('token', token); // Optional: Store token in localStorage
    navigate('/'); // Redirect to home or dashboard after login
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutUser();
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); 
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
