import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, List } from "@mui/material";

import PopUpItem from "./popUpItem";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import MyList from "../../overview/utils/popUpUtils/list";
const CreateWidget = ({ enableExport = true }) => {
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
      <Grid item xs={12} sm={9}>
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
              <PopUpItem
                type="number"
                title="Time Stamp Font Size"
                disabled={FontSize}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Grid container>
          <Grid item xs={12}>
            <MyList
              array={[
                "Name",
                "Tag Name",
                "Measurement",
                "Unit of Measurement",
                "Timestamp",
                enableExport && "Enable Export",
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

export default CreateWidget;
