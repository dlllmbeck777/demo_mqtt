import React from "react";
import { ResponsivePie } from "@nivo/pie";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsivePieCanvas = ({ data /* see data tab */ }) => (
  <ResponsivePie
    data={[
      {
        id: "css",
        label: "css",
        value: 313,
        color: "hsl(174, 70%, 50%)",
      },
      {
        id: "make",
        label: "make",
        value: 375,
        color: "hsl(207, 70%, 50%)",
      },
      {
        id: "hack",
        label: "hack",
        value: 327,
        color: "hsl(115, 70%, 50%)",
      },
      {
        id: "c",
        label: "c",
        value: 308,
        color: "hsl(127, 70%, 50%)",
      },
      {
        id: "rust",
        label: "rust",
        value: 257,
        color: "hsl(164, 70%, 50%)",
      },
    ]}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    colors={{ scheme: "nivo" }}
    borderWidth={1}
    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
    radialLabelsSkipAngle={0}
    radialLabelsTextXOffset={6}
    radialLabelsTextColor="#333333"
    radialLabelsLinkOffset={0}
    radialLabelsLinkDiagonalLength={16}
    radialLabelsLinkHorizontalLength={24}
    radialLabelsLinkStrokeWidth={1}
    radialLabelsLinkColor={{ from: "color" }}
    slicesLabelsSkipAngle={0}
    slicesLabelsTextColor="#333333"
    sliceLabel={(d) => <tspan>{d.id}</tspan>}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    defs={[
      {
        id: "dots",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "inherit", opacity: 0.1 },
          { offset: 100, color: "inherit", opacity: 0.1 },
        ],
      },
      {
        id: "lines",
        // opacity: 0.9,
        type: "patternLines",
      },
    ]}
    fill={[
      {
        match: {
          id: "c",
        },
        id: "lines",
      },
      {
        match: {
          id: "rust",
        },
        id: "lines",
      },
      {
        match: {
          id: "css",
        },
        id: "dots",
      },
      {
        match: {
          id: "make",
        },
        id: "dots",
      },
      {
        match: {
          id: "hack",
        },
        id: "dots",
      },
    ]}
  />
);
function App() {
  return <MyResponsivePieCanvas />;
}
export default React.memo(App);
