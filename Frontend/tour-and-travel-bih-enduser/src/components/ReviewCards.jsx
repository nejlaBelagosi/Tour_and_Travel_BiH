import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import '../styles/ReviewCard.css'

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
        <p style={{ font:'Montserrat', fontSize: '15px' }}>{review}</p> <br></br>
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
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <ReviewCard name="John Doe" review="Ovo je review..." rating={4} />
      </Grid>
      <Grid item>
        <ReviewCard name="Jane Smith" review="Ovo je review..." rating={5} isLarger />
      </Grid>
      <Grid item>
        <ReviewCard name="Bob Johnson" review="Ovo je review..." rating={3} />
      </Grid>
    </Grid>
  );
};

export default Reviews;
