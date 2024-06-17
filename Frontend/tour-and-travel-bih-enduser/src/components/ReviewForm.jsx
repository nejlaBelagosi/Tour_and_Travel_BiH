import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';

export default function ReviewForm({ reservationId, onReviewSubmitted }) {
  const [review, setReview] = useState({
    userId: '',
    reservationId: reservationId,
    rating:  0.0,
    reviewComment: '',
    postDate: '',
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setReview(prevState => ({
        ...prevState,
        userId: storedUser.userId,
        postDate: new Date().toISOString().split('T')[0] // Trenutni datum
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting review:", review); // Dodaj ovaj red da vidimo podatke koji se šalju

    fetch('http://localhost:5278/api/Review/PostReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        onReviewSubmitted();
      })
      .catch(error => console.error('Error posting review:', error));
  };

  if (!user) {
    return <Typography variant="h6">You need to be logged in to submit a review.</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">Add a Review</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Rating"
            type="number"
            name="rating"
            value={review.rating}
            onChange={handleChange}
            inputProps={{ min: 1, max: 5, step: 0.1 }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Comment"
            name="reviewComment"
            value={review.reviewComment}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor:'#4F6F52' }}>
        Submit Review
      </Button>
    </Box>
  );
}
