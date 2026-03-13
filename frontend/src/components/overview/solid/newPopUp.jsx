import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@mui/material";

import { MyNumberTextField, ColorTextfield } from "../..";
import {
  changeValeus,
  cleanStops,
} from "../../../services/actions/overview/overviewDialog";
import CreateWidget from "../../highchart/popUpLayout/createWidget";
import ChoseMeasure from "../../highchart/popUpLayout/choseMeasure";
import Measurement from "../../highchart/popUpLayout/measurement";
import { fillMandatory } from "../../../services/actions/stepper/stepper";
import "../../../assets/styles/page/overview/popUpLayout.scss";
const Stops = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const highchartProps = useSelector(
    (state) => state.overviewDialog.highchartProps
  );
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Boundaries"]
  );
  var loop = [];
  for (let i = 0; i < highchartProps.Stops; i++) {
    loop.push(i);
  }
  console.log('LOOP -------------<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>------------ ' + loop);
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };

  return (
    <React.Fragment>
      {loop.map((e, i) => {
        return (
          <Grid item xs={12} key={i}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={12}>
                    {`[${e}] ${type?.["Stops"]}`}
                  </Grid>
                  <Grid item xs={12}>
                    <MyNumberTextField
                      disabled={!boundaries}
                      defaultValue={highchartProps[`[${e}] Stops`]}
                      handleChangeFunc={(value) => {
                        handleChangeFunc(`[${e}] Stops`, value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={12}>
                    {`[${e}] ${type?.["Color"]}`}
                  </Grid>
                  <Grid item xs={12}>
                    <ColorTextfield
                      disabled={!boundaries}
                      defaultValue={highchartProps[`[${e}] Color`]}
                      handleChangeFunc={(value) => {
                        handleChangeFunc(`[${e}] Color`, value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </React.Fragment>
  );
};
function SolidNew() {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const stopsNum = useSelector(
    (state) => state.overviewDialog.highchartProps.Stops
  );

  React.useEffect(() => {
    dispatch(fillMandatory([["Name"], ["Measurement"]]));
  }, []);
  return [
    [type?.["Properties"], <CreateWidget />],
    [type?.["Measurement"], <ChoseMeasure />],
    [
      type?.["Stops"],
      <>
        <Grid container rowGap={2} className="pop-up-layout-font-size">
          <Grid item>
            <Grid container columnSpacing={2}>
              <Measurement />
              <Grid item xs={12} sm={6} md={3}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={12}>
                    {type?.["Stops"]}
                  </Grid>
                  <Grid item xs={12}>
                    <MyNumberTextField
                      defaultValue={stopsNum}
                      handleChangeFunc={(value) => {
                        dispatch(
                          cleanStops("Stops", value, ["Stops", "Color"])
                        );
                      }}
                      className="overview-number-text-field"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Stops />
        </Grid>
      </>,
    ],
  ];
}

export default SolidNew;
