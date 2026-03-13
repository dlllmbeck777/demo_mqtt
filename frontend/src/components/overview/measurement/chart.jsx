import React from "react";
import $ from "jquery";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { dateFormatDDMMYYHHMMSS } from "../../../services/utils/dateFormatter";
import { uuidv4 } from "../../../services/utils/uuidGenerator";
import { webSocket } from "../utils/webSocket/lastData";

const Measurement = ({ highchartProps }) => {
  const [data, setData] = React.useState("0");
  const [uuid, setUuid] = React.useState(uuidv4());
  function colorPicker(val) {
    let color = "inherit";
    let i = 0;
    while (i < parseInt(highchartProps.Stops)) {
      if (
        parseFloat(highchartProps[`[${i}] Low`]) < val &&
        parseFloat(highchartProps[`[${i}] High`]) > val
      ) {
        color = highchartProps[`[${i}] Color`];
      }
      i++;
    }
    return color;
  }

  React.useEffect(() => {
    const refSecond =
      highchartProps?.["Widget Refresh (seconds)"] === ""
        ? 5
        : parseInt(highchartProps?.["Widget Refresh (seconds)"]);

    const tagName = highchartProps?.Measurement?.[0].NAME;
    const wsFunc = (data) => {
      console.log(data);
      $(`#${uuid}-categories`).html(
        dateFormatDDMMYYHHMMSS(new Date(Date.parse(data["_time"]) + 18000000))
      );
      setData((prev) =>
        parseFloat(data["_value"]).toFixed(
          highchartProps["Decimal Places"] === ""
            ? 0
            : highchartProps["Decimal Places"]
        )
      );
    };
    console.log(tagName);
    const ws = new webSocket(refSecond, tagName, wsFunc);
    ws.openWs();
    return () => {
      ws.closeWs();
    };
  }, [
    highchartProps.Measurement,
    highchartProps["Widget Refresh (seconds)"],
    highchartProps["Decimal Places"],
  ]);
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "0px",
          width: "100%",
          textAlign: "center",
          display: highchartProps["Show Tag Name"] ? "inline-block" : "none",
          fontSize:
            highchartProps["Tag Name Font Size"] !== ""
              ? `${highchartProps["Tag Name Font Size"]}px`
              : "12px",
        }}
      >
        {highchartProps?.Measurement?.[0]
          ? highchartProps?.Measurement?.[0]?.NAME
          : ""}
      </Box>
      <Grid
        container
        sx={{
          height: "100%",
          flexDirection: "column",
          width: "100%",
          flexWrap: "nowrap",
          justifyContent: "space-evenly",
        }}
      >
        <Grid
          item
          sx={{
            position: "relative",
            top: "-24px",
          }}
        >
          <Grid
            container
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Grid
              item
              sx={{
                display: highchartProps["Show Measurement"]
                  ? "inline-block"
                  : "none",
                fontSize:
                  highchartProps["Value Font Size"] !== ""
                    ? `${highchartProps["Value Font Size"]}px`
                    : "14px",
                marginRight: "6px",
                color: colorPicker(parseFloat(data)),
                fontWeight: "bold",
              }}
            >
              {data}
            </Grid>
            <Grid
              item
              sx={{
                display: highchartProps["Show Unit of Measurement"]
                  ? "inline-block"
                  : "none",
                fontSize:
                  highchartProps["UoM Font Size"] !== ""
                    ? `${highchartProps["UoM Font Size"]}px`
                    : "14px",
              }}
            >
              {highchartProps?.Measurement?.[0] &&
              highchartProps["Show Unit of Measurement"]
                ? `(${highchartProps?.Measurement?.[0]?.CATALOG_SYMBOL})`
                : ""}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box
        id={`${uuid}-categories`}
        sx={{
          position: "absolute",
          bottom: "0px",
          width: "100%",
          textAlign: "center",
          paddingBottom: "12px",
          fontSize:
            highchartProps["Time Stamp Font Size"] !== ""
              ? `${highchartProps["Time Stamp Font Size"]}px`
              : "14px",
          display: highchartProps["Show Timestamp"] ? "inline-block" : "none",
        }}
      />
    </Box>
  );
};

export default React.memo(Measurement);
