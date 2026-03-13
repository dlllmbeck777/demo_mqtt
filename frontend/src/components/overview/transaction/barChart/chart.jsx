import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import drilldown from "highcharts/modules/drilldown";
import accessibility from "highcharts/modules/accessibility";
import boost from "highcharts/modules/boost";
import { showLoading, loading } from "../../utils/loading";
import ItemService from "../../../../services/api/item";
import { useIsMount } from "../../../../hooks/useIsMount";
import { useSelector } from "react-redux";
import UomService from "../../../../services/api/uom";
exporting(Highcharts);
data(Highcharts);
accessibility(Highcharts);
drilldown(Highcharts);
boost(Highcharts);
const Bar = ({ chartProps, width, height, updateUuid }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const isMount = useIsMount();
  const chartRef = React.createRef();

  React.useEffect(() => {
    const series = chartRef.current.chart;
    console.log(series);
    const loadData = async () => {
      try {
        if (series) {
          let yAxiskey = {};
          console.log(series);
          let res = await ItemService.chartStatusGet({
            CULTURE,
            ITEM_ID: chartProps?.["Transaction Property"],
            EVENT_TYPE: chartProps?.Transaction,
          });
          console.log(res);
          let seriesData = {};
          console.log(chartProps?.["Process Defination"]);
          series.yAxis[0].update({
            title: {
              text: null,
            },
            labels: {
              enabled: false,
            },
            visible: false,
          });
          await Promise.all(
            chartProps?.["Process Defination"].map(
              async (transaction, index) => {
                if (!yAxiskey.hasOwnProperty(`${transaction?.UOM}`)) {
                  yAxiskey[`${transaction?.UOM}`] = index;
                  console.log("AAAAAAAAAAAA");
                  try {
                    const body = { CULTURE, CODE: transaction?.UOM };
                    let res = await UomService.getUomCode(body);
                    console.log(res);
                    await series.addAxis(
                      {
                        id: "yaxis-" + index,
                        name: transaction,
                        title: {
                          text: res?.data?.[0]?.CATALOG_SYMBOL
                            ? `${res?.data?.[0]?.QUANTITY_TYPE} (${res?.data?.[0]?.CATALOG_SYMBOL})`
                            : "Undefined (UoM)",
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
                  } catch (err) {
                    console.log(err);
                    series.addAxis({
                      id: "yaxis-" + index,
                      name: transaction,
                      title: {
                        text: res?.data?.[0]?.CATALOG_SYMBOL
                          ? `${res?.data?.[0]?.QUANTITY_TYPE} (${res?.data?.[0]?.CATALOG_SYMBOL})`
                          : "Undefined (UoM)",
                      },
                      yAxis: "yaxis-" + yAxiskey[`${transaction?.UOM}`],
                    });
                  }
                }
                if (seriesData[`${transaction?.UOM}`] === undefined)
                  seriesData[`${transaction?.UOM}`] = [];
                console.log(seriesData[`${transaction?.UOM}`]);
              }
            )
          );
          let allData = await ItemService.getDowntimeDG({
            CULTURE,
            ITEM_ID: chartProps?.["Transaction Property"],
            EVENT_TYPE: chartProps?.Transaction,
          });
          console.log(allData);
          Promise.all(
            chartProps?.["Process Defination"].map((transaction, index) => {
              let data = [];
              Promise.all(
                allData.data.reverse().map((e) => {
                  if (!isNaN(parseFloat(e?.[transaction?.COLUMN_NAME])))
                    data.push([
                      e.START_DATETIME,
                      parseFloat(e?.[transaction?.COLUMN_NAME]),
                    ]);
                  data.push([e.START_DATETIME, 0]);
                })
              );
              Promise.all(
                data.sort(function (a, b) {
                  return a[0] - b[0];
                })
              );
              series.addSeries({
                name: transaction.SHORT_LABEL,
                yAxis: "yaxis-" + yAxiskey[`${transaction?.UOM}`],
                data: data,
                dataGrouping: {
                  enabled: true,
                  units: [["month", [1]]],
                  approximation: "average",
                },
              });
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadData();
  }, []);
  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [chartProps?.["Input Flag"]]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={chartRef}
      options={{
        chart: {
          type: "column",
          width: width,
          height: height,
          zoomBySingleTouch: true,
          zoomType: "x",
          reflow: true,
          adaptToUpdatedData: true,
          events: {
            // drilldown: async function (e) {
            //   if (!e.seriesOptions) {
            //     var chart = this;
            //     showLoading(chart);
            //     let res = await ItemService.getDowntimeDG({
            //       CULTURE,
            //       ITEM_ID: chartProps?.["Transaction Property"],
            //       EVENT_TYPE: chartProps?.Transaction,
            //     });
            //     let data = [];
            //     let dataType = "";
            //     await Promise.all(
            //       chartProps?.["Process Defination"].map((transaction) => {
            //         if (transaction?.SHORT_LABEL === e.point.name)
            //           dataType = transaction?.COLUMN_NAME;
            //       })
            //     );
            //     await Promise.all(
            //       res.data
            //         .filter((val) => val.VAL21 !== null)
            //         .sort((a, b) => a.START_DATETIME - b.START_DATETIME)
            //         .reduce((uniqueData, val) => {
            //           const isDuplicate = uniqueData.some(
            //             (uniqueVal) =>
            //               uniqueVal.START_DATETIME === val.START_DATETIME
            //           );
            //           if (!isDuplicate) {
            //             uniqueData.push([
            //               val.START_DATETIME + 18000000,
            //               parseInt(val[dataType]),
            //             ]);
            //           }
            //           return uniqueData;
            //         }, data)
            //     );
            //     console.log(data);
            //     chart.addSingleSeriesAsDrilldown(e.point, {
            //       yAxis: "yaxis-" + 0,
            //       type: "line",
            //       name: e.point.name,
            //       id: e.point.name,
            //       color: "green",
            //       data: data,
            //       boostThreshold: 1,
            //       xAxis: 0,
            //     });
            //     chart.xAxis[0].update({
            //       visible: true,
            //     });
            //     chart.xAxis[1].update({
            //       visible: false,
            //     });
            //     chart.hideLoading();
            //     chart.applyDrilldown();
            //   }
            // },
            // drillup: async function (e) {
            //   this.xAxis[0].update({
            //     visible: false,
            //   });
            //   this.xAxis[1].update({
            //     visible: true,
            //   });
            //   this.update({
            //     rangeSelector: {
            //       enabled: false,
            //     },
            //   });
            // },
          },
        },
        title: {
          text: "",
        },
        rangeSelector: {
          enabled: true,
          buttonTheme: {
            fill: "none",
            stroke: "none",
            r: 8,
            style: {
              fontWeight: 100,
            },
          },
          selected: 0,
          buttons: [
            {
              type: "month",
              count: 2,
              text: "3m",
            },
            {
              type: "month",
              count: 5,
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
          inputEnabled: false,
          events: {
            click: function (event) {
              // Seçilen zaman aralığını veya butonu işleme koymak için buraya kod ekleyin
              console.log("Button Clicked:", event);
            },
          },
        },
        xAxis: {
          type: "datetime",
          visible: true,
        },
        navigator: {
          adaptToUpdatedData: true,
          enabled: true,
          xAxis: {
            type: "datetime",
            lineWidth: 1,
            tickWidth: 2,
            ordinal: false,
            endOnTick: false,
            startOnTick: false,
          },
        },
        legend: {
          enabled: true,
          layout: "horizontal",
        },
        exporting: {
          enabled: chartProps["Show Enable Export"],
        },

        credits: {
          enabled: false,
        },
        ...loading,
        constructorType: "stockChart",
      }}
      // constructorType={"stockChart"}
    />
  );
};
export default React.memo(Bar);
