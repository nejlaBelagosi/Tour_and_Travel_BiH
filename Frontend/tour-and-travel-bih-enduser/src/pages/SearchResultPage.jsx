import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import TourCards from "../components/TourPackagesCards";
import SearchBar from "../components/SearchBar";

const SearchResults = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(location.search);
  const destinationName = query.get("destinationName") || "";
  const date = query.get("date") || "";

  useEffect(() => {
    setError(null);
    const url = new URL(
      `http://localhost:5278/api/TourPackage/SearchPackages/Search`
    );

    if (destinationName) {
      url.searchParams.append("destinationName", destinationName);
    }

    if (date) {
      url.searchParams.append("date", date);
    }

    fetch(url.toString())
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedData = data.map((destination) => ({
          packageId: destination.packageId,
          name: destination.destinationName,
          image: destination.destinationImage,
          price: destination.price,
        }));
        setSearchResults(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setError(error.message);
      });
  }, [destinationName, date]);

  return (
    <div className="results-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <SearchBar />
      </Box>
      {error ? (
        <div>Error: {error}</div>
      ) : searchResults.length > 0 ? (
        <TourCards packages={searchResults} />
      ) : (
        <div>No packages found matching the criteria.</div>
      )}
    </div>
  );
};

export default SearchResults;
