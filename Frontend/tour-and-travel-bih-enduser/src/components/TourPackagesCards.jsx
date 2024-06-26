import React, { useEffect, useState } from "react";
import { Grid, CircularProgress, Box } from "@mui/material";
import PackageCard from "../components/Card";
import "../styles/Cards.css";

const TourCards = ({ limit, packages: searchResults, singleRow = false }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setPackages(searchResults);
      setLoading(false);
    } else {
      fetch("http://localhost:5278/api/TourPackage/GetPackage")
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((destination) => ({
            packageId: destination.packageId,
            name: destination.destinationName,
            image: destination.destinationImage,
            price: destination.price,
          }));
          setPackages(formattedData.slice(0, limit));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching packages:", error);
          setLoading(false);
        });
    }
  }, [limit, searchResults]);

  const handleAddToFavorites = (pkg) => {
    fetch("http://localhost:5278/api/Favorite/PostFavorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageId: pkg.packageId,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add to favorites");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Added to favorites:", data);
      })
      .catch((error) => console.error("Error adding to favorites:", error));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#1A4D2E" }} />
      </Box>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      className={singleRow ? "single-row" : ""}
      sx={{
        justifyContent: "center",
        marginLeft: singleRow ? "0" : "0",
      }}
    >
      {packages.map((pkg) => (
        <Grid
          item
          key={pkg.packageId}
          xs={12}
          sm={6}
          md={singleRow ? "auto" : 6}
        >
          <PackageCard pkg={pkg} handleAddToFavorites={handleAddToFavorites} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TourCards;
