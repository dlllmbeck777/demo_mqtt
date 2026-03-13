import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  Angular,
  LineChart,
  Solid,
  Measurement,
  Tabular,
  Backfill,
  BarHc,
} from "../highchart/charts";
import {
  Bar,
  Pie,
  HeatMap,
  Line,
  TreeMap,
  BackFillLine,
} from "../highchart/nivoCharts";
import VideoStream from "./videoStream/videoStream";
import Matrix from "./matrix/chart";
import Scatter from "./scatter/chart";
import CandleStick from "./candleStick/chart";
import HeatMapHc from "./heatmap/chart";
import LineChartFFT from "./linechart/fft/chart";
import LineChartAnomaly from "./linechart/anomaly/chart";
import HeatMapNew from "./heatMapNewHc/chart";
import MatrixNew from "./matrixNew/chart";
import Schematic from "./schematik/chart";
import BarChartTransaction from "./transaction/barChart/chart";
import MeasureTransaction from "./transaction/measurement/chart";
import PieChartTransaction from "./transaction/pie/chart";
import LineChartTransaction from "./transaction/line/chart";
import TimeLineTransaction from "./transaction/timeline/chart";
import CalendarTransaction from "./transaction/calendar/chart";
import "../../assets/styles/page/overview/chartContainer.scss";
import { uuidv4 } from "../../services/utils/uuidGenerator";
import FormBody from "./form/formbody";
import PumpForm from "./form/pump/chart";
import CheckStatus from "./checkStatus";
const MyBox = styled(Box)(({ theme }) => {
  return {
    ".highcharts-label-box": {
      fill: theme.palette.background.main,
    },
    ".highcharts-axis-labels": {
      text: {
        color: `${theme.palette.text.main} !important`,
        fill: `${theme.palette.text.main} !important`,
      },
    },
    ".highcharts-input-group": {
      text: {
        color: `${theme.palette.text.main} !important`,
        fill: `${theme.palette.text.main} !important`,
      },
    },
    ".highcharts-exporting-group": {
      rect: {
        fill: `${theme.palette.background.main} !important`,
      },

      path: {
        fill: `${theme.palette.text.main} !important`,
        stroke: `${theme.palette.text.main} !important`,
      },
    },

    ".highcharts-menu": {
      li: {
        color: `${theme.palette.text.main} !important`,
      },

      background: `${theme.palette.background.main} !important`,
    },

    ".highcharts-data-labels": {
      text: {
        fill: `${theme.palette.success.primary} !important`,
      },
    },
  };
});
const Highchart = ({
  highchartProps,
  width,
  height,
  backfillData,
  tabular,
}) => {
  const [uuid, setUuid] = React.useState(uuidv4());
  const [chartsWidth, setChartsWidth] = React.useState(width);
  const [chartsHeight, setChartsHeight] = React.useState(height);
  const updateUuid = React.useCallback(() => {
    setUuid(uuidv4());
  }, []);
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setChartsWidth(width);
      setChartsHeight(height);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [width, height]);
  console.log('UUID ++++++++++++++++++>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' + uuid);
  console.log('highchartProps ----------------------------- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + highchartProps);
  return (
    <MyBox className="chart-container" style={{ width, height }}>
      {/* <HeatMapNew
        highchartProps={highchartProps}
        width={chartsWidth}
        height={chartsHeight}
      /> */}
      {highchartProps.Type === "Line Chart [Highchart]" ? (
        tabular ? (
          <Tabular
            highchartProps={highchartProps}
            backfillData={backfillData}
            key={uuid}
            updateUuid={updateUuid}
          />
        ) : backfillData ? (
          <Backfill
            highchartProps={highchartProps}
            chartType="line"
            width={chartsWidth}
            height={chartsHeight}
            key={uuid}
            updateUuid={updateUuid}
          />
        ) : (
          <LineChart
            highchartProps={highchartProps}
            width={chartsWidth}
            height={chartsHeight}
            chartType="line"
            key={uuid}
            updateUuid={updateUuid}
          />
        )
      ) : (
        <></>
      )}
      {highchartProps.Type === "Area Chart [Highchart]" && <>areachart</>}
      {/* {highchartProps.Type === "Area Chart [Highchart]" ? (
        tabular ? (
          <Tabular
            highchartProps={highchartProps}
            liveData={liveData}
            backfillData={backfillData}
            tabular={tabular}
          />
        ) : backfillData ? (
          <BackFillLine
            highchartProps={highchartProps}
            liveData={liveData}
            height={chartsHeight}
          />
        ) : (
          //<Line highchartProps={highchartProps} liveData={liveData} />
          <Line
            highchartProps={highchartProps}
            liveData={liveData}
            height={chartsHeight}
          />
        )
      ) : (
        <></>
      )} */}

      {highchartProps.Type === "TreeMap Chart [Nivo]" && (
        <TreeMap highchartProps={highchartProps} />
      )}
      {highchartProps.Type === "Measurement [Custom]" && (
        <Measurement highchartProps={highchartProps} />
      )}
      {highchartProps.Type === "Bar Chart [Nivo]" && (
        <Bar highchartProps={highchartProps} />
      )}
      {highchartProps.Type === "Pie Chart [Nivo]" && (
        <Pie highchartProps={highchartProps} />
      )}
      {highchartProps.Type === "Heat Map [Nivo]" && (
        <HeatMap highchartProps={highchartProps} />
      )}
      {highchartProps.Type === "Matrix [Custom]" && (
        <Matrix highchartProps={highchartProps} />
      )}
      {highchartProps.Type === "Gauge(Solid) [Highchart]" && (
        <Solid
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
        />
      )}
      {highchartProps.Type === "Bar Chart [Highchart]" && (
        <BarHc
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
        />
      )}
      {highchartProps.Type === "Gauge(Angular) [Highchart]" && (
        <Angular
          key={uuid}
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
        />
      )}
      {highchartProps.Type === "Video Live Stream [Custom]" && (
        <VideoStream width={chartsWidth} height={chartsHeight} />
      )}
      {highchartProps.Type === "Candlestick [FFT][Highchart]" && (
        <CandleStick
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
        />
      )}
      {highchartProps.Type === "Scatter [FFT][Highchart]" && (
        <Scatter
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
        />
      )}
      {highchartProps.Type === "Heat Map [Highchart]" && (
        <HeatMapHc
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
        />
      )}
      {highchartProps.Type === "Line Chart [FFT][Highchart]" && (
        <LineChartFFT
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Line Chart [Anomaly][Highchart]" && (
        <LineChartAnomaly
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Heat Map [Events][Highchart]" && (
        <HeatMapNew
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Matrix [Events][Custom]" && (
        <MatrixNew
          highchartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          updateUuid={updateUuid}
          key={uuid}
        />
      )}
      {highchartProps.Type === "Schematic [Custom]" && (
        <Schematic
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
        />
      )}
      {highchartProps.Type === "Bar Chart [Transaction][Highchart]" && (
        <BarChartTransaction
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          updateUuid={updateUuid}
          key={uuid}
        />
      )}
      {highchartProps.Type === "Measurement [Transaction][Custom]" && (
        <MeasureTransaction
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          updateUuid={updateUuid}
          key={uuid}
        />
      )}
      {highchartProps.Type === "Pie Chart [Transaction][Highchart]" && (
        <PieChartTransaction
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Line Chart [Transaction][Highchart]" && (
        <LineChartTransaction
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Timeline [Transaction][Custom]" && (
        <TimeLineTransaction
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Calendar [Transaction][Custom]" && (
        <CalendarTransaction
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Downtime" && (
        <FormBody
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Compressore Read" && (
        <PumpForm
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}
      {highchartProps.Type === "Pump Read" && (
        <PumpForm
          chartProps={highchartProps}
          width={chartsWidth}
          height={chartsHeight}
          key={uuid}
          updateUuid={updateUuid}
        />
      )}

      <CheckStatus chartProps={highchartProps} />
    </MyBox>
  );
};

export default React.memo(Highchart);
