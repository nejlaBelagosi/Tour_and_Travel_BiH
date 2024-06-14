import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import '../styles/Cards.css';

export default function FavoriteCards() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5278/api/Favorite/GetFavorite')
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(favorite => ({
          id: favorite.favoriteItemId,
          location: favorite.destinationLocation,
          name: favorite.destinationName,
          image: favorite.destinationImage,
          details: favorite.destinationDetails,
        }));
        setFavorites(formattedData);
      })
      .catch(error => console.error('Error fetching favorite data:', error));
  }, []);

  const handleRemoveFavorite = (id) => {
    fetch(`http://localhost:5278/api/Favorite/DeleteFavorite/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setFavorites(prevFavorites => prevFavorites.filter(favorite => favorite.id !== id));
        } else {
          console.error('Failed to delete favorite');
        }
      })
      .catch(error => console.error('Error deleting favorite:', error));
  };

  return (
    <div className="cards-container" style={{marginTop:'20px'}}>
      {favorites.map(favorite => (
        <Card key={favorite.id} sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt={favorite.name}
            height="140"
            image={`http://localhost:5278/api/Destination/GetImage/${favorite.image}`}
            sx={{ borderRadius: '16px 16px 0 0' }}
            onError={(e) => e.target.src = 'default-image.jpg'} // Fallback image
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {favorite.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {favorite.details}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {favorite.location}
            </Typography>
          </CardContent>
          <CardActions>
            <Button style={{color:'#4F6F52'}} size="small">Share</Button>
            <Button style={{color:'#4F6F52'}} size="small">Learn More</Button>
            <IconButton aria-label="remove from favorites" style={{color:'#E8DFCA'}} onClick={() => handleRemoveFavorite(favorite.id)}>
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
