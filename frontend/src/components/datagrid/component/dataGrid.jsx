import React from "react";
import { useSelector } from "react-redux";
import { DataGridPro } from "@mui/x-data-grid-pro";
import * as local from "@mui/x-data-grid-pro";
import { CustomNoRowsOverlay } from "../customNoRowOwerlay";
import CustomToolbar from "../customToolbar";
import { Box, LinearProgress } from "@mui/material";

import "../../../assets/styles/components/dataGrid/datagrid.scss";
const DataGrid = ({
  Toolbar = CustomToolbar,
  sortModelProp = [{}],
  ...props
}) => {
  const [sortModel, setSortModel] = React.useState(sortModelProp);
  const loading = useSelector((state) => state.datagrid.loading);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const { [CULTURE.replace(/-/g, "")]: translate } = local;
  return (
    <Box className="datagrid-box">
      <DataGridPro
        className="datagrid-box__datagrid"
        localeText={{
          ...translate.components.MuiDataGrid.defaultProps.localeText,
          toolbarColumns: "",
          toolbarFilters: "",
          toolbarDensity: "",
          toolbarExport: "",
        }}
        density="compact"
        components={{
          Toolbar: Toolbar,
          NoRowsOverlay: CustomNoRowsOverlay,
          LoadingOverlay: LinearProgress,
        }}
        loading={loading}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        {...props}
      />
    </Box>
  );
};

export default React.memo(DataGrid);
