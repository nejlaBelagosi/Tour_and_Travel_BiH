import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";

// styles
import "../styles/Cards.css";

export default function ImgMediaCard() {
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User is not logged in.");
      return;
    }
    fetch(
      `http://localhost:5278/api/TourPackage/GetRecommendations/recommend/${userId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedData = data.map((pkg) => ({
          id: pkg.PackageId,
          description: pkg.PackageDescription,
          price: pkg.price,
          destinationName: pkg.destinationName,
          image: pkg.destinationImage,
        }));
        // Limit to 2 items
        setPackages(formattedData.slice(0, 2));
      })
      .catch((error) => {
        console.error("Error fetching recommended packages:", error);
        setError(error.message);
      });
  }, []);

  const handleAddToFavorites = (tourPackage) => {
    fetch("http://localhost:5278/api/Favorite/PostFavorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageId: tourPackage.id,
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cards-container">
      {packages.map((pkg) => (
        <Card key={pkg.id} sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt={pkg.name}
            height="140"
            image={`http://localhost:5278/api/Destination/GetImage/${pkg.image}`}
            sx={{ borderRadius: "16px 16px 0 0" }}
            onError={(e) => (e.target.src = "default-image.jpg")} // Fallback image
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {pkg.destinationName}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
              {pkg.description}
            </Typography> */}
            <Typography variant="body2" color="text.secondary">
              Price: $ {pkg.price}
            </Typography>
          </CardContent>
          <CardActions>
            <Button style={{ color: "#4F6F52" }} size="small">
              Share
            </Button>
            <Button style={{ color: "#4F6F52" }} size="small">
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
      ))}
    </div>
  );
}
