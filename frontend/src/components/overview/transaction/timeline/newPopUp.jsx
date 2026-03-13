import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { fillMandatory } from "../../../../services/actions/stepper/stepper";
import "../../../../assets/styles/page/overview/popUpLayout.scss";

import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
function LineChartPopUp() {
  const dispatch = useDispatch();

  const type = useSelector((state) => state.overviewDialog.values);
  const stopsNum = useSelector(
    (state) => state.overviewDialog.highchartProps.Stops
  ); //it is mandatory strangely
  React.useEffect(() => {
    dispatch(fillMandatory([["Name"]]));
  }, []);
  return [
    [type?.["Properties"], <StepOne />],
    [type?.["Process Defination"], <StepTwo />],
    // [type?.["Stops"], <StepThree />],
  ];
}

export default LineChartPopUp;
