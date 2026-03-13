import Highcharts from "highcharts/highstock";
import React from "react";

import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import boost from "highcharts/modules/boost";
import histogram from "highcharts/modules/histogram-bellcurve";
import accessibility from "highcharts/modules/accessibility";
import TagService from "../../../../services/api/tags";
import { showLoading, loading } from "../../utils/loading";
import { credits } from "../../utils/credit";
import {
  updateAxisTitle,
  updateAxisValue,
  updateAxisAlignTick,
  updateAxisStartTick,
  updateAxisEndTick,
} from "../../utils/updateYaxis";

import { updateXAxisTitleStyle } from "../../utils/updateXaxis";
import { updateSeries } from "../../utils/updateSeries";
import { useIsMount } from "../../../../hooks/useIsMount";
import { useSelector } from "react-redux";
import resourceList from "../../../../services/api/resourceList";
exporting(Highcharts);
accessibility(Highcharts);
data(Highcharts);
boost(Highcharts);
histogram(Highcharts);

const LineChartsFFT = ({ highchartProps, width, height, updateUuid }) => {
  const isMount = useIsMount();
  const chartRef = React.createRef();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [yAxis, setYaxis] = React.useState([]);
  const [title, setTitle] = React.useState([]);
  const layer = useSelector((state) => state.auth.user.active_layer);
  const helperUpdateAfterUploadData = (series) => {
    updateXAxisTitleStyle(
      series,
      highchartProps["Graph Axis Title Font Size (em)"]
    );
    // helperUpdateSettings(series.yAxis?.[0], highchartProps);
  };
  React.useEffect(() => {
    let peak = "";
    const series = chartRef.current.chart;
    series.showLoading();
    showLoading(series);
    async function myFunc() {
      try {
        let res = await resourceList.getResourcelist({
          CULTURE,
          PARENT: "WIDGET_HELPER_TEXT",
        });
        setTitle(res.data);
        peak = res.data?.filter((e) => e.ID === "WIDGET_HELPER_TEXT_PEAK")?.[0]
          ?.SHORT_LABEL;
        setYaxis([
          {
            name: peak,
            id: peak,
            opposite: true,

            title: {
              text: res.data?.filter(
                (e) => e.ID === "WIDGET_HELPER_TEXT_KURTOSIS"
              )?.[0]?.SHORT_LABEL,
            },
          },
          {
            title: {
              text: res.data?.filter(
                (e) => e.ID === "WIDGET_HELPER_TEXT_FREQ"
              )?.[0]?.SHORT_LABEL,
            },
          },
        ]);
      } catch (err) {
        console.log(err);
      }
      if (chartRef.current) {
        let dataList = {};
        if (highchartProps.Inputs)
          Promise.all(
            highchartProps.Inputs.map((tag, i) => {
              dataList[tag.NAME] = [];
            })
          );
        try {
          const body = JSON.stringify({
            TAGS: Object.keys(dataList),
            TYPE: "accleration_kurtosis",
          });
          let res = await TagService.getFft(body, layer);
          helperUpdateAfterUploadData(series);
          Promise.all(
            Object.keys(dataList).map((e) => {
              if (res.data[e]?.data?.[0]?.kurtosis_value) {
                Promise.all(
                  res.data[e]?.data?.[0]?.kurtosis_value?.map((data, i) => {
                    dataList[e].push([
                      res.data[e]?.data?.[0]?.frequencies[i],
                      data,
                    ]);
                  })
                );
              }
            })
          );
        } catch (err) {
          console.log(err);
        }
        if (highchartProps.Inputs)
          Promise.all(
            highchartProps.Inputs.map((tag) => {
              series.addSeries({
                name: `${tag.SHORT_NAME} H`,
                type: "histogram",
                xAxis: 1,
                yAxis: 1,
                baseSeries: tag.NAME,
                zIndex: -1,
              });
              series.addSeries({
                yAxis: peak,
                name: tag.SHORT_NAME,
                id: tag.NAME,
                color: highchartProps["Show Enable Custom Color"]
                  ? highchartProps[`[${tag.NAME}] Color`]
                  : "",
                data: dataList[tag.NAME],
              });
            })
          );
      }
      series.hideLoading();
    }
    myFunc();
    return () => {};
  }, []);

  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [
    highchartProps?.["Input Flag"],
    highchartProps?.["Spectral Waveform"],
    highchartProps?.["Show Peak"],
    highchartProps?.["Show RMS"],
    highchartProps?.["Show Time"],
    highchartProps?.["Kinematic"],
    highchartProps?.CULTURE,
  ]);

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
      //   helperUpdateSettings(chartRef.current?.chart?.yAxis?.[0], highchartProps);
    }
  }, [
    highchartProps?.["Settings Flag"],
    highchartProps?.["Show Boundaries"],
    highchartProps?.["Show Enable Manual Y-Axis Min/Max"],
  ]);

  React.useEffect(() => {
    if (chartRef.current && !isMount) {
      updateXAxisTitleStyle(
        chartRef.current.chart,
        highchartProps["Graph Axis Title Font Size (em)"]
      );
    }
  }, [highchartProps["Graph Axis Title Font Size (em)"]]);
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
          type: "spline",
          reflow: true,
        },

        boost: {
          useGPUTranslations: true,
        },
        tooltip: {
          split: true,
          formatter: function () {
            const decimalPlaces =
              highchartProps["Decimal Places"] === ""
                ? 0
                : parseInt(highchartProps["Decimal Places"]);
            const formattedY = this.y.toFixed(decimalPlaces);
            if (highchartProps?.["Spectral Waveform"] === "RMS Waveform") {
              var points = this.points,
                tooltipArray = ["X : " + new Date(this.x)];

              points.forEach(function (point, index) {
                tooltipArray.push(point.point.series.name + " : " + formattedY);
              });

              return tooltipArray;
            } else {
              var points = this.points,
                tooltipArray = ["X : " + this.x.toFixed(decimalPlaces)];

              points.forEach(function (point, index) {
                tooltipArray.push(point.point.series.name + " : " + formattedY);
              });

              return tooltipArray;
            }
          },
          shared: true,
        },
        exporting: {
          enabled: highchartProps["Show Enable Export"],
        },
        navigator: {
          adaptToUpdatedData: true,
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
        yAxis: [...yAxis],
        xAxis: [
          {
            lineWidth: 1,
            tickWidth: 2,
            opposite: true,
            title: {
              text: title?.filter(
                (e) => e.ID === "WIDGET_HELPER_TEXT_FREQ"
              )?.[0]?.SHORT_LABEL,
            },
          },
          {
            title: {
              text: title?.filter(
                (e) => e.ID === "WIDGET_HELPER_TEXT_KURTOSIS"
              )?.[0]?.SHORT_LABEL,
            },
          },
        ],
        ...loading,
        ...credits,
      }}
      ref={chartRef}
    />
  );
};

export default React.memo(LineChartsFFT);
