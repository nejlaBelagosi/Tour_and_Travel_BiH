// Home.jsx
import * as React from "react";
import { Box, Grid, Typography } from "@mui/material";
import SummaryCard from "../components/SummaryCard";
import LineChart from "../components/ChartsComponent";
import { fetchCounts } from "../components/mockApi";

const Home = () => {
  const [counts, setCounts] = React.useState({
    accounts: 0,
    destinations: 0,
    payments: 0,
    reservations: 0,
    reviews: 0,
    tourPackages: 0,
    users: 0,
    sessions: [],
  });
  const [sessions, setSessions] = React.useState([]);

  React.useEffect(() => {
    const getCounts = async () => {
      const data = await fetchCounts();
      setCounts(data);
      setSessions(data.sessions);
    };

    getCounts();
  }, []);

  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Sessions",
        data: Array.from(
          { length: 30 },
          () => Math.floor(Math.random() * 5) + 1
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Accounts"
            count={counts.accounts}
            color="#e57373"
            gradient="linear-gradient(135deg, #FF6F61, #FFA17F)"
            buttonLabel="Show Accounts"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Destinations"
            count={counts.destinations}
            color="#81c784"
            gradient="linear-gradient(135deg, #56ab2f, #a8e063)"
            buttonLabel="Show Destinations"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Payments"
            count={counts.payments}
            color="#64b5f6"
            gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
            buttonLabel="Show Payments"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Reservations"
            count={counts.reservations}
            color="#ffb74d"
            gradient="linear-gradient(135deg, #FFC371, #FF5F6D)"
            buttonLabel="Show Reservations"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Reviews"
            count={counts.reviews}
            color="#ba68c8"
            gradient="linear-gradient(135deg, #D4FC79, #96E6A1)"
            buttonLabel="Show Reviews"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Tour Packages"
            count={counts.tourPackages}
            color="#4db6ac"
            gradient="linear-gradient(135deg, #43E97B, #38F9D7)"
            buttonLabel="Show Tour Packages"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Users"
            count={counts.users}
            color="#f06292"
            gradient="linear-gradient(135deg, #F5515F, #A1051D)"
            buttonLabel="Show Users"
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 5 }}>
        <LineChart data={chartData} />
      </Box>
    </Box>
  );
};

export default Home;
