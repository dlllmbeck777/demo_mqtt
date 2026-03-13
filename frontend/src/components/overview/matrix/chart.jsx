import React from "react";
import { Box } from "@mui/material";
import "../../../assets/styles/components/overview/matrixWidget.scss";

import Horizontal from "./horizontal";
import Vertical from "./vertical";
const Matrix = ({ highchartProps }) => {
  return (
    <Box sx={{ pb: 2.5, width: "100%", height: "100%" }}>
      {highchartProps?.["Show Horizontal"] ? (
        <Horizontal highchartProps={highchartProps} />
      ) : (
        <Vertical highchartProps={highchartProps} />
      )}
    </Box>
  );
};

export default Matrix;
