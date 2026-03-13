import Highcharts from "highcharts/highstock";
import React from "react";

import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import boost from "highcharts/modules/boost";
import accessibility from "highcharts/modules/accessibility";
import { InfluxDB } from "@influxdata/influxdb-client";
import { wsBaseUrl } from "../../../services/baseApi";
import {
  influxUrl,
  liveBucket,
  influxToken,
  influxOrg,
} from "../../../services/baseApi";
var W3CWebSocket = require("websocket").w3cwebsocket;
exporting(Highcharts);
accessibility(Highcharts);
data(Highcharts);
boost(Highcharts);

const LineCharts = ({ highchartProps, width, height }) => {
  const chartRef = React.createRef();
  React.useEffect(() => {
    const lastTime = Math.floor(new Date().getTime() / 1000) - 10;
    let yAxiskey = {};
    const series = chartRef.current.chart;
    let client;
    async function myFunc() {
      if (chartRef.current) {
        let dataList = {};
        let query = `from(bucket: "${liveBucket}")
        |> range(start: -2d,stop: ${lastTime - 1})
        |> filter(fn: (r) => r["_field"] == "tag_value")
        |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
        |> filter(fn: (r) =>
      `;
        Promise.all(
          highchartProps.Inputs.map((tag, i) => {
            if (i !== 0) query = query + " or ";
            query = query + `r["_measurement"] == "${tag.NAME}"`;
            dataList[tag.NAME] = [];

            if (
              !yAxiskey.hasOwnProperty(
                `${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`
              )
            ) {
              yAxiskey[`${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`] = i;
              series.addAxis(
                {
                  id: "yaxis-" + i,
                  opposite: false,
                  title: {
                    text: tag.CATALOG_SYMBOL
                      ? `${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`
                      : "Undefined (UoM)",
                    style: {
                      fontSize:
                        highchartProps["Graph Axis Title Font Size (em)"] === ""
                          ? "11px"
                          : `${highchartProps["Graph Axis Title Font Size (em)"]}px`,
                    },
                  },
                  labels: {
                    style: {
                      fontSize:
                        highchartProps["Graph Axis Value Font Size (em)"] === ""
                          ? 11
                          : highchartProps["Graph Axis Value Font Size (em)"],
                    },
                  },
                  events: {
                    afterSetExtremes: function (e) {
                      if (e.min === e.max) {
                        this.update({
                          labels: {
                            enabled: false,
                          },
                          title: {
                            enabled: false,
                          },
                        });
                      } else {
                        this.update({
                          labels: {
                            enabled: true,
                          },
                          title: {
                            enabled: true,
                          },
                        });
                      }
                    },
                  },
                },
                false
              );
            }
          })
        );
        query = query + ")";
        let res = [];
        const queryApi = await new InfluxDB({
          url: influxUrl,
          token: influxToken,
        }).getQueryApi(influxOrg);
        await queryApi.queryRows(query, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            //push rows from query into an array object
            res.push(o);
          },
          complete() {
            Promise.all(
              res.map((val) => {
                dataList[val._measurement].push([
                  Date.parse(val["_time"]) + 18000000,
                  val["_value"],
                ]);
              })
            );
            Promise.all(
              highchartProps.Inputs.map((tag) => {
                Promise.all(
                  dataList[tag.NAME].sort(function (a, b) {
                    return a[0] - b[0];
                  })
                );
                series.addSeries({
                  yAxis:
                    "yaxis-" +
                    yAxiskey[`${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`],
                  name: tag.SHORT_NAME,
                  id: tag.NAME,
                  color: highchartProps["Show Enable Custom Color"]
                    ? highchartProps[`[${tag.NAME}] Color`]
                    : "",

                  data: dataList[tag.NAME],
                });
              })
            );
            client = new W3CWebSocket(
              `${wsBaseUrl}/ws/tags/${lastTime}/${
                highchartProps["Widget Refresh (seconds)"] === ""
                  ? 30
                  : parseInt(highchartProps["Widget Refresh (seconds)"])
              }/`
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
                      jsonData.map((e) => {
                        series
                          .get(e._measurement)
                          .addPoint(
                            [Date.parse(e["_time"]) + 18000000, e["_value"]],
                            false,
                            false,
                            false
                          );
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
          },
          error(error) {
            console.log("query failed- ", error);
          },
        });
      }
      // return true;
    }
    myFunc();

    return () => {
      if (client) client.close();
    };
  }, []);

  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chart.yAxis.map((e) => {
        e.update({
          title: {
            style: {
              fontSize:
                highchartProps["Graph Axis Title Font Size (em)"] === ""
                  ? "11px"
                  : `${highchartProps["Graph Axis Title Font Size (em)"]}px`,
            },
          },
          labels: {
            style: {
              fontSize:
                highchartProps["Graph Axis Value Font Size (em)"] === ""
                  ? 11
                  : highchartProps["Graph Axis Value Font Size (em)"],
            },
          },
        });
      });
    }
  }, [
    highchartProps["Graph Axis Value Font Size (em)"],
    highchartProps["Graph Axis Title Font Size (em)"],
  ]);

  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chart.series.map((e) => {
        console.log(e);
        e.update({
          color: highchartProps["Show Enable Custom Color"]
            ? highchartProps[`[${e.userOptions.id}] Color`]
            : "",
        });
      });
    }
  }, [highchartProps]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        constructorType: "stockChart",
        chart: {
          useGPUTranslations: true,
          width: width,
          height: height,
          zoomBySingleTouch: true,
          zoomType: "x",
          type: "scatter",
          reflow: true,
        },
        boost: {
          useGPUTranslations: true,
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 1000,
              },
              chartOptions: {
                rangeSelector: {
                  dropdown: "always",
                },
              },
            },
          ],
        },
        rangeSelector: {
          enabled: highchartProps["Show Enable Navbar"],
          // inputEnabled: true,
          buttonTheme: {
            // styles for the buttons
            fill: "none",
            stroke: "none",
            r: 8,
            style: {
              fontWeight: 100,
            },
          },

          inputBoxWidth: 120,
          inputBoxHeight: 18,
          inputStyle: {
            fontWeight: 100,
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
              type: "day",
              count: 1,
              text: "1d",
            },
            {
              type: "all",
              text: "All",
            },
          ],
          selected: 7,
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          borderWidth: 0,
        },
        exporting: {
          enabled: highchartProps["Show Enable Export"],
        },
        navigator: {
          adaptToUpdatedData: true,
          enabled: highchartProps["Show Enable Range Selector"],
          xAxis: {
            type: "datetime",
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
      }}
      ref={chartRef}
      constructorType={"stockChart"}
    />
  );
};

export default React.memo(LineCharts);
