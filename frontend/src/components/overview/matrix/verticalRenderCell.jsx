import React from "react";
import { Box } from "@mui/material";
import { webSocket } from "../utils/webSocket/lastData";
const VerticalRenderCell = ({ highchartProps, tag }) => {
  const [data, setData] = React.useState("");
  const [colors, setColors] = React.useState("");
  var loop = [];
  for (let i = 0; i < highchartProps?.[`[${tag?.NAME}] Stops`]; i++) {
    loop.push(i);
  }

  React.useEffect(() => {
    const refSecond =
      highchartProps?.["Widget Refresh (seconds)"] === ""
        ? 5
        : parseInt(highchartProps?.["Widget Refresh (seconds)"]);

    const tagName = tag?.NAME;
    const wsFunc = (data) => {
      setData(data._value.toFixed(highchartProps?.["Decimal Places"]));
      loop.map((e) => {
        if (
          parseFloat(highchartProps?.[`[${e}] [${tag?.NAME}] Low`]) <
            data._value &&
          parseFloat(highchartProps?.[`[${e}] [${tag?.NAME}] High`]) >
            data._value
        ) {
          setColors(highchartProps?.[`[${e}] [${tag?.NAME}] Color`]);
        }
      });
    };
    const ws = new webSocket(refSecond, tagName, wsFunc);
    ws.openWs();
    return () => {
      ws.closeWs();
    };
  }, [
    highchartProps["Widget Refresh (seconds)"],
    highchartProps?.["Decimal Places"],
  ]);

  return (
    <Box>
      <Box
        sx={{
          fontSize: `${highchartProps?.["Value Font Size"]}px`,
          display: "inline-block",
          color: colors,
        }}
      >
        {highchartProps["Show Measurement"] && data}
      </Box>{" "}
      <Box
        sx={{
          fontSize: `${highchartProps?.["UoM Font Size"]}px`,
          display: "inline-block",
          color: colors,
        }}
      >
        {highchartProps["Show Unit of Measurement"] && tag?.CATALOG_SYMBOL}
      </Box>
    </Box>
  );
};

export default VerticalRenderCell;
