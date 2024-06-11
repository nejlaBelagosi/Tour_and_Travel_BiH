// import React from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import Homepage from "../pages/Homepage";
// import SignInSide from "../pages/Login";
// import SignUp from "../pages/Registration";
// import TourPackages from "../pages/TourPackages";
// import Reservation from "../components/ReservationForm";

// const ProtectedRoute = ({ element }) => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user ? element : <Navigate to="/Login" />;
// };

// const AnimRoutes = () => {
//     const location = useLocation();

//     return (
//         <Routes key={location.pathname} location={location}>
//             <Route path="/" element={<Homepage />} />
//             <Route path="/Login" element={<SignInSide />} />
//             <Route path="/Registration" element={<SignUp />} />
//             <Route path="/package/:id" element={<ProtectedRoute element={<TourPackages />} />} />
//             <Route path="/reservation/:id" element={<ProtectedRoute element={<Reservation />} />} />
            
//         </Routes>
//     );
// };

// export default AnimRoutes;
