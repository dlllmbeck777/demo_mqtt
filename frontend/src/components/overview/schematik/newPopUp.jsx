import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import { fillMandatory } from "../../../services/actions/stepper/stepper";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
import "../../../assets/styles/page/overview/popUpLayout.scss";
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
    [type?.["Measurement"], <StepTwo />],
    [type?.["Stops"], <StepThree />],
  ];
}

export default LineChartPopUp;
