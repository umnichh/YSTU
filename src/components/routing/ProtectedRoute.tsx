
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ElementType;
  allowedRoles: string[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Element, allowedRoles }) => {
  const role = localStorage.getItem('role');
  return role && allowedRoles.includes(role.toString()) ? <Element /> : <Navigate to="/" />;
};

export default ProtectedRoute;