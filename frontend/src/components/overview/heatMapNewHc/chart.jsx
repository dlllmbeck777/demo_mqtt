import Highcharts from "highcharts/highstock";
import React from "react";

import HighchartsReact from "highcharts-react-official";

import { useSelector } from "react-redux";
import { useIsMount } from "../../../hooks/useIsMount";
import { updateAxisValue } from "../utils/updateYaxis";
import { loading, showLoading } from "../utils/loading";
import resourceList from "../../../services/api/resourceList";
import { webSocket } from "../utils/webSocket/wsAlarm";

const Chart = ({ highchartProps, width, height, updateUuid }) => {
  const isMount = useIsMount();
  const chartRef = React.createRef();
  const layer = useSelector((state) => state?.auth?.user?.active_layer);
  const [data, setData] = React.useState([]);
  const [label, setLabel] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [btnText, setBtnText] = React.useState([]);
  async function asyncGetBtnText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "WIDGET_HELPER_TEXT",
      });
      setBtnText(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetBtnText();
  }, [CULTURE]);
  React.useEffect(() => {
    let yAxiskey = [];
    let categories = [];
    if (highchartProps?.Inputs)
      Promise.all(
        (highchartProps.Inputs = highchartProps.Inputs.sort((a, b) =>
          a.SHORT_NAME < b.SHORT_NAME ? 1 : -1
        ))
      );

    if (highchartProps?.Inputs)
      Promise.all(
        highchartProps.Inputs.map((tag, i) => {
          yAxiskey.push(tag.NAME);
          categories.push(tag.SHORT_NAME);
        })
      );
    setCategories(categories);
    let value = [];
    const createEmptyChart = (list) => {
      let newDate = new Date(new Date().getTime() + 18000000);
      value = [];
      Promise.all(
        yAxiskey.map((axis, i) => {
          for (let time = 0; time < 60; time++) {
            let timeList = list.filter(
              (listItem) =>
                listItem.measurement === axis &&
                listItem.time > newDate.getTime() - (time + 1) * 60000 &&
                listItem.time < newDate.getTime() - time * 60000
            );
            if (timeList.length === 0)
              value.push([newDate.getTime() - time * 60000, i, 4]);
            else {
              let minVal = Math.min.apply(
                Math,
                timeList.map(function (item) {
                  console.log(item);
                  setLabel((prev) => {
                    return {
                      ...prev,
                      [[newDate.getTime() - time * 60000].toString() +
                      i.toString()]: item.tag_value,
                    };
                  });
                  return item.priority;
                })
              );

              value.push([newDate.getTime() - time * 60000, i, minVal, 15]);
            }
          }
        })
      );

      return true;
    };
    let tagName = [];
    if (highchartProps?.Inputs)
      Promise.all(
        highchartProps.Inputs.map((e) => {
          tagName.push(e.NAME);
        })
      );

    const wsFunc = (data) => {
      data?.map((e) => {
        e.time = e?.time + 18000000;
      });
      createEmptyChart(data);
      setData(value);
    };
    const ws = new webSocket(layer, tagName, wsFunc);
    ws.openWs();
    return () => {
      ws.closeWs();
    };
  }, []);

  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [highchartProps?.["Input Flag"]]);
  React.useEffect(() => {
    if (chartRef.current) {
      updateAxisValue(
        chartRef,
        highchartProps["Graph Axis Title Font Size (em)"]
      );
    }
  }, [highchartProps["Graph Axis Title Font Size (em)"]]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={chartRef}
      options={{
        chart: {
          type: "heatmap",
          plotBorderWidth: 1,
          width: width,
          height: height,
        },
        credits: {
          enabled: false,
        },
        yAxis: {
          title: "",
          categories: categories,
        },
        title: {
          text: "",
        },
        exporting: {
          enabled: highchartProps["Show Enable Export"],
        },
        colorAxis: {
          dataClasses: [
            {
              from: 2.5,
              to: 4.5,
              name: btnText?.filter(
                (e) => e.ID === "WIDGET_HELPER_TEXT_GOOD"
              )?.[0]?.SHORT_LABEL,
              color: "rgba(0,128,0,0.5)",
            },
            {
              from: 1.5,
              to: 2.5,
              name: btnText?.filter(
                (e) => e.ID === "WIDGET_HELPER_TEXT_WARNING"
              )?.[0]?.SHORT_LABEL,
              color: "rgba(0,128,0,0.5)",
              color: "rgba(215,215,0,0.5)",
            },
            {
              from: 0.5,
              to: 1.5,
              name: btnText?.filter(
                (e) => e.ID === "WIDGET_HELPER_TEXT_BAD"
              )?.[0]?.SHORT_LABEL,
              color: "rgba(0,128,0,0.5)",
              color: "rgba(255,0,0,0.5)",
            },
            {
              from: -0.5,
              to: 0.5,
              name: btnText?.filter(
                (e) => e.ID === "WIDGET_HELPER_TEXT_ANOMALY"
              )?.[0]?.SHORT_LABEL,
              color: "rgba(0,128,0,0.5)",
              color: "rgba(255,0,0,0.9)",
            },
          ],
        },
        tooltip: {
          formatter: function () {
            console.log(this);
            return (
              "X-Axis: " +
              Highcharts.dateFormat("%Y-%m-%d %H:%M:%S", this.point.x) +
              "<br>Y-Axis: " +
              this.series.yAxis.categories[this.point.y] +
              (label?.[[this.point.x].toString() + [this.point.y].toString()] &&
                "<br>Value: " +
                  label?.[
                    [this.point.x].toString() + [this.point.y].toString()
                  ])
            );
          },
        },
        xAxis: {
          type: "datetime",
          min: Date.now() + 18000000 - 1 * 60 * 59 * 1000,
          max: Date.now() + 18000000,
        },
        legend: {
          enabled: highchartProps["Show Enable Graph Legend"],
          itemStyle: {
            fontSize: highchartProps["Graph Legend Font Size (em)"]
              ? `${highchartProps["Graph Legend Font Size (em)"]}px`
              : "12px",
          },
          layout: "horizontal",
          verticalAlign: "bottom",
          align: "center",
        },
        series: [
          {
            data: data,
            colsize: 60000,
          },
        ],
        ...loading,
      }}
    />
  );
};

export default Chart;
