import Highcharts from "highcharts/highstock";
import React from "react";

import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import boost from "highcharts/modules/boost";
import accessibility from "highcharts/modules/accessibility";
import { InfluxDB } from "@influxdata/influxdb-client";
import { wsBaseUrl } from "../../../../services/baseApi";
import {
  anomalyBucket,
  influxUrl,
  influxToken,
  influxOrg,
} from "../../../../services/baseApi";
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
var W3CWebSocket = require("websocket").w3cwebsocket;
exporting(Highcharts);
accessibility(Highcharts);
data(Highcharts);
boost(Highcharts);

const LineCharts = ({
  highchartProps,
  width,
  height,
  chartType,
  updateUuid,
}) => {
  const isMount = useIsMount();
  const chartRef = React.createRef();
  React.useEffect(() => {
    const lastTime = Math.floor(new Date().getTime() / 1000) - 10;
    let yAxiskey = {};
    const series = chartRef.current.chart;
    let queryPromise;
    showLoading(series);
    let client;
    async function myFunc() {
      if (series) {
        let dataList = {};
        let query = `from(bucket: "${anomalyBucket}")
        |> range(start: -1d,stop: ${lastTime - 1})
        |> filter(fn: (r) => r["_field"] == "tag_value")
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
              addAxis(series, highchartProps, tag, i);
            }
          })
        );
        query = query + ")";

        let res = [];
        const queryApi = await new InfluxDB({
          url: influxUrl,
          token: influxToken,
        }).getQueryApi(influxOrg);
        queryPromise = await queryApi.queryRows(query, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            res.push(o);
          },
          complete() {
            Promise.all(
              res.map((val, i) => {
                if (val["tag_quality"] === "100") {
                  // if (i % 31 === 0)
                  dataList[val._measurement].push({
                    x: Date.parse(val["_time"]) + 18000000,
                    y: val["_value"],
                    color: "red",
                  });
                } else {
                  dataList[val._measurement].push({
                    x: Date.parse(val["_time"]) + 18000000,
                    y: val["_value"],
                    color: "transparent",
                  });
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
                    radius: 4,
                  },
                  color: highchartProps["Show Enable Custom Color"]
                    ? highchartProps[`[${tag.NAME}] Color`]
                    : "",
                  data: [],
                });
                // for (var i = 0; i < temizlenmisListe.length; i += 1000) {
                //   series
                //     .get(tag.NAME)
                //     .setData(temizlenmisListe.slice(i, i + 1000));
                // }

                Promise.all(
                  dataList[tag.NAME].sort(function (a, b) {
                    return a["x"] - b["x"];
                  })
                );

                var benzersizXValues = new Set();

                var temizlenmisListe = dataList[tag.NAME].filter(function (
                  nokta
                ) {
                  if (!benzersizXValues.has(nokta.x)) {
                    series.get(tag.NAME).addPoint(nokta, false, false, false);

                    benzersizXValues.add(nokta.x);
                    return true;
                  }
                  return false;
                });
                series.series.forEach(function (series) {
                  series.update();
                });
              })
            );

            series.hideLoading();
            client = new W3CWebSocket(
              `${wsBaseUrl}/ws/tags/anomaly/${lastTime}/${
                highchartProps["Widget Refresh (seconds)"] === ""
                  ? 10
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
                      jsonData.map((e, i) => {
                        if (e["tag_quality"] === "100")
                          if (i % 2 === 0) {
                            series.get(e._measurement).addPoint(
                              {
                                x: Date.parse(e["_time"]) + 18000000,
                                y: e["_value"],
                                color: "red",
                              },
                              false,
                              false,
                              false
                            );
                          } else {
                            series
                              .get(e._measurement)
                              .addPoint(
                                [
                                  Date.parse(e["_time"]) + 18000000,
                                  e["_value"],
                                ],
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
          },
          error(error) {
            series.hideLoading();
            console.log("query failed- ", error);
          },
        });
      }
    }
    myFunc();
    return () => {
      if (client) {
        client.close();
      }
      if (queryPromise) {
        queryPromise.cancel();
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
          type: chartType,
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
