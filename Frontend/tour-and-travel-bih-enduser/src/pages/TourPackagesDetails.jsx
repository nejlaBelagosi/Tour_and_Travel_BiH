import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Box, Grid, CircularProgress } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightIcon from "@mui/icons-material/Highlight";
import TourReviews from "../components/TourReviews";
import ReservationForm from "../components/ReservationForm";
import Footer from "../components/Footer";
import "../styles/TourPackageDetails.css";
import "../styles/Footer.css";

export default function TourPackages() {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const reservationRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5278/api/TourPackage/GetPackageId/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPackageDetails(data);
        fetchReviews(data.destinationName);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching package details:", error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const fetchReviews = (destinationName) => {
    fetch(
      `http://localhost:5278/api/Review/GetRatingByDestinationName/GetRatingByDestinationName/${destinationName}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRating(data.averageRating);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  };

  const handleReservationClick = () => {
    reservationRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const formatDescription = (description) => {
    const formattedDescription = description.replace(/  +/g, "\n");
    return formattedDescription.split("\n").map((item, index) => (
      <li
        key={index}
        style={{
          marginBottom: "20px",
          verticalAlign: "middle",
          alignItems: "center",
          padding: 0,
          display: "flex",
        }}
      >
        <CheckCircleIcon style={{ marginRight: "10px", color: "#1A4D2E" }} />
        {item}
      </li>
    ));
  };

  const formatHighlights = (description) => {
    const formattedHighlights = description.replace(/  +/g, "\n");
    return formattedHighlights.split("\n").map((item, index) => (
      <li
        key={index}
        style={{
          marginBottom: "20px",
          verticalAlign: "middle",
          alignItems: "center",
          padding: 0,
          display: "flex",
        }}
      >
        <HighlightIcon style={{ marginRight: "10px", color: "#1A4D2E" }} />
        {item}
      </li>
    ));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#1A4D2E" }} />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!packageDetails) {
    return <div>No package details available</div>;
  }

  return (
    <div className="tour-package-container">
      <div className="header-card">
        <div className="tour-package-header">
          <Typography variant="h4" className="tour-package-header-title">
            {packageDetails.destinationName}
          </Typography>
          <Typography
            variant="body2"
            className="tour-package-header-rating"
            fontSize={"30px"}
          >
            {rating.toFixed(1)} <StarIcon fontSize="medium" />
          </Typography>
        </div>
        <div className="tour-package-content">
          <div className="tour-package-image-container">
            <img
              src={`http://localhost:5278/api/Destination/GetImage/${packageDetails.destinationImage}`}
              alt={packageDetails.destinationName}
              className="tour-package-image"
            />
          </div>
          <div className="tour-package-details">
            <Typography style={{ fontFamily: "Montserrat" }}>From:</Typography>
            <Typography
              variant="h4"
              className="tour-package-price"
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              ${packageDetails.price}
            </Typography>

            <Typography variant="body1">
              {packageDetails.destinationDetails}
            </Typography>
            <div className="tour-package-buttons">
              <Button
                className="tour-package-button check-availability-button"
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  border: "1px solid #4F6F52",
                  borderRadius: "25px",
                  background: "#4F6F52",
                  color: "white",
                  padding: "10px 30px",
                }}
                onClick={handleReservationClick}
              >
                Check Reservation
              </Button>
              <IconButton
                aria-label="add to favorites"
                style={{
                  color: "#E8DFCA",
                  width: "50px",
                  height: "50px",
                  marginTop: "20px",
                }}
              >
                <FavoriteIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        style={{
          marginTop: "20px",
          marginLeft: "auto",
          marginRight: "auto",
          width: "90%",
        }}
      >
        <Grid
          item
          xs={12}
          sm={5.8}
          style={{
            backgroundColor: "#BACD92",
            borderRadius: "20px 20px 20px 20px",
            padding: "10px",
            marginRight: "10px",
          }}
        >
          <h3 style={{ marginLeft: "20px", fontFamily: "Montserrat" }}>
            Paket ukljucuje:
          </h3>
          <Typography style={{ marginLeft: "20px" }}>
            <ul className="tour-package-description">
              {formatDescription(packageDetails.packageDescription)}
            </ul>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={5.8}
          sx={{
            backgroundColor: "#E8DFCA",
            padding: "10px",
            borderRadius: "20px 20px 20px 20px",
            marginLeft: "10px",
          }}
        >
          <h3 style={{ marginLeft: "20px", fontFamily: "Montserrat" }}>
            Dodatne informacije:
          </h3>{" "}
          <br />
          <Typography style={{ marginLeft: "20px" }}>
            <ul className="tour-package-description">
              {formatDescription(packageDetails.additionalInformations)}
            </ul>
          </Typography>
        </Grid>
      </Grid>
      {/* ------------ highlights ----------- */}
      <div className="tour-highlights">
        <h2 style={{ fontFamily: "Montserrat" }}>Tour Highlights:</h2> <br />
        <Typography>
          <ul
            style={{
              marginTop: "10px",
              marginLeft: "20px",
              listStyle: "none",
              marginBottom: "10px",
            }}
          >
            {formatHighlights(packageDetails.tourHighlights)}
          </ul>
        </Typography>
      </div>
      {/* --------------dates -------------------------- */}
      <h2 style={{ marginLeft: "70px", fontFamily: "Montserrat" }}>
        Available dates:
      </h2>{" "}
      <br />
      <Grid
        container
        spacing={0.5}
        justifyContent="beginning"
        marginLeft="auto"
        marginRight="auto"
        alignItems="center"
        width="80%"
        style={{ marginTop: "20px" }}
      >
        {packageDetails.dates.map((date) => (
          <Grid
            item
            key={date.dateId}
            xs={6}
            sm={4}
            md={2}
            lg={1}
            sx={{
              backgroundColor: "#F5EFE6",
              padding: "10px",
              textAlign: "center",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "60px",
              width: "100px",
              boxSizing: "border-box",
              margin: "5px", // Reduce margin to fine-tune space between items
            }}
          >
            <Typography variant="body1">{date.startDate}</Typography>
            {/* Uncomment if you want to include end date */}
            {/* <Typography variant="body1">
        End: <br />
        {date.endDate}
      </Typography> */}
          </Grid>
        ))}
      </Grid>
      {/* ------------------------- reservation section ---------------------------------------- */}
      <h2 style={{ marginTop: "20px", marginLeft: " 75px", marginBottom: 0 }}>
        Create reservation
      </h2>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ marginLeft: "75px", marginRight: "auto" }}
      >
        <Grid item xs={12} sm={6}>
          <Box ref={reservationRef}>
            <ReservationForm
              packageId={id}
              destinationName={packageDetails.destinationName}
              packagePrice={packageDetails.price}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} className="image-grid-container">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              height: "300px", // Adjust the height as needed
              width: "100%", // Adjust the width as needed
              maxWidth: "100%",
            }}
          ></Box>
        </Grid>
      </Grid>
      {/* <div ref={reservationRef}>
        <ReservationForm
          packageId={id}
          destinationName={packageDetails.destinationName}
          packagePrice={packageDetails.price}
        />
      </div> */}
      {/* ------ reviews ------- */}
      <div className="reviews-section">
        <TourReviews packageId={id} />
      </div>
      {/* <ReviewForm
        reservationId={packageDetails.reservationId}
        onReviewSubmitted={handleReviewSubmit}
      /> */}
      {/* ----footer ------ */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
