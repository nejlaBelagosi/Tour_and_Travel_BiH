import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

import '../styles/ReviewCard.css';

export default function TourReviews() {
  const [tourReviews, setTourReviews] = useState([]);
  const [destinationNames, setDestinationNames] = useState({});

  useEffect(() => {
    // Fetch tour reviews
    fetch('http://localhost:5278/api/Review/GetReview')
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(review => ({
          id: review.reviewId,
          user: review.user,
          comment: review.reviewComment,
          postDate: review.postDate,
          tourPackageId: review.tourPackageId,
          rating: review.rating,
          userId: review.userId // Dodali smo userId
        }));
        setTourReviews(formattedData);
      })
      .catch(error => console.error('Error fetching review data:', error));

    // Fetch destination names
    fetch('http://localhost:5278/api/TourPackage/GetPackage')
      .then(response => response.json())
      .then(data => {
        const destinationNames = {};
        data.forEach(tourPackage => {
          destinationNames[tourPackage.id] = tourPackage.destinationName;
        });
        setDestinationNames(destinationNames);
      })
      .catch(error => console.error('Error fetching destination names:', error));
  }, []);

  return (
    <div>
    <div className="cards-container">
      {tourReviews.map(review => (
        <Card  key={review.id} sx={{ maxWidth: 345 }} style={{backgroundColor:"#E8DFCA"}} >
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
               {review.user}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comment: {review.comment}
            </Typography>
            <div>
              {/* Prikaži rating kao zvjezdice */}
              {Array.from({ length: review.rating }, (_, index) => (
                <StarOutlinedIcon key={index} className='ratings'/>
              ))}
            </div>
            <Typography variant="body2" color="text.secondary">
              Posted on: {review.postDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Destination: {destinationNames[review.tourPackageId] || 'Unknown'}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
    </div>
  );
}
