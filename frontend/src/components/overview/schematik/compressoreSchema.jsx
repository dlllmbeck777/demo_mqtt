import React from "react";
import { Box } from "@mui/material";
import compressore from "./compressore.png";

import Status from "./status";
import TagPoints from "./tagPoint";
const pumpTagCoordinate = [
  {
    left: "20%",
    top: "9%",
    x1: "24%",
    y1: "calc(9% + 33px)",
    x2: "37%",
    y2: "34%",
  },
  {
    left: "44%",
    top: "22%",
    x1: "48%",
    y1: "calc(22% + 33px)",
    x2: "48%",
    y2: "39%",
  },
  {
    left: "68%",
    top: "20%",
    x1: "72%",
    y1: "calc(20% + 33px)",
    x2: "69.5%",
    y2: "35.5%",
  },
  {
    left: "15%",
    top: "65%",
    x1: "19%",
    y1: "65%",
    x2: "36%",
    y2: "40%",
  },
  {
    left: "36%",
    top: "75%",
    x1: "40%",
    y1: "75%",
    x2: "47%",
    y2: "49%",
  },
  {
    left: "80%",
    top: "54.5%",
    x1: "80%",
    y1: "calc(54.5% + 16.5px)",
    x2: "73.5%",
    y2: "58%",
  },
];

const compressoreSchema = ({ width, height, chartProps }) => {
  return (
    <Box
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${compressore})`,
        backgroundSize: `${width}px ${height}px`,
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {[...Array(6)].map((e, i) => {
        return (
          <>
            <TagPoints
              index={i}
              width={width}
              height={height}
              chartProps={chartProps}
              item={chartProps?.[`[${i}] Measurement`]}
              pumpTagCoordinate={pumpTagCoordinate}
            />
          </>
        );
      })}
      <Status item={chartProps?.["Transaction Property"]} />
    </Box>
  );
};

export default compressoreSchema;
