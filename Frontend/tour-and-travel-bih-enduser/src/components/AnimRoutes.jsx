import React from "react";

//import pages
import Homepage from "../pages/Homepage";
import SignInSide from "../pages/Login";

// import User from "../pages/User";
// import Destination from "../pages/Destination";
// import Accounts from "../pages/Accounts";
// import Payment from "../pages/Payment";
// import Reservations from "../pages/Reservations";
// import TourPackage from "../pages/TourPackage";

//import routes route & useLocation
import {Routes, Route, useLocation} from 'react-router-dom';


const AnimRoutes = () => {
    const location = useLocation();
return (
   
        <Routes key={location.pathname} location={location} >
            <Route path="/" element ={<Homepage />} />
            <Route path="/Login" element = {<SignInSide />} />
        
            
        </Routes>


)
};

export default AnimRoutes;