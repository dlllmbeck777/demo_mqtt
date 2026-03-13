import React from "react";
import { Highchart, ComponentError } from "../../../components";
const OverviewEditor = ({
  highchartProps,
  width,
  height,
  liveData,
  backfillData,
  tabular,
}) => {
  if (highchartProps.Name !== "") {
    return (
      <ComponentError errMsg="Error">
        <Highchart
          highchartProps={highchartProps}
          width={width}
          height={height}
          liveData={liveData}
          backfillData={backfillData}
          tabular={tabular}
        />
      </ComponentError>
    );
  }
  return <></>;
};

export default OverviewEditor;
