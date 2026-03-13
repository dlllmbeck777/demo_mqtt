import React from "react";
import { useSelector } from "react-redux";
import { DataGridPro } from "@mui/x-data-grid-pro";
import * as local from "@mui/x-data-grid-pro";
import { CustomNoRowsOverlay } from "./customNoRowOwerlay";
import CustomToolbar from "./customToolbar";
const DataGrid = (props) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const { [CULTURE.replace(/-/g, "")]: translate } = local;
  return (
    <DataGridPro
      localeText={{
        ...translate.components.MuiDataGrid.defaultProps.localeText,
        toolbarColumns: "",
        toolbarFilters: "",
        toolbarDensity: "",
        toolbarExport: "",
      }}
      density="compact"
      components={{
        Toolbar: CustomToolbar,
        NoRowsOverlay: CustomNoRowsOverlay,
      }}
      {...props}
    />
  );
};

export default React.memo(DataGrid);
