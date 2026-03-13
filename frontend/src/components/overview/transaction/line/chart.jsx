import Highcharts from "highcharts/highstock";
import React from "react";

import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import boost from "highcharts/modules/boost";
import accessibility from "highcharts/modules/accessibility";

import { updateAxisValue } from "../../utils/updateYaxis";

import { showLoading, loading } from "../../utils/loading";
import { responsiveLine } from "../../utils/responsive";
import { credits } from "../../utils/credit";
import { updateSeries } from "../../utils/updateSeries";
import { useIsMount } from "../../../../hooks/useIsMount";
import ItemService from "../../../../services/api/item";
import { useSelector } from "react-redux";
import UomService from "../../../../services/api/uom";
exporting(Highcharts);
accessibility(Highcharts);
data(Highcharts);
boost(Highcharts);

const LineCharts = ({ chartProps, width, height, chartType, updateUuid }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const isMount = useIsMount();
  const chartRef = React.createRef();
  React.useEffect(() => {
    const series = chartRef.current.chart;
    const myFunc = async () => {
      let res = await ItemService.getDowntimeDG({
        CULTURE,
        ITEM_ID: chartProps?.["Transaction Property"],
        EVENT_TYPE: chartProps?.Transaction,
      });
      console.log(res);
      let yAxiskey = {};
      await Promise.all(
        chartProps?.["Process Defination"].map(async (transaction, index) => {
          if (!yAxiskey.hasOwnProperty(`${transaction?.UOM}`)) {
            yAxiskey[`${transaction?.UOM}`] = index;
            try {
              const body = { CULTURE, CODE: transaction?.UOM };
              let res = await UomService.getUomCode(body);
              console.log(res);
              await series.addAxis(
                {
                  opposite: false,
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
        })
      );

      Promise.all(
        chartProps?.["Process Defination"].map((transaction) => {
          let data = [];
          Promise.all(
            res.data.map((e) => {
              if (e?.[transaction?.COLUMN_NAME])
                data.push([
                  parseInt(e.START_DATETIME),
                  parseFloat(e?.[transaction?.COLUMN_NAME]),
                ]);
            })
          );
          data.sort(function (a, b) {
            return a[0] - b[0];
          });

          var sonucDizisi = [];
          var oncekiTarih = null;

          for (var i = 0; i < data.length; i++) {
            var currentTarih = data[i][0];

            if (currentTarih !== oncekiTarih) {
              sonucDizisi.push(data[i]);
              oncekiTarih = currentTarih;
            }
          }
          series.addSeries(
            {
              yAxis: "yaxis-" + yAxiskey[`${transaction.UOM}`],
              name: transaction?.SHORT_LABEL,
              data: data,
            },
            true
          );
          series.redraw();
        })
      );
    };

    myFunc();
  }, []);
  React.useEffect(() => {
    if (chartRef.current) {
      updateAxisValue(chartRef, chartProps["Graph Axis Value Font Size (em)"]);
    }
  }, [chartRef["Graph Axis Value Font Size (em)"]]);
  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [chartProps?.["Input Flag"]]);
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
          enabled: chartProps["Show Enable Navbar"],
          buttonTheme: {
            // styles for the buttons
            fill: "none",
            stroke: "none",
            r: 8,
            style: {
              fontWeight: 100,
            },
          },
          inputEnabled: false,
          selected: 5,
          buttons: [
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
          pointFormat: `<span>{series.name}</span>: <b>{point.y:.${
            chartProps["Decimal Places"] === ""
              ? "0"
              : chartProps["Decimal Places"]
          }f}</b><br/>`,
          shared: true,
        },
        exporting: {
          enabled: chartProps["Show Enable Export"],
        },
        navigator: {
          adaptToUpdatedData: true,
          enabled: chartProps["Show Enable Range Selector"],
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
          enabled: chartProps["Show Enable Graph Legend"],
          layout: "horizontal",
          itemStyle: {
            fontSize: chartProps["Graph Legend Font Size (em)"]
              ? `${chartProps["Graph Legend Font Size (em)"]}px`
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
