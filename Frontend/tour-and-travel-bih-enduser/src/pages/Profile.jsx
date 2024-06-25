import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams(); // Assuming you pass the user ID as a parameter
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5278/api/Users/GetUsersById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [id]);

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

  if (!user) {
    return <Typography variant="h6">User not found.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper sx={{ padding: "20px", maxWidth: "600px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Avatar
              src={`path/to/avatar/${user.userImage}`} // Adjust the path to the user image
              alt={user.name}
              sx={{ width: 100, height: 100, margin: "0 auto" }}
            />
            <Typography variant="h5" sx={{ marginTop: "10px" }}>
              {user.name} {user.surname}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Email: {user.email}</Typography>
            <Typography variant="subtitle1">Address: {user.address}</Typography>
            <Typography variant="subtitle1">Contact: {user.contact}</Typography>
            <Typography variant="subtitle1">
              Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
