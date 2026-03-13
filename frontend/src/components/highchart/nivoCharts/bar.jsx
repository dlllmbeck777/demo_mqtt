import React from "react";
import { ResponsiveBar } from "@nivo/bar";
const data = [
  {
    country: "AD",
    "hot dog": 81,
    "hot dogColor": "hsl(154, 70%, 50%)",
    burger: 193,
    burgerColor: "hsl(304, 70%, 50%)",
    sandwich: 50,
    sandwichColor: "hsl(222, 70%, 50%)",
    kebab: 154,
    kebabColor: "hsl(241, 70%, 50%)",
    fries: 68,
    friesColor: "hsl(331, 70%, 50%)",
    donut: 49,
    donutColor: "hsl(259, 70%, 50%)",
  },
  {
    country: "AE",
    "hot dog": 46,
    "hot dogColor": "hsl(33, 70%, 50%)",
    burger: 96,
    burgerColor: "hsl(70, 70%, 50%)",
    sandwich: 10,
    sandwichColor: "hsl(348, 70%, 50%)",
    kebab: 18,
    kebabColor: "hsl(191, 70%, 50%)",
    fries: 93,
    friesColor: "hsl(262, 70%, 50%)",
    donut: 54,
    donutColor: "hsl(118, 70%, 50%)",
  },
  {
    country: "AF",
    "hot dog": 123,
    "hot dogColor": "hsl(17, 70%, 50%)",
    burger: 24,
    burgerColor: "hsl(122, 70%, 50%)",
    sandwich: 12,
    sandwichColor: "hsl(35, 70%, 50%)",
    kebab: 141,
    kebabColor: "hsl(102, 70%, 50%)",
    fries: 33,
    friesColor: "hsl(191, 70%, 50%)",
    donut: 8,
    donutColor: "hsl(183, 70%, 50%)",
  },
];
const MyResponsiveBar = ({ data }) => (
  <ResponsiveBar
    data={data}
    keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
    indexBy="country"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.3}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={{ scheme: "nivo" }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "#38bcb2",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "#eed312",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: "fries",
        },
        id: "dots",
      },
      {
        match: {
          id: "sandwich",
        },
        id: "lines",
      },
    ]}
    borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "country",
      legendPosition: "middle",
      legendOffset: 32,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "food",
      legendPosition: "middle",
      legendOffset: -40,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />
);
function App() {
  return <MyResponsiveBar data={data} />;
}
export default React.memo(App);
