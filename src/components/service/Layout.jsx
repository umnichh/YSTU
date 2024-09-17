// Layout.js
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const excludeNavbarRoutes = ['/login', '*'];

  return (
    <>
      {!excludeNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Outlet />
    </>
  );
};

export default Layout;
