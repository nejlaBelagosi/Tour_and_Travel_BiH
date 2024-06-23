// import React, { useState } from "react";
// import "../styles/SearchBar.css";
// import FmdGoodIcon from "@mui/icons-material/FmdGood";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// const SearchBar = ({ onSearch }) => {
//   const [destination, setDestination] = useState("");
//   const [date, setDate] = useState("");

//   const handleSearch = () => {
//     onSearch(destination, date);
//   };

//   return (
//     <div className="searchbar-container">
//       <div className="input-wrapper">
//         <input
//           type="text"
//           placeholder="  Where to?"
//           className="search-input"
//           value={destination}
//           onChange={(e) => setDestination(e.target.value)}
//         />
//         <span className="icon">
//           <FmdGoodIcon style={{ color: "#4F6F52" }} />
//         </span>
//       </div>
//       <div className="input-wrapper">
//         <input
//           type="date"
//           placeholder="  When?"
//           className="search-input"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//         <span className="icon">
//           <CalendarMonthIcon style={{ color: "#4F6F52" }} />
//         </span>
//       </div>
//       <button className="search-button" onClick={handleSearch}>
//         Search
//       </button>
//     </div>
//   );
// };

// export default SearchBar;
