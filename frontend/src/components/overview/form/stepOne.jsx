import React from "react";
import { useSelector } from "react-redux";

import { Grid } from "@mui/material";

import PopUpItem from "../../highchart/popUpLayout/popUpItem";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import MyList from "../utils/popUpUtils/list";
import CodelistService from "../../../services/api/codeList";
const StepOne = () => {
  const FontSize = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Default Font Size"]
  );
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [positionValues, setPositionValues] = React.useState([]);

  const asyncLoadFunc = async () => {
    const body = JSON.stringify({ CULTURE, CODE_LIST: "FORM_POSITIONS" });
    try {
      let res = await CodelistService.getItemPropCode(body);
      console.log(res?.data);
      setPositionValues((prev) => [...res?.data]);
    } catch (err) {}
  };

  React.useEffect(() => {
    asyncLoadFunc();
  }, []);
  return (
    <Grid
      container
      columnSpacing={2}
      rowGap={2}
      className="pop-up-layout-font-size"
    >
      <Grid item xs={12} sm={8.5}>
        <Grid container rowGap={2}>
          <Grid item xs={12}>
            <Grid container columnSpacing={2} rowGap={2}>
              <PopUpItem type="text" title="Name" nullTrue={true} />
              <PopUpItem
                type="number"
                title="Name Font Size(em)"
                disabled={FontSize}
              />
              <PopUpItem
                type="select"
                title="Position"
                values={positionValues}
                valuesPath="CODE"
                dataTextPath="CODE_TEXT"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3.5}>
        <Grid container>
          <Grid item xs={12}>
            <MyList array={["Name", "Default Font Size"]} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StepOne;
