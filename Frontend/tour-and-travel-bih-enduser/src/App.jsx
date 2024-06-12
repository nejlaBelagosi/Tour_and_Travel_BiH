import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ResponsiveAppBar from './components/Header';
import HeaderAfterLogin from './components/HeaderAfterLogin';
import Homepage from './pages/Homepage';
import SignInSide from './pages/Login';
import SignUp from './pages/Registration';
import TourPackages from './pages/TourPackages';
import Reservation from './components/ReservationForm';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
            
        }
    }, []);

    const handleLogout = async () => {
        const tokenId = localStorage.getItem('tokenId');
        try {
            const response = await fetch(`http://localhost:5278/auth/logout/${tokenId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('tokenId');
                setUser(null);
                navigate('/'); // Redirect to home after logout
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    return (
        <Router>
            {user ? <HeaderAfterLogin onLogout={handleLogout} /> : <ResponsiveAppBar />}
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/" /> : <SignInSide setUser={setUser} />} 
                />
                <Route path="/registration" element={<SignUp />} />
                <Route 
                    path="/package/:id" 
                    element={<TourPackages />} 
                />
                <Route 
                    path="/reservation/:id" 
                    element={<Reservation />} 
                />
                <Route path="/home" element={<Homepage />} />
            </Routes>
        </Router>
    );
}

export default App;
