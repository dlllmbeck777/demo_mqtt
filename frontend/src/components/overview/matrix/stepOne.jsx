import React from "react";
import { useSelector } from "react-redux";

import { Grid } from "@mui/material";

import PopUpItem from "../../highchart/popUpLayout/popUpItem";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import MyList from "../utils/popUpUtils/list";
const StepOne = () => {
  const FontSize = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Default Font Size"]
  );

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
              <PopUpItem type="number" title="Widget Refresh (seconds)" />
              <Grid item xs={6}></Grid>
              <PopUpItem
                type="number"
                title="Asset Font Size"
                disabled={FontSize}
              />
              <Grid item xs={6}></Grid>
              <PopUpItem
                type="number"
                title="Tag Name Font Size"
                disabled={FontSize}
              />
              <PopUpItem
                type="number"
                title="Value Font Size"
                disabled={FontSize}
              />
              <PopUpItem
                type="number"
                title="UoM Font Size"
                disabled={FontSize}
              />
              <PopUpItem type="number" title="Decimal Places" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3.5}>
        <Grid container>
          <Grid item xs={12}>
            <MyList
              array={[
                "Name",
                "Horizontal",
                "Unit of Measurement",
                "Measurement",
                "Boundaries",
                "Default Font Size",
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StepOne;
