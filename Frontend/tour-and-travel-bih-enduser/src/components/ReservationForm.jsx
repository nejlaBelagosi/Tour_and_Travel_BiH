import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, FormControl, Box, Typography } from '@mui/material';

export default function ReservationForm({ packageId, destinationName, packagePrice }) {
  const [reservation, setReservation] = useState({
    userId: '',
    packageId: packageId,
    totalTravelers: 1,
    dateOfReservation: '',
    totalPrice: packagePrice,
    reservationStatus: 'Pending',
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Stored user:', storedUser); // Debug log
    if (storedUser) {
      setUser(storedUser);
      setReservation(prevState => ({
        ...prevState,
        userId: storedUser.userId, // Set userId from stored user information
      }));
    }
  }, []);

  const handleChange = (e) => {
    if (!user) {
      alert('You must be logged in to interact with this form. Please register or log in.');
      return;
    }

    const { name, value } = e.target;
    const numericValue = name === 'totalTravelers' ? parseInt(value, 10) : value;

    setReservation(prevState => ({
      ...prevState,
      [name]: numericValue,
      totalPrice: name === 'totalTravelers' ? parseFloat(packagePrice) * numericValue : prevState.totalPrice
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to make a reservation. Please register or log in.');
      return;
    }

    const reservationToSubmit = {
      ...reservation,
      userId: user.userId, // Ensure userId is explicitly set here
    };

    console.log('Submitting reservation:', reservationToSubmit); // Debug log

    fetch('http://localhost:5278/api/Reservation/PostReservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationToSubmit),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Reservation created successfully:', data);
        navigate('/reservations');
      })
      .catch(error => console.error('Error creating reservation:', error));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Reservation
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Name"
            value={user ? user.name : ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Surname"
            value={user ? user.surname : ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Destination Name"
            value={destinationName}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Total Travelers"
            type="number"
            name="totalTravelers"
            value={reservation.totalTravelers}
            onChange={handleChange}
            inputProps={{ min: 1, max: 5 }}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Date of Reservation"
            type="date"
            name="dateOfReservation"
            value={reservation.dateOfReservation}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Total Price"
            value={reservation.totalPrice.toFixed(2)}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Reservation
        </Button>
      </form>
    </Box>
  );
}