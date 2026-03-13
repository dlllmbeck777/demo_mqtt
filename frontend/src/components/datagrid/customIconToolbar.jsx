import * as React from "react";
import { Grid } from "@mui/material";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid-pro";
import { MyTooltip } from "..";
const CustomIconToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        "& .MuiInputBase-input": {
          padding: "0px important",
        },
        "& .MuiDataGrid-cellContent": {
          fontSize: "1rem",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontSize: "1.1rem",
        },
      }}
    >
      <Grid
        container
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Grid item sx={{ alignItems: "center", displat: "flex" }}>
          <MyTooltip resourceId={"TOOLTIP_SHOW_FILTER"}>
            <GridToolbarFilterButton />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_FIND_COLUMN"}>
            <GridToolbarColumnsButton />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_SHOW_DENSITY"}>
            <GridToolbarDensitySelector />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_SHOW_EXPORT"}>
            <GridToolbarExport />
          </MyTooltip>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
};

export default React.memo(CustomIconToolbar);
