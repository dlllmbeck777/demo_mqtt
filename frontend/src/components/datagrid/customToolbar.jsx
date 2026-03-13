import React from "react";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid-pro";
const csvOptions = { delimiter: ";" };
const customToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem options={csvOptions} />
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );
};

export default customToolbar;
