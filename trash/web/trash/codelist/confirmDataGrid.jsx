import React from "react";
import { useSelector } from "react-redux";
import { darken, lighten } from "@mui/material/styles";
import { Box } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { columns } from "../../../../frontend/src/pages/main/configuration/initialize/dataGridColumn";
const getBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const ConfirmDataGrid = () => {
  const [sortModel, setSortModel] = React.useState([
    {
      field: "CODE",
      sort: "asc",
    },
  ]);
  const rows = useSelector((state) => state.confirmCodeList.dataGridItems);
  return (
    <Box
      sx={{
        m: 0.5,
        button: {
          minWidth: "36px",
          height: "36px",
          borderRadius: "50px",
        },
      }}
    >
      <Box
        sx={{
          minHeight: "300px",
          height: "400px",
          width: "500px",
          "& .MuiDataGrid-cellContent": {
            fontSize: "16px",
          },
        }}
      >
        <DataGridPro
          sx={{
            "& .super-app-theme--create": {
              bgcolor: (theme) =>
                getBackgroundColor(
                  theme.palette.success.main,
                  theme.palette.mode
                ),
              "&:hover": {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(
                    theme.palette.success.main,
                    theme.palette.mode
                  ),
              },
            },
            "& .super-app-theme--change": {
              bgcolor: (theme) =>
                getBackgroundColor(
                  theme.palette.warning.main,
                  theme.palette.mode
                ),
              "&:hover": {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(
                    theme.palette.warning.main,
                    theme.palette.mode
                  ),
              },
            },
            "& .super-app-theme--delete": {
              bgcolor: (theme) =>
                getBackgroundColor(
                  theme.palette.error.main,
                  theme.palette.mode
                ),

              "&:hover": {
                bgcolor: (theme) =>
                  getHoverBackgroundColor(
                    theme.palette.error.main,
                    theme.palette.mode
                  ),
              },
            },
          }}
          getRowClassName={(params) =>
            `super-app-theme--${params.row.requestMethod}`
          }
          defaultGroupingExpansionDepth={1}
          hideFooter={true}
          rows={Object.values(rows)}
          columns={columns}
          getRowId={(row) => row.ROW_ID}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
        />
      </Box>
    </Box>
  );
};

export default ConfirmDataGrid;
