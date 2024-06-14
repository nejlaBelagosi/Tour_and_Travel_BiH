import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, FormControl, Box, Typography, MenuItem, Select, InputLabel, Grid } from '@mui/material';

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
  const [availableDates, setAvailableDates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setReservation(prevState => ({
        ...prevState,
        userId: storedUser.userId,
      }));
    }

    fetch(`http://localhost:5278/api/TourPackage/GetPackage`)
      .then(response => response.json())
      .then(data => {
        const dates = data
          .filter(pkg => pkg.destinationName === destinationName)
          .flatMap(pkg => {
            const start = new Date(pkg.startDate);
            const end = new Date(pkg.endDate);
            const dates = [];
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
              dates.push(new Date(d));
            }
            return dates;
          });
        setAvailableDates(dates.map(date => ({
          date: date.toISOString().split('T')[0],
          isPast: date < new Date()
        })));
      })
      .catch(error => console.error('Error fetching packages:', error));
  }, [destinationName]);

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
      userId: user.userId,
    };

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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Name"
                value={user ? user.name : ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Surname"
                value={user ? user.surname : ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Destination Name"
                value={destinationName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Date of Reservation</InputLabel>
              <Select
                label="Date of Reservation"
                name="dateOfReservation"
                value={reservation.dateOfReservation}
                onChange={handleChange}
                required
              >
                {availableDates.map(({ date, isPast }) => (
                  <MenuItem key={date} value={date} disabled={isPast} style={{ backgroundColor: isPast ? '#D37676' : '#B0EBB4' , borderRadius:'20px', marginTop:'5px'}}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Total Price"
                value={reservation.totalPrice.toFixed(2)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 , backgroundColor:'#4F6F52', border: '1px solid #4F6F52', '&:hover': {
      backgroundColor: '#3E5643',
      border: '1px solid #3E5643',
    },}}>
          Submit Reservation
        </Button>
      </form>
    </Box>
  );
}
