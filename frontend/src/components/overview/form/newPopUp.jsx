import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fillMandatory } from "../../../services/actions/stepper/stepper";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import StepOne from "./stepOne";
function AngularPopUp() {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  React.useEffect(() => {
    dispatch(fillMandatory([["Name"]]));
  }, []);
  return [[type?.["Properties"], <StepOne />]];
}

export default AngularPopUp;
