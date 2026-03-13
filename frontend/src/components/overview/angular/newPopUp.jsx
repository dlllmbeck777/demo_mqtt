import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@mui/material";

import CreateWidget from "../../highchart/popUpLayout/createWidget";
import ChoseMeasure from "../../highchart/popUpLayout/choseMeasure";
import { Stops } from "../../highchart/popUpLayout/stops";
import Measurement from "../../highchart/popUpLayout/measurement";
import Stop from "../../highchart/popUpLayout/stop";
import { fillMandatory } from "../../../services/actions/stepper/stepper";
import "../../../assets/styles/page/overview/popUpLayout.scss";
function AngularPopUp() {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  React.useEffect(() => {
    dispatch(fillMandatory([["Name"], ["Measurement"]]));
  }, []);
  return [
    [type?.["Properties"], <CreateWidget />],
    [type?.["Measurement"], <ChoseMeasure />],
    [
      type?.["Stops"],
      <Grid container rowGap={2} className="pop-up-layout-font-size">
        <Grid item xs={12}>
          <Grid container columnSpacing={2} rowGap={2}>
            <Measurement />
            <Grid item xs={12} sm={6} md={3}>
              <Grid container rowGap={0.5}>
                <Grid item xs={12}>
                  <Stop />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Stops />
      </Grid>,
    ],
  ];
}

export default AngularPopUp;
