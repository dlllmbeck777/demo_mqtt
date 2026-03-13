import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { changeValeus } from "../../../../services/actions/overview/overviewDialog";
import { IndentSelect, Select } from "../../../";
import TransactionSelect from "./transactionSelect";
import "../../../../assets/styles/page/overview/popUpLayout.scss";
const ChoseMeasure = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const ItemData = useSelector((state) => state.overviewDialog.itemData);
  const defProp = useSelector(
    (state) => state.overviewDialog.highchartProps["Transaction Property"]
  );

  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };

  return (
    <Grid
      container
      columnSpacing={2}
      rowGap={2}
      className="pop-up-layout-font-size"
    >
      <Grid item xs={12} md={6}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["Transaction Property"]}
          </Grid>
          <Grid item xs={12}>
            <IndentSelect
              disabled={ItemData.length === 0 ? true : false}
              values={ItemData}
              valuesPath="0"
              dataTextPath="1"
              indentPath="2"
              defaultValue={defProp}
              handleChangeFunc={async (value) => {
                handleChangeFunc("Transaction Property", value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <TransactionSelect />
    </Grid>
  );
};

export default ChoseMeasure;
