import React from "react";
import { Box } from "@mui/material";

import { findColor } from "../utils/findStopColor";
import { webSocket } from "../utils/webSocket/lastData";

const LineDrawing = ({ width, height, x1, y1, x2, y2, stroke }) => {
  return (
    <svg width={width} height={height} style={{ position: "absolute" }}>
      <line stroke={stroke} stroke-width="2" x1={x1} y1={y1} x2={x2} y2={y2} />
    </svg>
  );
};

const TagPoints = ({
  chartProps,
  index,
  width,
  item,
  height,
  pumpTagCoordinate,
}) => {
  const [data, setData] = React.useState("0");
  React.useEffect(() => {
    let ws = false;
    if (!item) {
      setData("-");
    } else {
      const refSecond =
        chartProps?.["Widget Refresh (seconds)"] === ""
          ? 5
          : parseInt(chartProps?.["Widget Refresh (seconds)"]);

      const tagName = item?.[0].NAME;
      const wsFunc = (data) => {
        setData((prev) => data["_value"]);
      };
      const ws = new webSocket(refSecond, tagName, wsFunc);
      ws.openWs();
    }
    return () => {
      if (ws) ws.closeWs();
    };
  }, [item?.[0].NAME]);

  return (
    <>
      <Box
        id={`drag-${index}`}
        key={index}
        sx={{
          position: "absolute",
          border: `2px solid ${findColor(parseFloat(data), index, chartProps)}`,
          color: findColor(parseFloat(data), index, chartProps),
          width: `8%`,
          height: "33px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(250, 250, 250,0.5)",
          ...pumpTagCoordinate[index],
        }}
      >
        <Box sx={{ position: "relaative" }}>
          <Box
            sx={{
              position: "absolute",
              top: "-10px",
              left: "-8px",
              color: "black",
              fontSize: "8px",
            }}
          >
            {index + 1}
          </Box>
          <Box
            sx={{
              display: chartProps?.[`Show Measurement`]
                ? "inline-block"
                : "none",
              fontSize:
                chartProps?.["Value Font Size"] !== ""
                  ? `${chartProps?.["Value Font Size"]}px`
                  : "12px",
              alignSelf: "auto",
            }}
          >
            {isNaN(parseFloat(data))
              ? "-"
              : parseFloat(data).toFixed(
                  chartProps?.["Decimal Places"] === ""
                    ? 0
                    : chartProps?.["Decimal Places"]
                )}
          </Box>{" "}
          <Box
            sx={{
              display: chartProps?.[`Show Unit of Measurement`]
                ? "inline-block"
                : "none",
              fontSize:
                chartProps?.["UoM Font Size"] !== ""
                  ? `${chartProps?.["UoM Font Size"]}px`
                  : "12px",
              marginY: "auto",
            }}
          >
            {item?.[0].CATALOG_SYMBOL}
          </Box>
        </Box>
      </Box>
      <LineDrawing
        width={width}
        height={height}
        index={index}
        stroke={findColor(parseFloat(data), index)}
        {...pumpTagCoordinate[index]}
      />
    </>
  );
};

export default TagPoints;
