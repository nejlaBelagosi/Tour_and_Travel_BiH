import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SignInSide from './pages/LoginPage';
import SignUp from './pages/Registration';
import Home from './pages/Home';

const AnimRoutes = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={user ? <Home /> : <SignInSide />} />
      <Route path="/Login" element={<SignInSide />} />
      <Route path="/Registration" element={<SignUp />} />
      <Route path="/Home" element={<Home />} />
    </Routes>
  );
};

export default AnimRoutes;
