import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";

import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import StepOne from "./stepOne";
import LineAssets from "../../highchart/popUpLayout/lineAssets";
import { fillMandatory } from "../../../services/actions/stepper/stepper";
import Inputs from "../../highchart/popup/inputs";
import Settings from "./settings";
import "../../../assets/styles/page/overview/popUpLayout.scss";
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
    dispatch(fillMandatory([["Name"], ["Assets"], ["Inputs"]]));
  }, []);
  return [
    [type?.["Properties"], <StepOne isNew={false} />],
    [
      type?.["Assets"],
      <Box className="overview-line-chart-hc-asset-box">
        <Box className="overview-line-chart-hc-asset-box__title">
          {type?.["Assets"]}
        </Box>
        <LineAssets
          handleChangeFunc={(value) => {
            handleChangeFunc("Assets", value);
          }}
        />
      </Box>,
    ],
    [
      type?.["Inputs"],
      <Box className="overview-line-chart-hc-asset-box">
        <Box className="overview-line-chart-hc-asset-box__title">
          {type?.["Inputs"]}
        </Box>
        <Inputs
          handleChangeFunc={(value) => {
            handleChangeFunc("Inputs", value);
          }}
          isNeedCalcTags={true}
        />
      </Box>,
    ],
    [type?.["Settings"], <Settings />],
  ];
}

export default MatrixNewPopUp;
