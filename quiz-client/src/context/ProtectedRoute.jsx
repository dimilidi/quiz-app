import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { jwtDecode } from 'jwt-decode';  // Ensure this import is here

const ProtectedRoute = ({ element, requiredRole }) => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }

    const decodedToken = jwtDecode(token);
    const userRoles = decodedToken.roles || [];

    if (requiredRole && !userRoles.includes(`ROLE_${requiredRole}`)) {
        return <Navigate to="/login" />; // Redirect to unauthorized if the role doesn't match
    }

    return element;
};

export default ProtectedRoute;
