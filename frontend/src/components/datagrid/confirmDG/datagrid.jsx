import React from "react";
import { useSelector } from "react-redux";
import { DataGridPro } from "@mui/x-data-grid-pro";
import * as local from "@mui/x-data-grid-pro";
import { CustomNoRowsOverlay } from "../customNoRowOwerlay";
import CustomToolbar from "../customToolbar";
const DataGrid = () => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const { [CULTURE.replace(/-/g, "")]: translate } = local;
  const createdRows = useSelector((state) => state.datagrid.createdRows);
  const updatedRows = useSelector((state) => state.datagrid.updatedRows);
  const deletedRows = useSelector((state) => state.datagrid.deletedRows);
  const originalColumns = useSelector((state) => state.datagrid.columns);
  const rows = useSelector((state) => state.datagrid.rows);
  const columns = originalColumns.map((column) => ({
    ...column,
    editable: false,
  }));
  const getRowClassName = (params) => {
    if (createdRows.includes(params.row.id)) return "createdRows";
    if (updatedRows.includes(params.row.id)) return "updatedRows";
    if (deletedRows.find((e) => e.id === params.row.id)) return "deletedRows";
  };

  return (
    <DataGridPro
      localeText={{
        ...translate.components.MuiDataGrid.defaultProps.localeText,
        toolbarColumns: "",
        toolbarFilters: "",
        toolbarDensity: "",
        toolbarExport: "",
      }}
      columns={columns}
      rows={[...rows]}
      density="compact"
      getRowClassName={getRowClassName}
      components={{
        Toolbar: CustomToolbar,
        NoRowsOverlay: CustomNoRowsOverlay,
      }}
      sx={{
        width: "700px",
        height: "500px",
        "& .createdRows": {
          backgroundColor: "rgba(0,128,0,0.5)",
        },
        "& .updatedRows": {
          backgroundColor: "rgba(215,215,0,0.5)",
        },
        "& .deletedRows": {
          backgroundColor: "rgba(255,0,0,0.5)",
        },
      }}
    />
  );
};

export default React.memo(DataGrid);
