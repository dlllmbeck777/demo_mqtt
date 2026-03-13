import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";

import { changeValeus } from "../../../../services/actions/overview/overviewDialog";
import CreateLineWidget from "../../../highchart/popUpLayout/createLineWidget";
import LineAssets from "../../../highchart/popUpLayout/lineAssets";
import CustomLineChart from "../../../highchart/popUpLayout/customLineChart";
import { fillMandatory } from "../../../../services/actions/stepper/stepper";
import Inputs from "../../../highchart/popup/inputs";
import "../../../../assets/styles/page/overview/popUpLayout.scss";
import StepOne from "./stepOne";
function LineChartPopUp() {
  const dispatch = useDispatch();
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  const type = useSelector((state) => state.overviewDialog.values);
  const stopsNum = useSelector(
    (state) => state.overviewDialog.highchartProps.Stops
  ); //it is mandatory strangely
  React.useEffect(() => {
    dispatch(fillMandatory([["Name"], ["Assets"]]));
  }, []);
  return [
    [type?.["Properties"], <StepOne />],
    [
      type?.["Assets"],
      <LineAssets
        handleChangeFunc={(value) => {
          handleChangeFunc("Assets", value);
        }}
      />,
    ],
    [
      type?.["Inputs"],
      <Inputs
        handleChangeFunc={(value) => {
          handleChangeFunc("Inputs", value);
        }}
      />,
    ],
    [type?.["Settings"], <CustomLineChart />],
  ];
}

export default LineChartPopUp;
