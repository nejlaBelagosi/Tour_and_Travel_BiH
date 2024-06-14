import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInSide from './pages/LoginPage';
import Home from './pages/Home';
import User from './pages/User';
import Destination from './pages/Destination';
import Reservations from './pages/Reservations';
import TourPackages from './pages/TourPackages';
import Payment from './pages/Payment';
import Account from './pages/Accounts';
import Reviews from './pages/Reviews';
import Header from './components/Header';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const RedirectIfLoggedIn = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/Home" /> : children;
};

const Layout = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <RedirectIfLoggedIn>
            <SignInSide />
          </RedirectIfLoggedIn>
        } />
        <Route path="/Home" element={
          <PrivateRoute>
            <Layout>
              <Home />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/User" element={
          <PrivateRoute>
            <Layout>
              <User />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/Destination" element={
          <PrivateRoute>
            <Layout>
              <Destination />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/Reservations" element={
          <PrivateRoute>
            <Layout>
              <Reservations />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/TourPackages" element={
          <PrivateRoute>
            <Layout>
              <TourPackages />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/Payment" element={
          <PrivateRoute>
            <Layout>
              <Payment />
            </Layout>
          </PrivateRoute>
        } />
         <Route path="/Reviews" element={
          <PrivateRoute>
            <Layout>
              <Reviews />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/Account" element={
          <PrivateRoute>
            <Layout>
              <Account />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
