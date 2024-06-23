import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Searchbar.css";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const SearchBar = () => {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (destination) {
      queryParams.append("destinationName", destination);
    }
    if (date) {
      queryParams.append("date", date);
    }
    navigate(`/search-results?${queryParams.toString()}`);
  };

  return (
    <div className="searchbar-container">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="  Where to?"
          className="search-input"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <span className="icon">
          <FmdGoodIcon style={{ color: "#4F6F52" }} />
        </span>
      </div>
      <div className="input-wrapper">
        <input
          type="date"
          placeholder="  When?"
          className="search-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <span className="icon">
          <CalendarMonthIcon style={{ color: "#4F6F52" }} />
        </span>
      </div>
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
