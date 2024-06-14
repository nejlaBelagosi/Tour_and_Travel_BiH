import React from 'react';
import TourCards from '../components/TourPackagesCards';
import { Box, Typography, Grid } from '@mui/material';

export default function TourPackages() {
  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ marginLeft: '20px', marginTop: '20px', marginBottom: '40px' }}>
        All Tour Packages
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <TourCards />
      </Grid>
    </Box>
  );
}
