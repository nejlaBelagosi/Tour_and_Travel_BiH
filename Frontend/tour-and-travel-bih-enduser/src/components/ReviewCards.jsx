import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, IconButton } from '@mui/material';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../styles/ReviewCard.css';

const ReviewCard = ({ name, review, rating, isLarger }) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<StarOutlinedIcon key={i} />);
  }

  return (
    <Card className={`review-card ${isLarger ? 'larger' : ''}`}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <p style={{ fontFamily: 'Montserrat', fontSize: '15px' }}>{review}</p>
        <br />
        <Box className="ratings" display="flex" alignItems="center">
          <p>
            <span className="stars">{stars}</span>
          </p>
        </Box>
      </CardContent>
    </Card>
  );
};

const Reviews = () => {
  const reviews = [
    { name: "John Doe", review: "Ovo je review...", rating: 4 },
    { name: "Jane Smith", review: "Ovo je review...", rating: 5, isLarger: true },
    { name: "Bob Johnson", review: "Ovo je review...", rating: 3 }
  ];

  const [startIndex, setStartIndex] = useState(0);

  const handlePrevious = () => {
    setStartIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1));
  };

  const getVisibleReviews = () => {
    return [
      reviews[startIndex],
      reviews[(startIndex + 1) % reviews.length],
      reviews[(startIndex + 2) % reviews.length]
    ];
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>
        <IconButton onClick={handlePrevious}>
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      {getVisibleReviews().map((review, index) => (
        <Grid item key={index}>
          <ReviewCard
            name={review.name}
            review={review.review}
            rating={review.rating}
            isLarger={review.isLarger}
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
};

export default Reviews;
