import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

// stilovi
import '../styles/Cards.css';

  
export default function TourCards() {
  const [tourPackages, setTourPackages] = useState([]);
  React.useEffect(() => {
    fetch('http://localhost:5278/api/TourPackage/GetPackage') // link za dohvacanje destinacija
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((tourPackage) => ({
          id: tourPackage.tourPackageId,
          location: tourPackage.destinationLocation,
          name: tourPackage.destinationName,
          image: tourPackage.destinationImage,
          details: tourPackage.destinationDetails,
        //   startDate: tourPackage.startDate,
        //   endDate: tourPackage.endDate,
          price: tourPackage.price
        }));
        setTourPackages(formattedData);
      })
      .catch((error) => console.error('Error fetching destination data:', error));
  }, []);
  // useEffect(() => {
  //   fetch('http://localhost:5278/api/Destination/GetImage/${imageName}')
  //     .then(response => response.json())
  //     .then(data => {
  //       setDestinations(data);
  //     })
  //     .catch(error => console.error('Error fetching destination data:', error));
  // }, []);
 

  return (
    <div className="cards-container">
      {tourPackages.map(tourPackage => (
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
            <Typography variant="body2" color="text.secondary" style={{fontSize: '15px', paddingTop: '20px'}}>
             Price: $ {tourPackage.price}
            </Typography>
          </CardContent>
          <CardActions>
            <Button style={{color:'#4F6F52'}} size="small">Share</Button>
            <Button style={{color:'#4F6F52'}} size="small">Learn More</Button>
            <IconButton aria-label="add to favorites" style={{color:'#E8DFCA'}}>
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
