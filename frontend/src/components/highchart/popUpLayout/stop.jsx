import React from "react";
import { Grid } from "@mui/material";
import MyNumberTextField from "../../textfield/numberTextField";
import { useDispatch, useSelector } from "react-redux";
import { cleanStops } from "../../../services/actions/overview/overviewDialog";
const Stop = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const stopsNum = useSelector(
    (state) => state.overviewDialog?.highchartProps?.Stops
  );
  const Boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Boundaries"]
  );
  return (
    <>
      <Grid item xs={12}>
        {type?.["Stops"]}
      </Grid>
      <Grid item xs={12}>
        <MyNumberTextField
          defaultValue={stopsNum}
          disabled={!Boundaries}
          handleChangeFunc={(value) => {
            dispatch(cleanStops("Stops", value, ["Low", "High", "Color"]));
          }}
          className="overview-number-text-field"
        />
      </Grid>
    </>
  );
};

export default Stop;
