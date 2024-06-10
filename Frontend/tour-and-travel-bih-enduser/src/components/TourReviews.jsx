import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, IconButton } from '@mui/material';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../styles/ReviewCard.css';

const ReviewCard = ({ name, review, rating, destination, postDate, isLarger }) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<StarOutlinedIcon key={i} />);
  }

  return (
    <Card className={`review-card ${isLarger ? 'larger' : ''}`} style={{ position: 'relative' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <p style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '10px' }}>{review}</p>
        <Typography variant="body2" color="text.secondary">
          Destination: {destination}
        </Typography>
        <br />
        <Box className="ratings" display="flex" alignItems="center">
          <p>
            <span className="stars">{stars}</span>
          </p>
        </Box>
        <Typography className="review-post-date" variant="body2">
          {postDate}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function TourReviews() {
  const [tourReviews, setTourReviews] = useState([]);
  const [destinationNames, setDestinationNames] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
          userId: review.userId
        }));
        setTourReviews(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching review data:', error);
        setLoading(false);
      });

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

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? tourReviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === tourReviews.length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (tourReviews.length === 0) {
    return <div>No reviews available.</div>;
  }

  const getVisibleReviews = () => {
    return [
      tourReviews[currentIndex],
      tourReviews[(currentIndex + 1) % tourReviews.length],
      tourReviews[(currentIndex + 2) % tourReviews.length]
    ];
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>
        <IconButton onClick={handlePrev}>
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      {getVisibleReviews().map((review, index) => (
        <Grid item key={index}>
          <ReviewCard
            name={review.user}
            review={review.comment}
            rating={review.rating}
            destination={destinationNames[review.tourPackageId] || 'Unknown'}
            postDate={review.postDate}
            isLarger={index === 0}
          />
        </Grid>
      ))}
      <Grid item>
        <IconButton onClick={handleNext}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}