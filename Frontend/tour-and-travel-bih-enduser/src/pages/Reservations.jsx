import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  Grid,
  CardMedia,
  Modal,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewForm from "../components/ReviewForm";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [editReservation, setEditReservation] = useState(null);
  const [open, setOpen] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetch(
        `http://localhost:5278/api/Reservation/GetReservationsByUserId/${storedUser.userId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch reservations");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data); // Debug log
          setReservations(data);
        })
        .catch((error) => console.error("Error fetching reservations:", error));
    }
  }, []);

  const handleCancelReservation = (reservationId) => {
    fetch(
      `http://localhost:5278/api/Reservation/DeleteReservation/${reservationId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete reservation");
        }
        setReservations(
          reservations.filter(
            (reservation) => reservation.reservationId !== reservationId
          )
        );
      })
      .catch((error) => console.error("Error deleting reservation:", error));
  };

  const handleEditReservation = (reservation) => {
    setEditReservation({
      ...reservation,
      packagePrice: reservation.totalPrice / reservation.totalTravelers, // Calculate packagePrice based on current data
    });
    setOpen(true);

    fetch(
      `http://localhost:5278/api/Reservation/GetPackageDates/${reservation.packageId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAvailableDates(data);
      })
      .catch((error) => console.error("Error fetching package dates:", error));
  };

  const handleClose = () => {
    setOpen(false);
    setEditReservation(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const numericValue =
      name === "totalTravelers" ? parseInt(value, 10) : value;

    setEditReservation((prevState) => ({
      ...prevState,
      [name]: numericValue,
      totalPrice:
        name === "totalTravelers"
          ? prevState.packagePrice * numericValue
          : prevState.totalPrice,
    }));
  };

  const handleEditSubmit = () => {
    const currentDate = new Date().toISOString().split("T")[0]; // Trenutni datum

    const updatedReservation = {
      ...editReservation,
      dateOfReservation: currentDate, // Postavi trenutni datum prilikom slanja rezervacije
      totalPrice: editReservation.packagePrice * editReservation.totalTravelers,
      DateId: editReservation.dateId, // Include DateId in the update
    };

    console.log("Submitting edit:", updatedReservation); // Log the reservation being submitted
    fetch(
      `http://localhost:5278/api/Reservation/UpdateReservation/${updatedReservation.reservationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReservation),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update reservation");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Reservation updated:", data); // Log the response from the server
        setReservations(
          reservations.map((r) =>
            r.reservationId === data.reservationId ? data : r
          )
        );
        handleClose();
        window.location.reload(); // Refresh the page
      })
      .catch((error) => console.error("Error updating reservation:", error));
  };

  const handleOpenReviewForm = (reservationId) => {
    setSelectedReservationId(reservationId);
    setOpenReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setOpenReviewForm(false);
    setSelectedReservationId(null);
  };

  const handleReviewSubmit = () => {
    setOpenReviewForm(false);
    setSelectedReservationId(null);
    // Osveži rezervacije ili dodaj logiku za ažuriranje recenzija
  };

  const isPastDate = (date) => {
    return new Date(date) < new Date();
  };

  if (!user) {
    return (
      <Typography variant="h6">
        You need to be logged in to view your reservations.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Your Reservations
      </Typography>
      <Grid container spacing={4}>
        {reservations.map((reservation, index) => (
          <Grid
            item
            key={reservation.reservationId || index}
            xs={12}
            sm={6}
            md={4}
          >
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:5278/api/Destination/GetImage/${reservation.destinationImage}`}
                alt={reservation.destinationName}
                sx={{ borderRadius: "16px 16px 0 0" }}
                onError={(e) => (e.target.src = "default-image.jpg")} // Fallback image
              />
              <CardContent>
                <Typography variant="h6">
                  Destination: {reservation.destinationName}
                </Typography>
                <Typography variant="body2">
                  Date:{" "}
                  {new Date(reservation.dateOfReservation).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Travelers: {reservation.totalTravelers}
                </Typography>
                <Typography variant="body2">
                  Total Price: ${reservation.totalPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Status: {reservation.reservationStatus}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#4F6F52", marginLeft: "5px" }}
                  onClick={() =>
                    handleCancelReservation(reservation.reservationId)
                  }
                >
                  Cancel Reservation
                </Button>
                {reservation.reservationStatus === "Zavrseno" && (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#1A4D2E", marginLeft: "20px" }}
                    onClick={() =>
                      handleOpenReviewForm(reservation.reservationId)
                    }
                  >
                    Add Review
                  </Button>
                )}
                <IconButton
                  style={{ backgroundColor: "#E8DFCA", marginLeft: "auto" }}
                  onClick={() => handleEditReservation(reservation)}
                >
                  <EditIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography variant="h6" component="h2">
            Edit Reservation
          </Typography>
          {editReservation && (
            <Box component="form" sx={{ mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Date</InputLabel>
                <Select
                  label="Date"
                  name="dateId"
                  value={editReservation.dateId || ""}
                  onChange={handleEditChange}
                  required
                >
                  {availableDates.map(({ dateId, startDate, endDate }) => (
                    <MenuItem
                      key={dateId}
                      value={dateId}
                      style={{
                        backgroundColor: isPastDate(startDate)
                          ? "#D37676"
                          : "#B0EBB4",
                        borderRadius: "20px",
                        marginTop: "5px",
                      }}
                    >
                      {startDate} to {endDate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Total Travelers"
                  type="number"
                  name="totalTravelers"
                  value={editReservation.totalTravelers}
                  onChange={handleEditChange}
                  inputProps={{ min: 1, max: 5 }}
                  required
                />
              </FormControl>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Total Price: ${editReservation.totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                onClick={handleEditSubmit}
                sx={{ mt: 2, backgroundColor: "#4F6F52" }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </Modal>

      <Modal open={openReviewForm} onClose={handleCloseReviewForm}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <ReviewForm
            reservationId={selectedReservationId}
            onReviewSubmitted={handleReviewSubmit}
          />
        </Box>
      </Modal>
    </Box>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
