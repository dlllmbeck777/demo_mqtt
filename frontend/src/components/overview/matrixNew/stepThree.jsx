import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import { MyNumberTextField, ColorTextfield } from "../../";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
const Helper = ({ name }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const color = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`${name} Color`]
  );
  const opacity = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`${name} Opacity`]
  );

  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  return (
    <Grid container columnSpacing={2} rowGap={1} key={name} sx={{ mb: 1 }}>
      <Grid item xs={12} md={3}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.[`${name} Opacity`]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              defaultValue={opacity}
              handleChangeFunc={(value) => {
                handleChangeFunc(`${name} Opacity`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.[`${name} Color`]}
          </Grid>
          <Grid item xs={12}>
            <ColorTextfield
              defaultValue={color}
              handleChangeFunc={(value) => {
                handleChangeFunc(`${name} Color`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const Settings = () => {
  return (
    <Grid container rowGap={1}>
      {["Error", "Warning", "Info"].map((e) => {
        return (
          <Grid item xs={12}>
            <Helper name={e} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Settings;
