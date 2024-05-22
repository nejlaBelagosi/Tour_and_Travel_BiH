// Homepage.js
import React from 'react';
import '../styles/Homepage.css';
import SearchBar from '../components/SearchBar';
import ImgMediaCard from '../components/Cards';
import { Button } from '@mui/material';


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
        <h1>Todays recommendations</h1>
       <ImgMediaCard />
        
      </div>
      <div className="additional-content">
        <p>All destinations</p>
        {/* polje za kartice */}
        <Button>See More</Button>
      </div>

<div class="container">
      <div className="grid-container">
        <div className="image">
          <img src="../src/img/route.png" alt="route" />
        </div>
        <div className="text">
          <h1>How to do it?</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime qui fuga in esse nihil optio <br></br>quaerat sint a. Sunt perspiciatis iste incidunt error.<br></br> Magnam repellat perferendis saepe rerum dolor laudantium.</p>
          <Button className="button">See more</Button>
        </div>
      </div>
   </div>

    </div>
  );
};

export default Homepage;
