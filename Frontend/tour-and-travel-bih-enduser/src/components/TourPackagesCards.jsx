import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import '../styles/Cards.css';

export default function TourCards({ limit }) {
  const [tourPackages, setTourPackages] = useState([]);
  const navigate = useNavigate();
  const isUserLoggedIn = !!localStorage.getItem('user');

  useEffect(() => {
    fetch('http://localhost:5278/api/TourPackage/GetPackage')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((tourPackage) => ({
          id: tourPackage.packageId,
          location: tourPackage.destinationLocation,
          name: tourPackage.destinationName,
          image: tourPackage.destinationImage,
          details: tourPackage.destinationDetails,
          price: tourPackage.price
        }));
        setTourPackages(formattedData);
      })
      .catch((error) => console.error('Error fetching destination data:', error));
  }, []);

  const handleLearnMoreClick = (id) => {
    navigate(`/package/${id}`);
  };

  const handleAddToFavorites = (tourPackage) => {
    fetch('http://localhost:5278/api/Favorite/PostFavorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageId: tourPackage.id,
        userId: localStorage.getItem('userId'), // Assuming the user ID is stored in localStorage
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add to favorites');
        }
        return response.json();
      })
      .then(data => {
        console.log('Added to favorites:', data);
      })
      .catch(error => console.error('Error adding to favorites:', error));
  };

  // Use limit prop to slice the array if it exists
  const displayedPackages = limit ? tourPackages.slice(0, limit) : tourPackages;

  return (
    <div className="cards-container">
      {displayedPackages.map(tourPackage => (
        <Card key={tourPackage.id} sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt={tourPackage.name}
            height="140"
            image={`http://localhost:5278/api/Destination/GetImage/${tourPackage.image}`}
            sx={{ borderRadius: '16px 16px 0 0' }}
            onError={(e) => e.target.src = 'default-image.jpg'} // Fallback image
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {tourPackage.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tourPackage.details}
            </Typography>
            <Typography variant="body2" color="text.secondary" style={{ fontSize: '15px', paddingTop: '20px', fontWeight: 'bold' }}>
              Price: $ {tourPackage.price}
            </Typography>
          </CardContent>
          <CardActions>
            <Button style={{ color: '#4F6F52' }} size="small">Share</Button>
            <Button style={{ color: '#4F6F52' }} size="small" onClick={() => handleLearnMoreClick(tourPackage.id)}>Learn More</Button>
            <IconButton
              aria-label="add to favorites"
              style={{ color: '#E8DFCA' }}
              disabled={!isUserLoggedIn}
              onClick={() => handleAddToFavorites(tourPackage)}
            >
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
