import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import accessibility from "highcharts/modules/accessibility";
import { wsBaseUrl } from "../../../services/baseApi";
exporting(Highcharts);
data(Highcharts);
accessibility(Highcharts);
var W3CWebSocket = require("websocket").w3cwebsocket;
const Bar = ({ highchartProps, width, height }) => {
  const client = [];

  React.useEffect(() => {
    return () => {
      Promise.all(
        client.map((e) => {
          e.close();
        })
      );
    };
  }, []);

  const options = {
    chart: {
      type: "bar",
      events: {
        load: function () {
          var chart = this;
          var mydata = [];
          client.map((e) => {
            e.close();
          });
          highchartProps.Inputs.map((tag, index) => {
            client[index] = new W3CWebSocket(
              `${wsBaseUrl}/ws/live/last_data/${tag.TAG_ID}`
            );
            chart.xAxis[0].update(
              {
                categories: [...chart.xAxis[0].categories, tag.NAME],
              },
              false
            );
            client[index].onerror = function () {
              console.log("Connection Error");
            };
            client[index].onopen = function () {
              console.log("connected");
            };
            client[index].onclose = function () {
              console.log("WebSocket Client Closed");
            };
            client[index].onmessage = function (e) {
              async function sendNumber() {
                if (client.readyState === client.OPEN) {
                  if (typeof e.data === "string") {
                    let jsonData = JSON.parse(e.data);
                    const series = chart.series[0],
                      shift = series.data.length > highchartProps.Inputs.length;
                    Object.keys(jsonData).map((e) => {
                      mydata[index] = jsonData[e][2];
                      chart.series[0].addPoint(jsonData[e][2], true, shift);
                    });
                    chart.reflow();
                    return true;
                  }
                }
              }
              sendNumber();
            };
          });
        },
        // redraw: function () {
        //   var yAxis = this.yAxis;
        //   if (yAxis) {
        //     yAxis.map((e) => {
        //       console.log(e);
        //       if ((!e.min || !e.max) && e.title !== "") {
        //         e.setTitle({ text: "" });
        //         e.title = "";
        //       }
        //     });
        //   }
        // },
      },
    },
    title: {
      text: "",
    },
    // data: {
    //   enablePolling: true,
    //   dataRefreshRate: 1,
    // },

    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      title: false,
    },
    legend: {
      enabled: false,
      layout: "horizontal",
    },
    credits: {
      enabled: false,
    },

    // plotOptions: {
    //   series: {
    //     stacking: "normal",
    //   },
    // },
    series: [{}],
  };
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        ...options,
        chart: {
          ...options.chart,
          width: width,
          height: height,
        },
      }}
    />
  );
};
export default React.memo(Bar);
