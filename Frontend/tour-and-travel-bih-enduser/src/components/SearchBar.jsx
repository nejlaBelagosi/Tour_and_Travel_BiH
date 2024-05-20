import React from 'react';
import '../styles/Searchbar.css';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const SearchBar = () => {
  return (
    <div className="searchbar-container">
      <div className="input-wrapper">
        <input type="text" placeholder="  Where to?" className="search-input" />
        <span className="icon"><FmdGoodIcon style={{ color: "#4F6F52" }}/></span>
      </div>
      <div className="input-wrapper">
        <input type="text" placeholder="  When?" className="search-input" />
        <span className="icon"><CalendarMonthIcon style={{ color: "#4F6F52" }}/></span>
      </div>
      <button className="search-button">Search</button>
    </div>
  );
};

export default SearchBar;

