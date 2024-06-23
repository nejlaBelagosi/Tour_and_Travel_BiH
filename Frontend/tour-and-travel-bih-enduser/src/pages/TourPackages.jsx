import React from "react";
import TourCards from "../components/TourPackagesCards";
import SearchBar from "../components/SearchBar";
import { Box, Typography, Grid } from "@mui/material";

export default function TourPackages() {
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography
        variant="h4"
        gutterBottom
        style={{ marginLeft: "20px", marginTop: "20px", marginBottom: "40px" }}
      >
        All Tour Packages
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
      >
        <SearchBar sx={{ border: "1px solid" }} />
      </Box>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ marginTop: "20px" }}
      >
        <TourCards />
      </Grid>
    </Box>
  );
}
