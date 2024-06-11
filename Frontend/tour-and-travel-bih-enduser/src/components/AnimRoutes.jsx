import React from "react";

//import pages
import Homepage from "../pages/Homepage";
import SignInSide from "../pages/Login";
import SignUp from "../pages/Registration";

// import User from "../pages/User";
// import Destination from "../pages/Destination";
// import Accounts from "../pages/Accounts";
// import Payment from "../pages/Payment";
import Reservation from "../components/ReservationForm";
import TourPackages from "../pages/TourPackages";

//import routes route & useLocation
import {Routes, Route, useLocation} from 'react-router-dom';


const AnimRoutes = () => {
    const location = useLocation();
return (
   
        <Routes key={location.pathname} location={location} >
            <Route path="/" element ={<Homepage />} />
            <Route path="/Login" element = {<SignInSide />} />
            <Route path="/Registration" element = {<SignUp />} />
            <Route path='/package/:id' element = {<TourPackages />}/>
            <Route path='reservation/:id' element = {<Reservation />} />
        </Routes>


)
};

export default AnimRoutes;