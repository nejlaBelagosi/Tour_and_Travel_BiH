import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  CardActions,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "../styles/Cards.css";

const TourCards = ({ limit, packages: searchResults, singleRow = false }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setPackages(searchResults);
      setLoading(false); // Stop loading if search results are provided
    } else {
      fetch("http://localhost:5278/api/TourPackage/GetPackage")
        .then((response) => response.json())
        .then((data) => {
          const uniquePackages = Array.from(
            new Map(data.map((p) => [p.destinationName, p])).values()
          );
          setPackages(uniquePackages.slice(0, limit));
          setLoading(false); // Stop loading after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching packages:", error);
          setLoading(false); // Stop loading in case of error
        });
    }
  }, [limit, searchResults]);

  const handleDetailsClick = (id) => {
    navigate(`/packageDetails/${id}`);
  };

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
          <Card sx={{ maxWidth: 345, margin: singleRow ? " " : "auto" }}>
            <CardMedia
              component="img"
              height="140"
              image={`http://localhost:5278/api/Destination/GetImage/${pkg.destinationImage}`}
              alt={pkg.destinationName}
              sx={{ borderRadius: "16px 16px 0 0" }}
              onError={(e) => (e.target.src = "default-image.jpg")}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {pkg.destinationName}
              </Typography>
              <Typography variant="h6">${pkg.price}</Typography>
            </CardContent>
            <CardActions>
              <Button style={{ color: "#4F6F52" }} size="small">
                Share
              </Button>
              <Button
                style={{ color: "#4F6F52" }}
                size="small"
                onClick={() => handleDetailsClick(pkg.packageId)}
              >
                Learn More
              </Button>
              <IconButton
                aria-label="add to favorites"
                style={{ color: "#E8DFCA" }}
                onClick={() => handleAddToFavorites(pkg)}
              >
                <FavoriteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TourCards;
