import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const location = useLocation();
  const excludeNavbarRoutes = ['/login', '*'];

  return (
    <>
      {!excludeNavbarRoutes.includes(location.pathname) && <Sidebar />}
      <Outlet />
    </>
  );
};


