import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";

import InputGenerator from "../../inputGenerator/inputGenerator";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
const PopUpItem = (props) => {
  const dispatch = useDispatch();
  const typeKey = useSelector((state) => state.overviewDialog.values);
  const { title, type, nullTrue, ...rest } = props;
  const defaultValue = useSelector(
    (state) => state.overviewDialog.highchartProps[title]
  );
  const handleChangeFunc = (val) => {
    dispatch(changeValeus(title, val));
  };
  return (
    <Grid item xs={12} sm={6}>
      <Grid container rowGap={0.5}>
        <Grid item xs={12}>
          {typeKey?.[title]}
        </Grid>
        <Grid item xs={12}>
          <InputGenerator
            type={type}
            defaultValue={defaultValue}
            changefunction={handleChangeFunc}
            error={defaultValue === "" && nullTrue}
            {...rest}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PopUpItem;
