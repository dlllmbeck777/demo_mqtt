import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import exporting from "highcharts/modules/exporting";
import { dateFormatDDMMYYHHMMSS } from "../../../services/utils/dateFormatter";
import "../../../assets/styles/page/overview/chartContainer.scss";
import { webSocket } from "../utils/webSocket/lastData";
exporting(Highcharts);
highchartsMore(Highcharts);
solidGauge(Highcharts);
export const Solid = ({ highchartProps, width, height }) => {
  const [categories, setCategories] = React.useState("");
  const [value, setValue] = React.useState("");
  let i = 0;
  let stops = [];
  let stopsBorders = [];
  function intToPercent(number) {
    let max = highchartProps?.["Maximum"]
      ? parseFloat(highchartProps?.["Maximum"])
      : 2000;
    let min = highchartProps?.["Minimum"]
      ? parseFloat(highchartProps?.["Minimum"])
      : 0;

    let mynum = max - min;

    return (100 * (parseFloat(number) - min)) / mynum / 100;
  }

  function percentToInt(number) {
    let max = highchartProps?.["Maximum"]
      ? parseFloat(highchartProps?.["Maximum"])
      : 2000;
    let min = highchartProps?.["Minimum"]
      ? parseFloat(highchartProps?.["Minimum"])
      : 0;
    let myNum = number * 100;
    console.log(highchartProps?.Measurement?.[0].SHORT_NAME +  '  MAX ************* <<<<<<<<<<<<<<<<< ' + max);
    console.log(highchartProps?.Measurement?.[0].SHORT_NAME +  '  MIN ************* <<<<<<<<<<<<<<<<< ' + min);
    console.log(highchartProps?.Measurement?.[0].SHORT_NAME +  '  MyNUM ************* <<<<<<<<<<<<<<<<< ' + myNum);
    return (myNum * max) / 100;
  }

  while (i < parseInt(highchartProps.Stops)) {
    if (highchartProps.Stops !== "" && highchartProps.Stops !== "0") {
      if (i === 0) {
        stops.push([0, highchartProps[`[${i}] Color`]]);
      } else {
        stops.push([
          intToPercent(highchartProps[`[${i - 1}] Stops`]),
          highchartProps[`[${i}] Color`],
        ]);
      }
      stops.push([
        intToPercent(highchartProps[`[${i}] Stops`]),
        highchartProps[`[${i}] Color`],
      ]);
    }
    i++;
  }
  let count = 0;
  while (count < stops.length) {
    if (count % 2 !== 0) {
      stopsBorders.push({
        backgroundColor: stops[count][1],
        from: percentToInt(stops[count - 1][0]),
        to: percentToInt(stops[count][0]),
        outerRadius: "108%",
        innerRadius: "60%",
        borderWidth: 0,
        shape: "arc",
      });
    }
    count++;
  }
  console.log(highchartProps?.Measurement?.[0].SHORT_NAME +  '   COUNT ?????????????????????????????????????? : ' + count);
  React.useEffect(() => {
    const refSecond =
      highchartProps?.["Widget Refresh (seconds)"] === ""
        ? 5
        : parseInt(highchartProps?.["Widget Refresh (seconds)"]);

    const tagName = highchartProps?.Measurement?.[0].NAME;
    console.log(tagName);
    console.log('SHORT_NAME --------------------------------- ' + highchartProps?.Measurement?.[0].SHORT_NAME);
    console.log('CATALOG_SYMBOL' + highchartProps?.Measurement?.[0].CATALOG_SYMBOL);
    const wsFunc = (data) => {
      setCategories((prev) => Date.parse(data["_time"]) + 18000000);
      setValue((prev) => data["_value"]);
    };
    console.log('wsFunc -------------------------------- ....................... ' + wsFunc);
    console.log(highchartProps?.Measurement?.[0].SHORT_NAME +  '  STOP ========================================================== ' + stop);
    const ws = new webSocket(refSecond, tagName, wsFunc);
    ws.openWs();
    return () => {
      ws.closeWs();
    };
  }, [highchartProps.Measurement, highchartProps["Widget Refresh (seconds)"]]);
  const options = {
    chart: {
      type: "solidgauge",
    },
    credits: {
      enabled: highchartProps["Show Timestamp"],
      position: {
        align: "center",
        verticalAlign: "bottom",
      },
      style: {
        fontSize: highchartProps["Time Stamp Font Size"]
          ? highchartProps["Time Stamp Font Size"]
          : 12,
        // paddingTop: "3px",
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
    pane: {
      center: ["50%", "80%"],
      size: "140%",
      startAngle: -90,
      endAngle: 90,
      background: [
        ...stopsBorders,
        {
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || "#EEE",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      ],
    },

    tooltip: {
      enabled: false,
    },
    // the value axis
    yAxis: {
      min: highchartProps?.Minimum ? parseFloat(highchartProps?.Minimum) : 0,
      max: highchartProps?.Maximum ? parseFloat(highchartProps?.Maximum) : 2000,
      stops: stops.length > 0 ? stops : null,
      lineWidth: 0,
      tickWidth: 0,
      // minorTickInterval: null,
      // tickAmount: 2,
      title: {
        y: 70,
      },
      labels: {
        y: 16,
      },
    },

    plotOptions: {
      solidgauge: {
        inside: false,
        dataLabels: {
          borderWidth: 0,
          useHTML: true,
          format: `
          <span class="highchart-angular-solid-data-label"><span style="font-size: ${
            highchartProps["Value Font Size"]
              ? highchartProps["Value Font Size"]
              : "9"
          }px; text-align:center; padding-right:4px">
              ${highchartProps["Show Measurement"] ? "{y}" : ""}
              </span> <span style="font-size: ${
                highchartProps["UoM Font Size"]
                  ? highchartProps["UoM Font Size"]
                  : "9"
              }px; text-align:center"> ${
            highchartProps?.Measurement?.[0] &&
            highchartProps["Show Unit of Measurement"]
              ? `(${highchartProps?.Measurement?.[0].CATALOG_SYMBOL})`
              : ""
          } </span></span>`,
        },
      },
    },

    series: [
      {
        name: "Move",
        type: "solidgauge",
        data: [
          {
            color: "#e6cb00",
            radius: "100%",
            innerRadius: "60%",
            y: parseFloat(
              parseFloat(value).toFixed(
                highchartProps["Decimal Places"] === ""
                  ? 0
                  : highchartProps["Decimal Places"]
              )
            ),
          },
        ],
        tooltip: {
          valueSuffix: ` ${
            highchartProps?.Measurement?.[0] &&
            highchartProps["Show Unit of Measurement"]
              ? highchartProps?.Measurement?.[0].CATALOG_SYMBOL
              : ""
          }`,
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

export default React.memo(Solid);
