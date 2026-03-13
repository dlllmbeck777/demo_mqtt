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
  backfillBucket,
  influxToken,
  influxOrg,
} from "../../../services/baseApi";

import { showLoading, loading } from "../../overview/utils/loading";
import { addAxis } from "../../overview/utils/addAxis";
import { credits } from "../../overview/utils/credit";
import { responsiveLine } from "../../overview/utils/responsive";
import {
  updateAxisTitle,
  updateAxisValue,
  updateAxisAlignTick,
  updateAxisStartTick,
  updateAxisEndTick,
  updateSettings,
} from "../../overview/utils/updateYaxis";
import { updateSeries } from "../../overview/utils/updateSeries";
import { useIsMount } from "../../../hooks/useIsMount";
exporting(Highcharts);
accessibility(Highcharts);
data(Highcharts);
boost(Highcharts);
const BackFill = ({ highchartProps, width, height, chartType, updateUuid }) => {
  const isMount = useIsMount();
  const lastTime = Math.floor(new Date().getTime() / 1000) - 10;
  const [loadings, setLoadings] = React.useState(0);
  const [timeDifference, setTimeDifference] = React.useState();
  const chartRef = React.createRef();
  function difference(tarih1, tarih2) {
    const date1 = new Date(tarih1);
    const date2 = new Date(tarih2);

    const yil1 = date1.getFullYear();
    const ay1 = date1.getMonth();
    const yil2 = date2.getFullYear();
    const ay2 = date2.getMonth();

    const farkYil = yil2 - yil1;
    const farkAy = ay2 - ay1;

    return farkYil * 12 + farkAy;
  }
  async function asyncFetchFunction(time) {
    var series = chartRef.current.chart;
    let res = [];
    let query = `from(bucket: "${backfillBucket}")
      |> range(start: -${(time + 1) * 15}d,stop: -${time * 15}d)
      |> filter(fn: (r) => r["_field"] == "tag_value")
      |> aggregateWindow(every: 12h, fn: mean, createEmpty: false)
      |> filter(fn: (r) => 
    `;
    Promise.all(
      highchartProps.Inputs.map((tag, i) => {
        if (i !== 0) query = query + " or ";
        query = query + `r["_measurement"] == "${tag.NAME}"`;
      })
    );
    query = query + ")";
    const queryApi = await new InfluxDB({
      url: influxUrl,
      token: influxToken,
    }).getQueryApi(influxOrg);
    await queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        res.push(o);
      },
      complete() {
        setLoadings((prev) => prev + 100 / (timeDifference * 2));

        let dataList = {};

        Promise.all(
          res.map((val) => {
            if (dataList[val._measurement])
              dataList[val._measurement].push([
                Date.parse(val["_time"]) + 18000000,
                val["_value"],
              ]);
            else {
              dataList[val._measurement] = [];
              dataList[val._measurement].push([
                Date.parse(val["_time"]) + 18000000,
                val["_value"],
              ]);
            }
          })
        );
        if (series?.series?.length > 0) {
          series?.series.map((e) => {
            highchartProps.Inputs.map((tag) => {
              if (e.name === tag.SHORT_NAME) {
                let newData = [...e.options.data, ...dataList?.[tag.NAME]];
                Promise.all(
                  newData.sort(function (a, b) {
                    return a[0] - b[0];
                  })
                );
                // e.setVisible(false);
                e.setData(newData, false, false);
              }
            });
          });
        }
      },
      error(error) {
        console.log("query failed- ", error);
        setLoadings((prev) => prev + +100 / (timeDifference * 2));
      },
    });
  }

  React.useEffect(() => {
    if (!isMount) {
      [...Array(timeDifference * 2)].map((e, i) => {
        asyncFetchFunction(i);
      });
    }
  }, [timeDifference]);

  React.useEffect(() => {
    console.log(loadings);
    if (loadings === 100) {
      var series = chartRef.current.chart;
      series.hideLoading();
      // Promise.all(
      //   series?.series.map((e) => {
      //     e.setVisible(true, false);
      //   })
      // );
      // series.redraw();
    }
  }, [loadings]);

  async function myFunc() {
    var series = chartRef.current.chart;
    showLoading(series);

    let res = [];
    let query = `from(bucket: "${backfillBucket}")
      |> range(start: 0,stop: ${lastTime - 1})
      |> filter(fn: (r) => r["_field"] == "tag_value")
      |> first()
      |> filter(fn: (r) => 
    `;
    if (highchartProps?.Inputs)
      Promise.all(
        highchartProps.Inputs.map((tag, i) => {
          if (i !== 0) query = query + " or ";
          query = query + `r["_measurement"] == "${tag.NAME}"`;
        })
      );
    query = query + ")";
    const queryApi = await new InfluxDB({
      url: influxUrl,
      token: influxToken,
    }).getQueryApi(influxOrg);
    await queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        res.push(o);
      },
      complete() {
        setTimeDifference(
          difference(Date.parse(res?.[0]?._time), lastTime * 1000)
        );
      },
      error(error) {
        console.log("query failed- ", error);
      },
    });
  }

  React.useEffect(() => {
    var series = chartRef.current.chart;
    let yAxiskey = {};
    if (highchartProps?.Inputs)
      Promise.all(
        highchartProps.Inputs.map((tag, i) => {
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
    if (highchartProps?.Inputs)
      Promise.all(
        highchartProps.Inputs.map((tag) => {
          series.addSeries({
            dataGrouping: {
              enabled: false,
            },
            yAxis:
              "yaxis-" +
              yAxiskey[`${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`],
            name: tag.SHORT_NAME,
            id: tag.NAME,
            color: highchartProps["Show Enable Custom Color"]
              ? highchartProps[`[${tag.NAME}] Color`]
              : "",
            data: [],
          });
        })
      );

    myFunc();
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
          zoomBySingleTouch: true,
          zoomType: "x",
          type: chartType,
          width: width,
          height: height,
          boost: {
            enabled: true,
            useGPUTranslations: true,
            // seriesThreshold: 1,
          },
        },
        boost: {
          enabled: true,
          useGPUTranslations: true,
          // seriesThreshold: 1,
        },

        plotOptions: {
          series: {
            showInNavigator: true,
          },
        },

        rangeSelector: {
          enabled: highchartProps["Show Enable Navbar"],
          buttonTheme: {
            // styles for the buttons
            fill: "none",
            stroke: "none",
            r: 8,
            style: {
              fontWeight: 100,
            },
          },

          selected: 6,
          buttons: [
            {
              type: "day",
              count: 1,
              text: "1d",
            },
            {
              type: "week",
              count: 1,
              text: "1w",
            },
            {
              type: "month",
              count: 1,
              text: "1m",
            },
            {
              type: "month",
              count: 3,
              text: "3m",
            },
            {
              type: "month",
              count: 6,
              text: "6m",
            },
            {
              type: "year",
              count: 1,
              text: "1y",
            },
            {
              type: "all",
              text: "All",
            },
          ],
        },

        tooltip: {
          borderWidth: 0,
        },
        exporting: {
          enabled: highchartProps["Show Enable Export"],
          // buttons: {
          //   contextButton: {
          //     menuItems: [
          //       {
          //         text: "Print Chart",
          //         onclick: function () {
          //           this.print();
          //         },
          //       },
          //       {
          //         text: "View in Full Screen",
          //         onclick: function () {
          //           this.fullscreen.toggle();
          //         },
          //       },
          //       "downloadPNG",
          //       "downloadJPEG",
          //       "downloadPDF",
          //       "downloadSVG",
          //       {
          //         text: "Change Time Interval",
          //       },
          //     ],
          //   },
          // },
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
            theme: {
              fill: "transparent",
            },
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
        ...credits,
        ...loading,
        ...responsiveLine,
      }}
      constructorType={"stockChart"}
    />
  );
};

export default React.memo(BackFill);
