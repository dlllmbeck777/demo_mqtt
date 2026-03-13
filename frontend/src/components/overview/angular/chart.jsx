import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import exporting from "highcharts/modules/exporting";
import { dateFormatDDMMYYHHMMSS } from "../../../services/utils/dateFormatter";

import { webSocket } from "../utils/webSocket/lastData";
exporting(Highcharts);
const Angular = ({ highchartProps, width, height }) => {
  const [categories, setCategories] = React.useState("");
  const [value, setValue] = React.useState("");
  let i = 0;
  let plotBands = [];
  while (i < parseInt(highchartProps.Stops)) {
    plotBands.push({
      from: parseFloat(highchartProps[`[${i}] Low`]),
      to: parseFloat(highchartProps[`[${i}] High`]),
      color: highchartProps[`[${i}] Color`],
      thickness: 20,
    });
    i++;
  }
  React.useEffect(() => {
    const refSecond =
      highchartProps?.["Widget Refresh (seconds)"] === ""
        ? 5
        : parseInt(highchartProps?.["Widget Refresh (seconds)"]);

    const tagName = highchartProps?.Measurement?.[0].NAME;
    const wsFunc = (data) => {
      setCategories((prev) => Date.parse(data["_time"]+18000000));
      setValue((prev) => data["_value"]);
    };
    const ws = new webSocket(refSecond, tagName, wsFunc);
    ws.openWs();
    return () => {
      ws.closeWs();
    };
  }, [highchartProps.Measurement, highchartProps["Widget Refresh (seconds)"]]);
  const options = {
    chart: {
      type: "gauge",
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: "80%",
    },
    credits: {
      enabled: highchartProps["Show Timestamp"],
      position: {
        align: "center",
      },
      style: {
        fontSize: highchartProps["Time Stamp Font Size"]
          ? highchartProps["Time Stamp Font Size"]
          : 12,
      },
      text:
        categories === "" ? "" : dateFormatDDMMYYHHMMSS(new Date(categories)),
      href: null,
    },
    title: {
      text:
        highchartProps?.Measurement?.[0] && highchartProps["Show Tag Name"]
          ? highchartProps?.Measurement?.[0].SHORT_NAME
          : "",
      style: {
        fontSize: highchartProps["Tag Name Font Size"]
          ? highchartProps["Tag Name Font Size"]
          : "12px",
      },
    },

    pane: {
      startAngle: -150,
      endAngle: 150,
      background: null,
      center: ["50%", "50%"],
      size: "80%",
      zIndex: 0,
    },
    exporting: {
      enabled: highchartProps["Show Enable Export"],
    },
    navigation: {
      buttonOptions: {
        verticalAlign: "top",
        y: -10,
        x: -1,
      },
    },
    // the value axis
    yAxis: {
      min: highchartProps?.Minimum ? parseFloat(highchartProps?.Minimum) : 0,
      max: highchartProps?.Maximum ? parseFloat(highchartProps?.Maximum) : 2000,
      tickPixelInterval: 72,
      tickPosition: "inside",
      tickColor: Highcharts.defaultOptions.chart.backgroundColor || "#FFFFFF",
      tickLength: 20,
      tickWidth: 2,
      minorTickPosition: "inside",
      labels: {
        distance: -40,
        rotation: "auto",
        style: {
          fontSize: "14px",
        },
      },

      plotBands: [...plotBands],
    },

    series: [
      {
        name: "Value",
        data: [
          parseFloat(
            parseFloat(value).toFixed(
              highchartProps["Decimal Places"] === ""
                ? 0
                : highchartProps["Decimal Places"]
            )
          ),
        ],
        tooltip: {
          valueSuffix: ` ${
            highchartProps?.Measurement?.[0] &&
            highchartProps["Show Unit of Measurement"]
              ? highchartProps?.Measurement?.[0].CATALOG_SYMBOL
              : ""
          }`,
        },
        dataLabels: {
          format: `<span class="highchart-angular-solid-data-label"><span style="font-size: ${
            highchartProps["Value Font Size"]
              ? highchartProps["Value Font Size"]
              : "9"
          }px">${
            highchartProps["Show Measurement"] ? "{y}" : ""
          }</span> <span style="font-size: ${
            highchartProps["UoM Font Size"]
              ? highchartProps["UoM Font Size"]
              : "9"
          }px"> ${
            highchartProps?.Measurement?.[0] &&
            highchartProps["Show Unit of Measurement"]
              ? `(${highchartProps?.Measurement?.[0].CATALOG_SYMBOL})`
              : ""
          }  </span></span>`,
          borderWidth: 0,
          useHTML: true,
          zIndex: 2231,
          color:
            (Highcharts.defaultOptions.title &&
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color) ||
            "#333333",
          style: {
            zIndex: 67,
          },
        },
        dial: {
          radius: "80%",
          backgroundColor: "gray",
          baseWidth: 12,
          baseLength: "0%",
          rearLength: "0%",
        },
        pivot: {
          backgroundColor: "gray",
          radius: 8,
        },
      },
    ],
  };
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        ...options,
        chart: {
          ...options.chart,
          width: width,
          height: height - 15,
        },
      }}
    />
  );
};
export default React.memo(Angular);
