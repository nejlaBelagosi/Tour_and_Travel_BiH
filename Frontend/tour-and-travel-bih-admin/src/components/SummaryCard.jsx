// SummaryCard.jsx
import * as React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const SummaryCard = ({
  title,
  count,
  color,
  gradient,
  buttonLabel,
  onClick,
}) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        boxShadow: 3,
        borderRadius: 2,
        background: gradient,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="div" color="white">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color="white">
            {count}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={onClick}
          sx={{ mt: 2, backgroundColor: "white", color }}
        >
          {buttonLabel}
        </Button>
      </CardContent>
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: 150,
          height: 150,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
        }}
      />
    </Card>
  );
};

export default SummaryCard;
