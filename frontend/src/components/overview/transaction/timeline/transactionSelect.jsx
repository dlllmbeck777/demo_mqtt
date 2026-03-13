import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { Select } from "../../..";
import { changeValeus } from "../../../../services/actions/overview/overviewDialog";
import { fetchFormItems } from "../../../../services/actions/overview/overviewDialog";
const SpectralWaweformSelect = () => {
  const dispatch = useDispatch();
  const typeKey = useSelector((state) => state.overviewDialog.values);

  const transactionVal = useSelector(
    (state) => state.overviewDialog.highchartProps["Transaction"]
  );
  const [transaction, setTransaction] = React.useState([]);

  const handleTransaction = (val) => {
    dispatch(changeValeus("Transaction", val));
  };

  React.useEffect(() => {
    async function asyncLoadFunc() {
      try {
        const res = await dispatch(fetchFormItems());
        console.log(res);
        setTransaction(res);
      } catch (err) {
        console.log(err);
        console.log("catch");
      }
    }
    asyncLoadFunc();
  }, []);
  return (
    <Grid item xs={12} sm={6}>
      <Grid container rowGap={0.5}>
        <Grid item xs={12}>
          {typeKey?.["Transaction"]}
        </Grid>
        <Grid item xs={12}>
          <Select
            defaultValue={transactionVal}
            handleChangeFunc={(val) => {
              handleTransaction(val);
            }}
            values={transaction}
            valuesPath={"TYPE"}
            dataTextPath={"TYPE"}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SpectralWaweformSelect;
