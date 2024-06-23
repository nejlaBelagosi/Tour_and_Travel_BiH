import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ResponsiveAppBar from "./components/Header";
import HeaderAfterLogin from "./components/HeaderAfterLogin";
import Homepage from "./pages/Homepage";
import SignInSide from "./pages/Login";
import SignUp from "./pages/Registration";
import TourPackagesDetails from "./pages/TourPackagesDetails";
import FavoriteCards from "./pages/FavoriteItems";
import Reservations from "./pages/Reservations";
import TourPackages from "./pages/TourPackages";
import SearchResults from "./pages/SearchResultPage";
// import ImgMediaCard from "./components/RecommendCards";
// import CardsHP from "./components/PopularCardsHP";
// import Cards from "./components/PopularRecommendedCards";
// import BestCards from "./components/BestForToday";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  //  const handleLogout = async () => {
  //     const tokenId = localStorage.getItem('tokenId');
  //     try {
  //         const response = await fetch(`http://localhost:5278/auth/logout/${tokenId}`, {
  //             method: 'DELETE',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //         });

  //         if (response.ok) {
  //             localStorage.removeItem('user');
  //             localStorage.removeItem('token');
  //             localStorage.removeItem('tokenId');
  //             localStorage.removeItem('userId');
  //             setUser(null);
  //             Navigate('/'); // Redirect to home after logout
  //         } else {
  //             console.error('Failed to logout');
  //         }
  //     } catch (error) {
  //         console.error('Failed to logout', error);
  //     }
  // };

  return (
    <Router>
      {user ? <HeaderAfterLogin /> : <ResponsiveAppBar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" /> : <SignInSide setUser={setUser} />
          }
        />
        <Route path="/registration" element={<SignUp />} />
        <Route path="/packageDetails/:id" element={<TourPackagesDetails />} />
        <Route path="/Reservations" element={<Reservations />} />
        <Route path="/Favorites" element={<FavoriteCards />} />
        <Route path="/Tour Package" element={<TourPackages />} />
        <Route path="/tourpackage" element={<TourPackages />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/search-results" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
