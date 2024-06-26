import React, { useEffect, useState } from "react";
import { Grid, CircularProgress, Box } from "@mui/material";
import PackageCard from "../components/Card";
import "../styles/Cards.css";

const PopularCards = ({ limit, singleRow = false }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5278/api/TourPackage/GetPopularPackages")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((destination) => ({
          packageId: destination.packageId,
          name: destination.destinationName,
          image: destination.destinationImage,
          price: destination.price,
        }));
        setDestinations(formattedData.slice(0, limit));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching popular packages:", error);
        setLoading(false);
      });
  }, [limit]);

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
        setDestinations((prevDestinations) =>
          prevDestinations.map((p) =>
            p.packageId === pkg.packageId ? { ...p, isFavorite: true } : p
          )
        );
      })
      .catch((error) => console.error("Error adding to favorites:", error));
  };

  // const handleRemoveFromFavorites = (pkg) => {
  //   fetch(
  //     `http://localhost:5278/api/Favorite/DeleteFavorite/${pkg.packageId}`,
  //     {
  //       method: "DELETE",
  //     }
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to remove from favorites");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Removed from favorites:", data);
  //       setDestinations((prevDestinations) =>
  //         prevDestinations.map((p) =>
  //           p.packageId === pkg.packageId ? { ...p, isFavorite: false } : p
  //         )
  //       );
  //     })
  //     .catch((error) => console.error("Error removing from favorites:", error));
  // };

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
      {destinations.map((destination) => (
        <Grid
          item
          key={destination.packageId}
          xs={12}
          sm={6}
          md={singleRow ? "auto" : 6}
        >
          <PackageCard
            pkg={destination}
            handleAddToFavorites={handleAddToFavorites}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PopularCards;
