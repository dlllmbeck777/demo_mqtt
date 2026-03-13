import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { changeValeus } from "../../../../services/actions/overview/overviewDialog";
import ProcessDef from "../../utils/popUpUtils/processDef";
import { fillMandatory } from "../../../../services/actions/stepper/stepper";
import "../../../../assets/styles/page/overview/popUpLayout.scss";

import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
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
    dispatch(fillMandatory([["Name"]]));
  }, []);
  return [
    [type?.["Properties"], <StepOne />],
    [type?.["Transaction"], <StepTwo />],
    [
      type?.["Process Defination"],
      <ProcessDef
        handleChangeFunc={(value) => {
          handleChangeFunc("Process Defination", value);
        }}
      />,
    ],
    // [type?.["Settings"], <CustomLineChart />],
  ];
}

export default LineChartPopUp;
