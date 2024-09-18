
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, allowedRoles }) => {

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); 
  const token = localStorage.getItem('access_token'); 

  const getRole = useCallback(async () => {
    if (token) {
      try {
        const response = await fetch('http://212.67.13.70:8000/api/auth/user-role/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          return data.role;
        } else {
          console.error('Failed to fetch role:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    }
    return null; 
  }, [token]); 
  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getRole(); 
      setRole(userRole); 
      setLoading(false); 
    };

    fetchRole(); 
  }, [getRole]);  

  if (loading) {
    return <div></div>; 
  }

  return allowedRoles.includes(role) ? <Element /> : <Navigate to="/" />;
};

export default ProtectedRoute;
