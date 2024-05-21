// Homepage.js
import React from 'react';
import '../styles/Homepage.css';
import SearchBar from '../components/SearchBar';
import ImgMediaCard from '../components/Cards';

const Homepage = () => {
  return (
    <div className='parent-container'>
    <div className="welcome-container">
      <h1 className="welcome-text">Adventure begins here.</h1>
      <div className='searchbar'>
        <SearchBar />
      </div>
    </div>
      <div className="additional-content">
        <h1>Our Destinations</h1>
       <ImgMediaCard />
        <p>This is additional content below the welcome container.</p>
      </div>
      <div className="additional-content">
        <p>This is additional content below the welcome container.</p>
        <p>This is additional content below the welcome container.</p>
      </div>
   
    </div>
  );
};

export default Homepage;
