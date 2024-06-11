import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import TourReviews from '../components/TourReviews';
import ReviewForm from '../components/ReviewForm'; // Dodajemo ReviewForm komponentu
import '../styles/TourPackage.css';

export default function TourPackages() {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  
  useEffect(() => {
    fetch(`http://localhost:5278/api/TourPackage/GetPackageId/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPackageDetails(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching package details:', error);
        setError(error);
        setLoading(false);
      });

    // Fetch average rating
    fetch(`http://localhost:5278/api/Review/GetReviewByPackageId/${id}`)
      .then(response => response.json())
      .then(data => {
        const avgRating = data.length ? data.reduce((acc, review) => acc + review.rating, 0) / data.length : 0;
        setRating(avgRating);
      })
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);

  const handleReservationClick = () => {
    navigate(`/reservation/${id}`);
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    // Fetch new reviews and update rating
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!packageDetails) {
    return <div>No package details available</div>;
  }

  return (
    <div className="tour-package-container">
      <div className="tour-package-header">
        <Typography variant="h4" className="tour-package-header-title">
          {packageDetails.destinationName}
        </Typography>
        <Typography variant="body2" className="tour-package-header-rating" fontSize={'30px'}>
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
          <Typography>From:</Typography>
          <Typography variant="h4" className="tour-package-price" style={{ marginTop: '20px', marginBottom: '20px' }}>
            ${packageDetails.price}
          </Typography>
          <div className="tour-package-buttons">
            <Button
              className="tour-package-button check-availability-button"
              style={{
                marginTop: '20px',
                marginBottom: '20px',
                border: '1px solid #4F6F52',
                borderRadius: '25px',
                background: '#4F6F52',
                color: 'white',
                padding: '10px 30px',
              }}
              onClick={handleReservationClick}
            >
              Check Availability
            </Button>
            <IconButton aria-label="add to favorites" style={{ color: '#E8DFCA', width: '50px', height: '50px', marginTop: '20px' }}>
              <FavoriteIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div>
        <Typography variant="body1" className="tour-package-description">
          Description: <br />
          {packageDetails.packageDescription}
        </Typography>
        <Typography variant="body1" className="tour-package-description">
          Start: <br />
          {packageDetails.startDate}
        </Typography>
        <Typography variant="body1" className="tour-package-description">
          End date: <br />
          {packageDetails.endDate}
        </Typography>
      </div>
      <div className="reviews-section">
        <TourReviews packageId={id} />
      </div>
      {showReviewForm ? (
        <ReviewForm reservationId={packageDetails.reservationId} onReviewSubmitted={handleReviewSubmit} />
      ) : (
        <Button onClick={() => setShowReviewForm(true)}>Add a Review</Button>
      )}
    </div>
  );
}
