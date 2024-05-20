import React from "react";

//import pages
import Home from "../pages/Home";
import User from "../pages/User";
import Destination from "../pages/Destination";
import Accounts from "../pages/Accounts";
import Payment from "../pages/Payment";
import Reservations from "../pages/Reservations";
import TourPackage from "../pages/TourPackage";

//import routes route & useLocation
import {Routes, Route, useLocation} from 'react-router-dom';


const AnimRoutes = () => {
    const location = useLocation();
return (
   
        <Routes key={location.pathname} location={location} >
            <Route path="/" element ={<Home />} />
            <Route path="/User" element ={<User />} />
            <Route path="/Destination" element ={<Destination />} />
            <Route path="/Accounts" element ={<Accounts />} />
            <Route path="/Payment" element ={<Payment />} />
            <Route path="/Reservations" element ={<Reservations />} />
            <Route path="/TourPackage" element ={<TourPackage />} />
            
        </Routes>


)
};

export default AnimRoutes;