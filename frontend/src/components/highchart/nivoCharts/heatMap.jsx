import React from "react";

import { ResponsiveHeatMap } from "@nivo/heatmap";

const MyResponsiveHeatMap = () => (
  <ResponsiveHeatMap
    data={[
      {
        id: "Japan",
        data: [
          {
            x: "Train",
            y: 86090,
          },
          {
            x: "Subway",
            y: 79738,
          },
          {
            x: "Bus",
            y: -35039,
          },
          {
            x: "Car",
            y: -51779,
          },
          {
            x: "Boat",
            y: 80671,
          },
          {
            x: "Moto",
            y: -37362,
          },
          {
            x: "Moped",
            y: -32568,
          },
          {
            x: "Bicycle",
            y: -20427,
          },
          {
            x: "Others",
            y: -12057,
          },
        ],
      },
      {
        id: "France",
        data: [
          {
            x: "Train",
            y: -89456,
          },
          {
            x: "Subway",
            y: -56664,
          },
          {
            x: "Bus",
            y: 84801,
          },
          {
            x: "Car",
            y: 85910,
          },
          {
            x: "Boat",
            y: 92598,
          },
          {
            x: "Moto",
            y: -55120,
          },
          {
            x: "Moped",
            y: -72030,
          },
          {
            x: "Bicycle",
            y: -94730,
          },
          {
            x: "Others",
            y: 65986,
          },
        ],
      },
      {
        id: "US",
        data: [
          {
            x: "Train",
            y: 1013,
          },
          {
            x: "Subway",
            y: 69467,
          },
          {
            x: "Bus",
            y: -74185,
          },
          {
            x: "Car",
            y: -40980,
          },
          {
            x: "Boat",
            y: 10128,
          },
          {
            x: "Moto",
            y: -90140,
          },
          {
            x: "Moped",
            y: 71255,
          },
          {
            x: "Bicycle",
            y: -81391,
          },
          {
            x: "Others",
            y: 98085,
          },
        ],
      },
      {
        id: "Germany",
        data: [
          {
            x: "Train",
            y: -27284,
          },
          {
            x: "Subway",
            y: 91866,
          },
          {
            x: "Bus",
            y: -21747,
          },
          {
            x: "Car",
            y: 19340,
          },
          {
            x: "Boat",
            y: -83980,
          },
          {
            x: "Moto",
            y: 92337,
          },
          {
            x: "Moped",
            y: 92107,
          },
          {
            x: "Bicycle",
            y: -80554,
          },
          {
            x: "Others",
            y: -3849,
          },
        ],
      },
      {
        id: "Norway",
        data: [
          {
            x: "Train",
            y: -90523,
          },
          {
            x: "Subway",
            y: -93976,
          },
          {
            x: "Bus",
            y: -78814,
          },
          {
            x: "Car",
            y: 54984,
          },
          {
            x: "Boat",
            y: -23713,
          },
          {
            x: "Moto",
            y: 61731,
          },
          {
            x: "Moped",
            y: 94493,
          },
          {
            x: "Bicycle",
            y: 84060,
          },
          {
            x: "Others",
            y: -50655,
          },
        ],
      },
      {
        id: "Iceland",
        data: [
          {
            x: "Train",
            y: -91151,
          },
          {
            x: "Subway",
            y: -61498,
          },
          {
            x: "Bus",
            y: -40724,
          },
          {
            x: "Car",
            y: -9718,
          },
          {
            x: "Boat",
            y: 31544,
          },
          {
            x: "Moto",
            y: -38611,
          },
          {
            x: "Moped",
            y: -63318,
          },
          {
            x: "Bicycle",
            y: 31929,
          },
          {
            x: "Others",
            y: 56576,
          },
        ],
      },
      {
        id: "UK",
        data: [
          {
            x: "Train",
            y: 99589,
          },
          {
            x: "Subway",
            y: -33710,
          },
          {
            x: "Bus",
            y: 92025,
          },
          {
            x: "Car",
            y: -9324,
          },
          {
            x: "Boat",
            y: -47198,
          },
          {
            x: "Moto",
            y: 48985,
          },
          {
            x: "Moped",
            y: -97662,
          },
          {
            x: "Bicycle",
            y: -88309,
          },
          {
            x: "Others",
            y: 59044,
          },
        ],
      },
      {
        id: "Vietnam",
        data: [
          {
            x: "Train",
            y: 82573,
          },
          {
            x: "Subway",
            y: -56713,
          },
          {
            x: "Bus",
            y: 78801,
          },
          {
            x: "Car",
            y: -29172,
          },
          {
            x: "Boat",
            y: -11329,
          },
          {
            x: "Moto",
            y: 37929,
          },
          {
            x: "Moped",
            y: -99295,
          },
          {
            x: "Bicycle",
            y: 53729,
          },
          {
            x: "Others",
            y: -79496,
          },
        ],
      },
    ]}
    margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
    valueFormat=">-.2s"
    axisTop={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -90,
      legend: "",
      legendOffset: 46,
    }}
    axisRight={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "country",
      legendPosition: "middle",
      legendOffset: 70,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "country",
      legendPosition: "middle",
      legendOffset: -72,
    }}
    colors={{
      type: "diverging",
      scheme: "red_yellow_blue",
      divergeAt: 0.5,
      minValue: -100000,
      maxValue: 100000,
    }}
    emptyColor="#555555"
    legends={[
      {
        anchor: "bottom",
        translateX: 0,
        translateY: 30,
        length: 400,
        thickness: 8,
        direction: "row",
        tickPosition: "after",
        tickSize: 3,
        tickSpacing: 4,
        tickOverlap: false,
        tickFormat: ">-.2s",
        title: "Value →",
        titleAlign: "start",
        titleOffset: 4,
      },
    ]}
  />
);
function App() {
  return <MyResponsiveHeatMap />;
}
export default React.memo(App);
