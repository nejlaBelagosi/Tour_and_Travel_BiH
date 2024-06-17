import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  FormControl,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function ReservationForm({
  packageId,
  destinationName,
  packagePrice,
}) {
  const [reservation, setReservation] = useState({
    userId: "",
    packageId: packageId,
    totalTravelers: 1,
    dateId: "", // Updated field name
    totalPrice: packagePrice,
    reservationStatus: "Pending",
  });
  const [user, setUser] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setReservation((prevState) => ({
        ...prevState,
        userId: storedUser.userId,
      }));
    }

    fetch(`http://localhost:5278/api/TourPackage/GetPackageId/${packageId}`)
      .then((response) => response.json())
      .then((data) => {
        const dates = data.dates.map((date) => ({
          dateId: date.dateId,
          startDate: date.startDate.split("T")[0],
          endDate: date.endDate.split("T")[0],
        }));
        setAvailableDates(dates);
      })
      .catch((error) => console.error("Error fetching package dates:", error));
  }, [packageId]);

  const handleChange = (e) => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const { name, value } = e.target;
    const numericValue =
      name === "totalTravelers" ? parseInt(value, 10) : value;

    setReservation((prevState) => ({
      ...prevState,
      [name]: numericValue,
      totalPrice:
        name === "totalTravelers"
          ? parseFloat(packagePrice) * numericValue
          : prevState.totalPrice,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0]; // Current date

    const reservationToSubmit = {
      ...reservation,
      userId: user.userId,
      dateOfReservation: currentDate, // Set current date when submitting the reservation
    };

    console.log("Submitting reservation:", reservationToSubmit); // Add logging

    fetch("http://localhost:5278/api/Reservation/PostReservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationToSubmit),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        navigate("/reservations");
      })
      .catch((error) => console.error("Error creating reservation:", error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const isPastDate = (date) => {
    return new Date(date) < new Date();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Reservation
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Name"
                value={user ? user.name : ""}
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
                value={user ? user.surname : ""}
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
              <InputLabel>Start Date</InputLabel>
              <Select
                label="Start Date"
                name="dateId"
                value={reservation.dateId} // Updated field name
                onChange={handleChange}
                required
              >
                {availableDates.map(({ dateId, startDate }) => (
                  <MenuItem
                    key={dateId}
                    value={dateId}
                    disabled={isPastDate(startDate)}
                    style={{
                      backgroundColor: isPastDate(startDate)
                        ? "#D37676"
                        : "#B0EBB4",
                      borderRadius: "20px",
                      marginTop: "5px",
                    }}
                  >
                    {startDate}
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
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#4F6F52",
            border: "1px solid #4F6F52",
            "&:hover": {
              backgroundColor: "#3E5643",
              border: "1px solid #3E5643",
            },
          }}
        >
          Submit Reservation
        </Button>
      </form>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You must be logged in to make a reservation. Please register or log
            in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
