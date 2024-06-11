import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function ReservationForm() {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalTravelers, setTotalTravelers] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5278/api/TourPackage/GetPackage/${id}`)
      .then(response => response.json())
      .then(data => setPackageDetails(data))
      .catch(error => console.error('Error fetching package details:', error));
  }, [id]);

  const handleReservationSubmit = () => {
    const reservationDetails = {
      packageId: id,
      totalTravelers,
      dateOfReservation: selectedDate,
      totalPrice: packageDetails.price * totalTravelers,
    };

    fetch('http://localhost:5278/api/Reservation/PostReservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationDetails),
    })
      .then(response => response.json())
      .then(data => {
        alert('Reservation successful!');
        navigate(`/confirmation/${data.reservationId}`);
      })
      .catch(error => console.error('Error making reservation:', error));
  };

  if (!packageDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Reserve {packageDetails.destinationName}</Typography>
        <Typography variant="body1">Price: ${packageDetails.price}</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar']}>
        <DemoItem label="Controlled calendar">
          <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
        <TextField
          label="Total Travelers"
          type="number"
          value={totalTravelers}
          onChange={(e) => setTotalTravelers(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleReservationSubmit}>
          Confirm Reservation
        </Button>
      </CardContent>
    </Card>
  );
}
