import React, { useState } from "react";
import { Box, Typography, Button, Modal, TextField, Grid } from "@mui/material";
import image from "../img/FAVICON.png"; // Replace with the actual path to your logo

import "../styles/AboutUs.css";

const AboutUs = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic here
    handleClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1A4D2E",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Who we are.
        </Typography>
        <img
          src={image}
          alt="Logo"
          style={{ width: "200px", height: "auto" }}
        />
        <Typography variant="body1" align="center" sx={{ marginTop: "20px" }}>
          We are a team of dedicated professionals with diverse experiences,
          committed to providing personalized solutions to our clients.
        </Typography>
        <Button
          onClick={handleOpen}
          sx={{
            marginTop: "20px",
            backgroundColor: "#004d40",
            color: "#ffffff",
            padding: "10px 30px",
            borderRadius: "20px",
          }}
        >
          Contact Us
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <TextField
            label="Name"
            name="name"
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Message"
            name="message"
            multiline
            rows={4}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#004d40",
              color: "#ffffff",
              marginTop: "20px",
            }}
          >
            Send
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AboutUs;
