import React from "react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import "../../assets/styles/components/loading/loading.scss";
const LoadingComponent = () => {
  return (
    <Box className="loading-component-box">
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default LoadingComponent;
