import React from "react";
import { useSelector } from "react-redux";

import { Grid } from "@mui/material";

import PopUpItem from "./popUpItem";
import MyList from "../../overview/utils/popUpUtils/list";
import "../../../assets/styles/page/overview/popUpLayout.scss";
const CreateWidget = () => {
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
              <PopUpItem type="number" title="X-Axis Duration (minutes)" />
              <PopUpItem
                type="number"
                title="Graph Axis Value Font Size (em)"
                disabled={FontSize}
              />
              <PopUpItem
                type="number"
                title="Graph Axis Title Font Size (em)"
                disabled={FontSize}
              />
              <PopUpItem
                type="number"
                title="Graph Legend Font Size (em)"
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
                "Enable Name",
                "Enable Navbar",
                "Enable Export",
                "Enable Range Selector",
                "Enable Graph Legend",
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
