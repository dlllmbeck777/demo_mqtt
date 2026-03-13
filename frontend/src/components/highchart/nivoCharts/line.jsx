import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { saveAs } from "file-saver";
import { IconButton, Grid } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useState, useEffect } from "react";
import { wsBaseUrl } from "../../../services/baseApi";
let client = [];
var W3CWebSocket = require("websocket").w3cwebsocket;

const MyResponsiveLine = ({ liveData, highchartProps, height }) => {
  let yAxis = [];
  let yAxiskey = {};
  const [data, setData] = React.useState([]);
  const chartRef = React.useRef(null);
  highchartProps.Inputs.map((e, i) => {
    if (!yAxiskey.hasOwnProperty(`${e.QUANTITY_TYPE} (${e.CATALOG_SYMBOL})`)) {
      yAxiskey[`${e.QUANTITY_TYPE} (${e.CATALOG_SYMBOL})`] = i;
      yAxis.push({
        id: e.NAME,
        ticks: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: ".2f",
        legend: "Axis 1",
        legendOffset: -40,
        legendPosition: "middle",
      });
    }
  });
  const handleExportImage = () => {
    const svgElement =
      chartRef.current?.chartWrapper?.current?.querySelector("svg");
    if (svgElement) {
      svgElement
        .toDataURL("image/png", { backgroundColor: "#fff" })
        .then((dataURL) => {
          const blob = dataURLToBlob(dataURL);
          saveAs(blob, "my-chart.png");
        });
    } else {
    }
  };
  React.useEffect(() => {
    highchartProps.Inputs.map((tag, index) => {
      setData((prev) => {
        return [...prev, { id: tag.NAME, data: [] }];
      });
      client[index] = new W3CWebSocket(`${wsBaseUrl}/ws/tags/${tag.TAG_ID}`);
      client[index].onerror = function () {
        console.log("Connection Error");
      };
      client[index].onopen = function () {
        console.log("connected");
      };
      client[index].onclose = function () {
        console.log("WebSocket Client Closed");
      };
      client[index].onmessage = function (e) {
        async function sendNumber() {
          if (client.readyState === client.OPEN) {
            if (typeof e.data === "string") {
              let jsonData = JSON.parse(e.data);
              Promise.all(
                jsonData.map((e) => {
                  Object.keys(e).map((key) => {
                    setData((prev) => {
                      let newDate = new Date(e[key][1][0][0] * 1000);
                      return {
                        ...prev,
                        [index]: {
                          ...prev[index],
                          data: [
                            ...prev[index].data,
                            {
                              x: newDate,
                              y: e[key][1][0][1],
                            },
                          ],
                        },
                      };
                    });
                  });
                })
              );
              return true;
            }
          }
        }
        sendNumber();
      };
    });

    return () => {
      setData([]);

      Promise.all(
        client.map((e) => {
          e.close();
        })
      );
    };
  }, [liveData]);
  return (
    <>
      <Grid
        container
        sx={{
          height: "50px",
          alignItems: "center",
          width: "100%",
          flexDirection: "row-reverse",
          p: 0.5,
        }}
      >
        <IconButton onClick={handleExportImage}>
          <GetAppIcon />
        </IconButton>
      </Grid>
      <ResponsiveLine
        ref={chartRef}
        data={[...Object.keys(data).map((e) => data[e])]}
        interactive={true}
        enableZoom={true}
        enablePan={true}
        height={height - 50}
        margin={{ top: 10, right: 30, bottom: 85, left: 60 }}
        xScale={{ type: "time" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        enableGridX={false}
        enableGridY={true}
        enablePoints={false}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        axisLeft={{
          orient: "left",
          tickSize: 2,
          tickPadding: 12,
          tickRotation: -90,
        }}
        axisBottom={{
          format: "%b %d",
          legendPosition: "middle",
          legendOffset: 46,
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 75,
            itemsSpacing: 8,
            itemDirection: "left-to-right",
            itemWidth: 125,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};
function dataURLToBlob(dataURL) {
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: contentType });
}
function App(props) {
  return <MyResponsiveLine {...props} />;
}
export default React.memo(App);
