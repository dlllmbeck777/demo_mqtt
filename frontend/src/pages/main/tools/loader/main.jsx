import React from "react";
import { Grid } from "@mui/material";

import {
  Breadcrumb,
  ItemSperatorLineXL,
  ComponentError,
} from "../../../../components";

import { selectDrawerItem } from "../../../../services/actions/drawerMenu/drawerMenu";
import "../../../../assets/styles/layouts/template.scss";
import "../../../../assets/styles/page/tools/loader/loader.scss";
import LoaderEditor from "./loaderEditor";
import ActionMenu from "./actionMenu";

const Main = () => {
  document.title = "Ligeia.ai | Loader";
  selectDrawerItem("Loader");

  return (
    <Grid container className="template-container__body">
      <Breadcrumb />
      <ItemSperatorLineXL />
      <ComponentError errMsg="Error">
        <ActionMenu />
      </ComponentError>
      <ItemSperatorLineXL />
      <Grid
        item
        xs={12}
        className="template-container__body__property-box loader_container"
        sx={{
          "& .MuiDataGrid-cell": {
            fontSize: "1rem",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "1.1rem",
          },
        }}
      >
        <ComponentError errMsg="Error">
          <LoaderEditor />
        </ComponentError>
      </Grid>
    </Grid>
  );
};

export default Main;
