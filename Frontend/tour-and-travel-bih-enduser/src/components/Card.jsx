import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

const PackageCard = ({ pkg, handleAddToFavorites }) => {
  const navigate = useNavigate();

  const handleDetailsClick = (id) => {
    navigate(`/packageDetails/${id}`);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
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
          {pkg.name}
        </Typography>
        {pkg.price && (
          <Typography variant="body2" color="text.secondary">
            Price: ${pkg.price}
          </Typography>
        )}
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
  );
};

export default PackageCard;
