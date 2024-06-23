import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

// stilovi
import "../styles/Cards.css";

export default function CardsHP() {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch("http://localhost:5278/api/Destination/GetPopularDestinations") // link za dohvacanje destinacija
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((destination) => ({
          id: destination.destinationId,
          location: destination.destinationLocation,
          name: destination.destinationName,
          image: destination.destinationImage,
          details: destination.destinationDetails,
        }));
        setDestinations(formattedData.slice(0, 5));
      })
      .catch((error) =>
        console.error("Error fetching destination data:", error)
      );
  }, []);
  const handleDetailsClick = (id) => {
    navigate(`/packageDetails/${id}`);
  };
  const handleAddToFavorites = (destination) => {
    fetch("http://localhost:5278/api/Favorite/PostFavorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageId: destination.packageId,
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

  return (
    <div className="cards-container">
      {destinations.map((destination) => (
        <Card key={destination.id} sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt={destination.name}
            height="140"
            image={`http://localhost:5278/api/Destination/GetImage/${destination.image}`}
            sx={{ borderRadius: "16px 16px 0 0" }}
            onError={(e) => (e.target.src = "default-image.jpg")} // Fallback image
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {destination.name}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
              {destination.details}
            </Typography> */}
          </CardContent>
          <CardActions>
            <Button style={{ color: "#4F6F52" }} size="small">
              Share
            </Button>
            <Button
              style={{ color: "#4F6F52" }}
              size="small"
              onClick={handleDetailsClick}
            >
              Learn More
            </Button>
            <IconButton
              aria-label="add to favorites"
              style={{ color: "#E8DFCA" }}
              onClick={() => handleAddToFavorites(destination)}
            >
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
