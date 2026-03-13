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
exporting(Highcharts);
accessibility(Highcharts);
data(Highcharts);
boost(Highcharts);

const CandleStick = ({ highchartProps, width, height }) => {
  const chartRef = React.createRef();
  React.useEffect(() => {
    let yAxiskey = {};
    const series = chartRef.current.chart;
    async function myFunc() {
      if (chartRef.current) {
        let dataList = {};
        let text = ``;
        Promise.all(
          highchartProps.Inputs.map((tag, i) => {
            if (i !== 0) text = text + " or ";
            text = text + `r["_measurement"] == "${tag.NAME}"`;
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
        text = text + ")";
        let list = { min: false, max: false, first: false, last: false };
        for (let i = 0; i < Object.keys(list).length; i++) {
          let query = `from(bucket: "${backfillBucket}")
            |> range(start: 0,stop:-1d)
            |> filter(fn: (r) => r["_field"] == "tag_value")
            |> aggregateWindow(column: "_value",every: 1d, fn: ${
              Object.keys(list)[i]
            }, createEmpty: false)
            |> filter(fn: (r) =>${text}
          `;
          let res = [];
          const queryApi = await new InfluxDB({
            url: influxUrl,
            token: influxToken,
          }).getQueryApi(influxOrg);
          queryApi.queryRows(query, {
            next(row, tableMeta) {
              const o = tableMeta.toObject(row);
              res.push(o);
            },
            complete() {
              Promise.all(
                res.map((val) => {
                  dataList[val._measurement] = {
                    ...dataList[val._measurement],
                    [val["_time"]]: {
                      ...dataList[val._measurement]?.[val["_time"]],
                      [Object.keys(list)[i]]: val["_value"],
                      time: val["_time"],
                    },
                  };
                })
              );
              list[Object.keys(list)[i]] = true;
              if ((list.min, list.max, list.first, list.last)) {
                highchartProps.Inputs.map((tag) => {
                  let data = [];
                  Promise.all(
                    Object.values(dataList[tag.NAME]).map((e) => {
                      let temp = [];
                      temp.push(Date.parse(e.time));
                      temp.push(e.first);
                      temp.push(e.max);
                      temp.push(e.min);
                      temp.push(e.last);
                      data.push(temp);
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

                    data: data,
                  });
                });
              }
            },
            error(error) {
              console.log("query failed- ", error);
            },
          });
        }
      }
    }
    myFunc();
  }, []);
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
          type: "candlestick",
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
          buttonTheme: {
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
      }}
      ref={chartRef}
      constructorType={"stockChart"}
    />
  );
};

export default React.memo(CandleStick);
