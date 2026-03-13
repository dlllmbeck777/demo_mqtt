import React from "react";
import ChartLinear from "./chartLinear";
import Histogram from "./histogram";
import AssetFft from "./assetFft";
import AssetKurtosis from "./assetKurtosis";
const chart = (props) => {
  if (
    props.highchartProps?.Inputs === null &&
    props.highchartProps?.["Spectral Waveform"] === "Kurtosis"
  )
    return <AssetKurtosis {...props} />;
  else if (props.highchartProps?.Inputs === null)
    return <AssetFft {...props} />;
  else if (props.highchartProps?.["Spectral Waveform"] === "Kurtosis")
    return <Histogram {...props} />;
  return <ChartLinear {...props} />;
};

export default chart;
