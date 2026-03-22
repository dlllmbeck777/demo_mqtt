import Highcharts from "highcharts/highstock";
import React from "react";

import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import boost from "highcharts/modules/boost";
import accessibility from "highcharts/modules/accessibility";
import { showLoading, loading } from "../../utils/loading";
import { addAxis } from "../../utils/addAxis";
import { responsiveLine } from "../../utils/responsive";
import { credits } from "../../utils/credit";
import {
  updateAxisTitle,
  updateAxisValue,
  updateAxisAlignTick,
  updateAxisStartTick,
  updateAxisEndTick,
  updateSettings,
} from "../../utils/updateYaxis";
import { updateSeries } from "../../utils/updateSeries";
import { useIsMount } from "../../../../hooks/useIsMount";
import { layerName, wsBaseUrl } from "../../../../services/baseApi";
import { uuidv4 } from "../../../../services/utils/uuidGenerator";
exporting(Highcharts);
accessibility(Highcharts);
data(Highcharts);
boost(Highcharts);
var W3CWebSocket = require("websocket").w3cwebsocket;

const LineCharts = ({ highchartProps, width, height, updateUuid }) => {
  const isMount = useIsMount();
  const chartRef = React.createRef();
  let lock = true;
  React.useEffect(() => {
    let yAxiskey = {};
    let client;
    const series = chartRef.current.chart;
    showLoading(series);
    async function myFunc() {
      if (series) {
        let dataList = {};
        Promise.all(
          highchartProps.Inputs.map((tag, i) => {
            dataList[tag.NAME] = [];
            if (
              !yAxiskey.hasOwnProperty(
                `${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`
              )
            ) {
              yAxiskey[`${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`] = i;
              addAxis(series, highchartProps, tag, i);
            }
          })
        );
        Promise.all(
          highchartProps.Inputs.map((tag) => {
            series.addSeries({
              yAxis:
                "yaxis-" +
                yAxiskey[`${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`],
              name: tag.SHORT_NAME,
              id: tag.NAME,
              marker: {
                enabled: true,
              },
              color: highchartProps["Show Enable Custom Color"]
                ? highchartProps[`[${tag.NAME}] Color`]
                : "",

              data: [],
            });
          })
        );
        client = new W3CWebSocket(
          `${wsBaseUrl}/ws/tags/measurement/anomaly/${layerName}/${uuidv4()}/`
        );
        client.onopen = function () {
          console.log("connected");
          client.send(
            JSON.stringify([...highchartProps.Inputs.map((e) => e.NAME)])
          );
        };
        client.onerror = function () {
          console.log("Connection Error");
        };
        client.onclose = function () {
          console.log("WebSocket Client Closed Line");
        };
        client.onmessage = function (e) {
          async function sendNumber() {
            if (client.readyState === client.OPEN) {
              if (typeof e.data === "string") {
                let jsonData = JSON.parse(e.data);
                Promise.all(
                  jsonData.map((e, i) => {
                    if (i % 3 === 0)
                      series
                        .get(e.measurement)
                        .addPoint(
                          { x: e["time"], y: e["tag_value"], color: "red" },
                          false,
                          false,
                          false
                        );
                    else {
                      series
                        .get(e.measurement)
                        .addPoint(
                          { x: e["time"], y: e["tag_value"] },
                          false,
                          false,
                          false
                        );
                    }
                  })
                );
                series.series.forEach(function (series) {
                  series.update();
                });
              }
            }
          }
          sendNumber();
        };
        series.hideLoading();
      }
    }
    myFunc();
    return () => {
      if (client) {
        client.close();
      }
    };
  }, []);
  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [highchartProps?.["Input Flag"], highchartProps?.CULTURE]);
  React.useEffect(() => {
    if (chartRef.current) {
      updateAxisTitle(
        chartRef,
        highchartProps["Graph Axis Title Font Size (em)"]
      );
    }
  }, [highchartProps["Graph Axis Title Font Size (em)"]]);
  React.useEffect(() => {
    if (chartRef.current) {
      updateAxisValue(
        chartRef,
        highchartProps["Graph Axis Value Font Size (em)"]
      );
    }
  }, [highchartProps["Graph Axis Value Font Size (em)"]]);
  React.useEffect(() => {
    if (chartRef.current) {
      updateAxisAlignTick(
        chartRef,
        highchartProps["Show Enable Y-Axis Align Ticks"]
      );
    }
  }, [highchartProps["Show Enable Y-Axis Align Ticks"]]);
  React.useEffect(() => {
    if (chartRef.current) {
      updateAxisStartTick(
        chartRef,
        highchartProps["Show Enable Y-Axis Start On Ticks"]
      );
    }
  }, [highchartProps["Show Enable Y-Axis Start On Ticks"]]);
  React.useEffect(() => {
    if (chartRef.current) {
      updateAxisEndTick(
        chartRef,
        highchartProps["Show Enable Y-Axis End On Ticks"]
      );
    }
  }, [highchartProps["Show Enable Y-Axis End On Ticks"]]);
  React.useEffect(() => {
    if (chartRef.current) {
      updateSeries(chartRef, highchartProps);
    }
  }, [
    highchartProps?.["Color Flag"],
    highchartProps?.["Show Enable Custom Color"],
  ]);
  React.useEffect(() => {
    if (chartRef.current && !isMount) {
      updateSettings(chartRef, highchartProps);
    }
  }, [
    highchartProps?.["Settings Flag"],
    highchartProps?.["Show Boundaries"],
    highchartProps?.["Show Enable Manual Y-Axis Min/Max"],
  ]);

  return (
    <HighchartsReact
      ref={chartRef}
      highcharts={Highcharts}
      options={{
        constructorType: "stockChart",
        chart: {
          useGPUTranslations: true,
          width: width,
          height: height,
          zoomBySingleTouch: true,
          zoomType: "x",
          type: "line",
          reflow: true,
        },
        boost: {
          useGPUTranslations: true,
        },
        rangeSelector: {
          enabled: highchartProps["Show Enable Navbar"],
          buttonTheme: {
            fill: "none",
            stroke: "none",
            r: 8,
            style: {
              fontWeight: 100,
            },
          },
          buttons: [
            {
              type: "minute",
              count: 1,
              text: "1m",
            },
            {
              type: "minute",
              count: 5,
              text: "5m",
            },
            {
              type: "minute",
              count: 15,
              text: "15m",
            },
            {
              type: "minute",
              count: 30,
              text: "30m",
            },
            {
              type: "hour",
              count: 1,
              text: "1h",
            },
            {
              type: "hour",
              count: 6,
              text: "6h",
            },
            {
              type: "all",
              text: "All",
            },
          ],
          inputEnabled: false,
          selected: 6,
        },
        tooltip: {
          pointFormat: `<span>{series.name}</span>: <b>{point.y:.${
            highchartProps["Decimal Places"] === ""
              ? "0"
              : highchartProps["Decimal Places"]
          }f}</b><br/>`,
          shared: true,
        },
        exporting: {
          enabled: highchartProps["Show Enable Export"],
        },
        navigator: {
          adaptToUpdatedData: true,
          enabled: highchartProps["Show Enable Range Selector"],
          xAxis: {
            type: "datetime",
            lineWidth: 1,
            tickWidth: 2,
            ordinal: false,
            endOnTick: false,
            startOnTick: false,
          },
        },
        navigation: {
          buttonOptions: {
            verticalAlign: "top",
            y: -10,
            x: -1,
          },
        },

        legend: {
          enabled: highchartProps["Show Enable Graph Legend"],
          layout: "horizontal",
          itemStyle: {
            fontSize: highchartProps["Graph Legend Font Size (em)"]
              ? `${highchartProps["Graph Legend Font Size (em)"]}px`
              : "12px",
          },
        },
        title: {
          text: "",
        },
        xAxis: {
          type: "datetime",
          lineWidth: 1,
          tickWidth: 2,
          endOnTick: false,
          startOnTick: false,
          ordinal: false,
        },
        ...loading,
        ...responsiveLine,
        ...credits,
      }}
      constructorType={"stockChart"}
    />
  );
};

export default React.memo(LineCharts);
