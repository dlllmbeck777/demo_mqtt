import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";

import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import StepOne from "./stepOne";
import LineAssets from "../../highchart/popUpLayout/lineAssets";
import { fillMandatory } from "../../../services/actions/stepper/stepper";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import StepThree from "./stepThree";
function MatrixNewPopUp() {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const stopsNum = useSelector(
    (state) => state.overviewDialog.highchartProps.Stops
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  React.useEffect(() => {
    dispatch(fillMandatory([["Name", "Alarms"], ["Assets"]]));
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
    [type?.["Settings"], <StepThree />],
  ];
}

export default MatrixNewPopUp;
