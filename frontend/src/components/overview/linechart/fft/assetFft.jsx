import Highcharts from "highcharts/highstock";
import React from "react";

import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import boost from "highcharts/modules/boost";
import accessibility from "highcharts/modules/accessibility";
import TagService from "../../../../services/api/tags";
import { showLoading, loading } from "../../utils/loading";
import { responsiveLine } from "../../utils/responsive";
import { credits } from "../../utils/credit";
import {
  updateAxisTitle,
  updateAxisValue,
  updateAxisAlignTick,
  updateAxisStartTick,
  updateAxisEndTick,
  updateSettings,
  updatePlotOption,
  helperUpdateSettings,
} from "../../utils/updateYaxis";

import {
  updateXAxisTitle,
  updateXAxisTitleStyle,
  updateXAxisType,
} from "../../utils/updateXaxis";
import { updateSeries } from "../../utils/updateSeries";
import { useIsMount } from "../../../../hooks/useIsMount";
import { useSelector } from "react-redux";
import resourceList from "../../../../services/api/resourceList";
exporting(Highcharts);
accessibility(Highcharts);
data(Highcharts);
boost(Highcharts);

const LineChartsFFT = ({ highchartProps, width, height, updateUuid }) => {
  const isMount = useIsMount();
  const chartRef = React.createRef();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const layer = useSelector((state) => state.auth.user.active_layer);
  const helperUpdateAfterUploadData = (series) => {
    updateXAxisTitleStyle(
      series,
      highchartProps["Graph Axis Title Font Size (em)"]
    );
    helperUpdateSettings(series.yAxis?.[0], highchartProps);
  };
  React.useEffect(() => {
    let peak = "";
    let freq = "";
    let time = "";
    const series = chartRef.current.chart;
    series.showLoading();
    showLoading(series);

    async function myFunc() {
      try {
        let res = await resourceList.getResourcelist({
          CULTURE,
          PARENT: "WIDGET_HELPER_TEXT",
        });
        peak = res.data?.filter((e) => e.ID === "WIDGET_HELPER_TEXT_PEAK")?.[0]
          ?.SHORT_LABEL;
        time = res.data?.filter((e) => e.ID === "WIDGET_HELPER_TEXT_TIME")?.[0]
          ?.SHORT_LABEL;
        freq = res.data?.filter((e) => e.ID === "WIDGET_HELPER_TEXT_FREQ")?.[0]
          ?.SHORT_LABEL;
        series.yAxis[0].update({
          name: peak,
          id: peak,
          title: {
            text: peak,
          },
        });
      } catch (err) {
        console.log(err);
      }
      if (chartRef.current) {
        let dataList = {};
        if (highchartProps.Assets)
          Promise.all(
            highchartProps.Assets.map((tag, i) => {
              dataList[tag[1]] = [];
            })
          );
        try {
          if (
            highchartProps?.["Spectral Waveform"] === "Waveform" &&
            highchartProps?.["Show Frequency"] &&
            highchartProps?.["Kinematic"] === "Acceleration"
          ) {
            const body = JSON.stringify({
              ASSET: Object.keys(dataList),
              TYPE: "accleration_asset_fft",
            });
            let res = await TagService.getFftByAsset(body, layer);
            updateXAxisTitle(series, freq);
            helperUpdateAfterUploadData(series);
            console.log(res);
            Promise.all(
              Object.keys(dataList).map((e) => {
                if (res.data[e]?.data?.[0]?.fft_result_real) {
                  res.data[e]?.data?.[0]?.fft_result_real.shift();
                  Promise.all(
                    res.data[e]?.data?.[0]?.fft_result_real?.map((data, i) => {
                      if (
                        i <
                        res.data[e]?.data?.[0]?.fft_result_real.length / 2
                      )
                        dataList[e].push([
                          res.data[e]?.data?.[0]?.frequencies[i],
                          data,
                        ]);
                    })
                  );
                }
              })
            );
          } else if (
            highchartProps?.["Spectral Waveform"] === "Waveform" &&
            highchartProps?.["Show Time"] &&
            highchartProps?.["Kinematic"] === "Acceleration"
          ) {
            const body = JSON.stringify({
              ASSET: Object.keys(dataList),
              TYPE: "accleration_asset_waveform",
            });
            let res = await TagService.getFftByAsset(body, layer);
            console.log(res);
            updateXAxisTitle(series, time);
            helperUpdateAfterUploadData(series);
            Promise.all(
              Object.keys(dataList).map((e) => {
                if (res.data[e]?.data?.[0]?.time_interval) {
                  Promise.all(
                    res.data[e]?.data?.[0]?.time_interval?.map((data, i) => {
                      dataList[e].push([
                        data,
                        res.data[e].data?.[0].waveform_data[i],
                      ]);
                    })
                  );
                }
              })
            );
          } else if (
            highchartProps?.["Spectral Waveform"] === "RMS Waveform" &&
            highchartProps?.["Kinematic"] === "Acceleration"
          ) {
            const body = JSON.stringify({
              ASSET: Object.keys(dataList),
              TYPE: "accleration_asset_fft_rms",
            });
            let res = await TagService.getFftByAsset(body, layer);
            console.log(res);
            updateXAxisTitle(series, freq);
            helperUpdateAfterUploadData(series);
            Promise.all(
              Object.keys(res.data).map((e) => {
                Promise.all(
                  res.data[e]?.data?.[0]?.rms_fft_frequency?.fft_value?.map(
                    (data, i) => {
                      if (i > 0) {
                        if (
                          i <
                          (res.data[e]?.data?.[0]?.rms_fft_frequency
                            ?.frequencies?.length +
                            1) /
                            2
                        )
                          dataList[e].push([
                            res.data[e]?.data?.[0]?.rms_fft_frequency
                              ?.frequencies?.[i],
                            data,
                          ]);
                      }
                    }
                  )
                );
              })
            );
          } else if (highchartProps?.["Spectral Waveform"] === "Autospectrum") {
            const body = JSON.stringify({
              ASSET: Object.keys(dataList),
              TYPE: "accleration_autospectrum",
            });
            let res = await TagService.getFftByAsset(body, layer);
            console.log(res);
            updateXAxisTitle(series, freq);
            helperUpdateAfterUploadData(series);
            Promise.all(
              Object.keys(dataList).map((e) => {
                if (res.data[e]?.data?.[0]?.spectrum) {
                  res.data[e]?.data?.[0]?.spectrum.shift();
                  Promise.all(
                    res.data[e]?.data?.[0]?.spectrum?.map((data, i) => {
                      if (i < res.data[e]?.data?.[0]?.spectrum.length / 2)
                        dataList[e].push([
                          res.data[e]?.data?.[0]?.frequencies[i],
                          data,
                        ]);
                    })
                  );
                }
              })
            );
          } else if (highchartProps?.["Spectral Waveform"] === "Peakfactor") {
            const body = JSON.stringify({
              ASSET: Object.keys(dataList),
              TYPE: "accleration_asset_peak_factor_new",
            });
            let res = await TagService.getFftByAsset(body, layer);
            updateXAxisType(series, "datetime");
            updateXAxisTitle(series, time);
            helperUpdateAfterUploadData(series);
            let myVal = [];
            Promise.all(
              Object.keys(dataList).map((e) => {
                if (res.data[e]?.data?.[0]?.vibration_data) {
                  Promise.all(
                    res.data[e]?.data?.[0]?.vibration_data?.map((data, i) => {
                      if (i < res.data[e]?.data?.[0]?.vibration_data.length / 2)
                        dataList[e].push([
                          new Date(
                            res.data[e]?.data?.[0]?.windowed_timestamps[i]
                          ).getTime(),
                          data,
                        ]);
                    })
                  );

                  myVal.push(
                    highchartProps?.["Show Peak"] && {
                      color: "red",
                      width: 2,
                      value: res.data[e]?.data?.[0]?.peak_value,
                      dashStyle: "longdashdot",
                      zIndex: 3,
                      name: `${e} Peak`,
                      id: `${e} Peak`,
                    },
                    highchartProps?.["Show RMS"] && {
                      color: "yellow",
                      width: 2,
                      value: res.data[e]?.data?.[0]?.rms_value,
                      dashStyle: "longdashdot",
                      zIndex: 3,
                      name: `${e} RMS`,
                      id: `${e} RMS`,
                    }
                  );
                }
              })
            );
            updatePlotOption(chartRef, myVal);
          } else if (highchartProps?.["Spectral Waveform"] === "Envelope") {
            const body = JSON.stringify({
              ASSET: Object.keys(dataList),
              TYPE: "accleration_asset_high_frequency",
            });
            let res = await TagService.getFftByAsset(body, layer);
            if (highchartProps?.["Show Time"]) {
              updateXAxisTitle(series, time);
              helperUpdateAfterUploadData(series);
              Promise.all(
                Object.keys(dataList).map((e) => {
                  if (
                    res.data[e]?.data?.[0]?.envelope_high_frequency?.envelope
                  ) {
                    Promise.all(
                      res.data[
                        e
                      ]?.data?.[0]?.envelope_high_frequency?.envelope?.map(
                        (data, i) => {
                          dataList[e].push([
                            res.data[e]?.data?.[0]?.envelope_high_frequency
                              ?.time[i],
                            data,
                          ]);
                        }
                      )
                    );
                  }
                })
              );
            } else {
              updateXAxisTitle(series, freq);
              helperUpdateAfterUploadData(series);
              Promise.all(
                Object.keys(dataList).map((e) => {
                  if (res.data[e]?.data?.[0]?.envelope_spectrum?.spectrum) {
                    Promise.all(
                      res.data[e]?.data?.[0]?.envelope_spectrum?.spectrum?.map(
                        (data, i) => {
                          if (i > 1)
                            dataList[e].push([
                              res.data[e]?.data?.[0]?.envelope_spectrum
                                ?.frequencies[i],
                              data,
                            ]);
                        }
                      )
                    );
                  }
                })
              );
            }
          }
        } catch (err) {
          console.log(err);
        }
        if (highchartProps?.Assets)
          Promise.all(
            highchartProps.Assets.map((asset) => {
              series.addSeries({
                yAxis: peak,
                name: asset[1],
                id: asset[1],
                color: highchartProps["Show Enable Custom Color"]
                  ? highchartProps[`[${asset[1]}] Color`]
                  : "",
                data: dataList[asset[1]],
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
      helperUpdateSettings(chartRef.current?.chart?.yAxis?.[0], highchartProps);
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
            if (
              highchartProps?.["Spectral Waveform"] === "RMS Waveform" &&
              highchartProps?.["Kinematic"] === "Velocity"
            ) {
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
        xAxis: {
          lineWidth: 1,
          tickWidth: 2,
        },
        ...loading,
        ...credits,
      }}
      ref={chartRef}
    />
  );
};

export default React.memo(LineChartsFFT);
