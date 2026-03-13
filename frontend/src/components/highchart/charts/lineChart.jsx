import Highcharts from "highcharts/highstock";
import React from "react";

import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import boost from "highcharts/modules/boost";
import accessibility from "highcharts/modules/accessibility";
import { InfluxDB } from "@influxdata/influxdb-client";
import {
  influxUrl,
  liveBucket,
  influxToken,
  influxOrg,
} from "../../../services/baseApi";
import { showLoading, loading } from "../../overview/utils/loading";
import { addAxis } from "../../overview/utils/addAxis";
import { responsiveLine } from "../../overview/utils/responsive";
import { credits } from "../../overview/utils/credit";
import {
  updateAxisTitle,
  updateAxisValue,
  updateAxisAlignTick,
  updateAxisStartTick,
  updateAxisEndTick,
  updateSettings,
} from "../../overview/utils/updateYaxis";
import { webSocket } from "../../overview/utils/webSocket/liveData";

import { updateSeries } from "../../overview/utils/updateSeries";
import { useIsMount } from "../../../hooks/useIsMount";
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
    let ws = false;
    async function myFunc() {
      if (series) {
        let dataList = {};
        const aa = new Date().getTime();
        let query = `from(bucket: "${liveBucket}")
        |> range(start: -1d,stop: ${lastTime - 1})
        |> filter(fn: (r) => r["_field"] == "tag_value")
        |> filter(fn: (r) =>
      `;
        if (highchartProps?.Inputs)
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
        console.log(query);
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
            console.log(res);
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
            const cc = new Date().getTime();
            console.log(cc - aa);
            series.hideLoading();

            const refSecond =
              highchartProps?.["Widget Refresh (seconds)"] === ""
                ? 5
                : parseInt(highchartProps?.["Widget Refresh (seconds)"]);

            const tagName = highchartProps.Inputs.map((e) => e.NAME);
            const wsFunc = (data) => {
              console.log(data);
              Promise.all(
                data.map((e) => {
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
            };
            ws = new webSocket(lastTime, refSecond, tagName, wsFunc);
            ws.openWs();
          },
        });
      }
    }
    myFunc();
    return () => {
      if (ws) ws.closeWs();
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
