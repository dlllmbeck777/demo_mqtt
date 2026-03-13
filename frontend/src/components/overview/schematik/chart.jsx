import React from "react";
import PumpSchema from "./pumpSchema";
import CompressoreSchema from "./compressoreSchema";
const chart = ({ width, height, chartProps }) => {
  return chartProps?.["Schematic Type"] === "Pump" ? (
    <PumpSchema width={width} height={height} chartProps={chartProps} />
  ) : (
    <CompressoreSchema width={width} height={height} chartProps={chartProps} />
  );
};

export default chart;
