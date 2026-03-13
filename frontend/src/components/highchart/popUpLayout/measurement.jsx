import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, IconButton } from "@mui/material";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import MyNumberTextField from "../../textfield/numberTextField";
import RefreshIcon from "@mui/icons-material/Refresh";
const Measurement = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const minimum = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Minimum"]
  );
  const minimumTag = useSelector(
    (state) => state.overviewDialog.highchartProps?.Measurement?.[0]?.LIMIT_LOLO
  );
  const tagNormalMinimum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.Measurement?.[0]?.NORMAL_MINIMUM
  );
  const normalMinimum = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Normal Minimum"]
  );
  const tagMormalMaximum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.Measurement?.[0]?.NORMAL_MAXIMUM
  );
  const normalMaximum = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Normal Maximum"]
  );
  const tagMaximum = useSelector(
    (state) => state.overviewDialog.highchartProps?.Measurement?.[0]?.LIMIT_HIHI
  );
  const maximum = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Maximum"]
  );
  const highchartProps = useSelector(
    (state) => state.overviewDialog.highchartProps
  );
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Boundaries"]
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  return (
    <React.Fragment>
      <Grid item xs={12} sm={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["Minimum"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              defaultValue={minimum}
              disabled={!boundaries}
              handleChangeFunc={(value) => {
                handleChangeFunc("Minimum", value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["Normal Minimum"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              defaultValue={normalMinimum}
              disabled={!boundaries}
              handleChangeFunc={(value) => {
                handleChangeFunc("Normal Minimum", value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={3} sx={{ marginTop: "auto" }}>
        <IconButton
          variant="outlined"
          disabled={!boundaries}
          onClick={() => {
            handleChangeFunc("Minimum", parseFloat(minimumTag));
            handleChangeFunc("Normal Minimum", parseFloat(tagNormalMinimum));
            handleChangeFunc("Normal Maximum", parseFloat(tagMormalMaximum));
            handleChangeFunc("Maximum", parseFloat(tagMaximum));
            handleChangeFunc("Stops", 3);
            handleChangeFunc("[0] Stops", parseFloat(tagNormalMinimum));
            handleChangeFunc("[0] Low", parseFloat(minimumTag));
            handleChangeFunc("[0] High", parseFloat(tagNormalMinimum));
            handleChangeFunc("[0] Color", "#008000");
            handleChangeFunc("[1] Stops", parseFloat(tagMormalMaximum));
            handleChangeFunc("[1] Low", parseFloat(tagNormalMinimum));
            handleChangeFunc("[1] High", parseFloat(tagMormalMaximum));
            handleChangeFunc("[1] Color", "#d7d700");
            handleChangeFunc("[2] Stops", parseFloat(maximum));
            handleChangeFunc("[2] Low", parseFloat(tagMormalMaximum));
            handleChangeFunc("[2] High", parseFloat(tagMaximum));
            handleChangeFunc("[2] Color", "#ff0000");
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} sm={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["Normal Maximum"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              defaultValue={normalMaximum}
              disabled={!boundaries}
              handleChangeFunc={(value) => {
                handleChangeFunc("Normal Maximum", value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["Maximum"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              defaultValue={maximum}
              disabled={!boundaries}
              handleChangeFunc={(value) => {
                handleChangeFunc("Maximum", value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Measurement;
