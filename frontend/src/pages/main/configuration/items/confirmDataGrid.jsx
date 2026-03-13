import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import * as local from "@mui/x-data-grid-pro";
import CustomColumnMenu from "../organization/dataGrid/customColumnMenu";

import { MyTextFieldRender } from "../organization/myTextField";
const MyDataGrid = () => {
  const columns = useSelector((state) => state.companyDataGrid.columns);
  const rows = useSelector((state) => state.companyDataGrid.rows);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [myColumn, setMyColumn] = React.useState(false);
  const [sortModel, setSortModel] = React.useState([
    {
      field: "SORT_ORDER",
      sort: "asc",
    },
  ]);
  const { [CULTURE.replace(/-/g, "")]: translate } = local;
  const pinnedRows = {
    top: [rows.HISTORY],
    bottom: [],
  };

  React.useEffect(() => {
    var myColumnsTemp = {};
    Object.keys(columns).map((e, i) => {
      if (i > 3) {
        var temp = {
          ...columns[e],
          editable: false,
          renderCell: MyTextFieldRender,
        };
      } else {
        var temp = {
          ...columns[e],
        };
      }
      delete temp.renderEditCell;
      //delete temp.renderCell;
      myColumnsTemp[e] = temp;
      setMyColumn(myColumnsTemp);
    });
  }, []);
  if (Object.keys(rows).length !== 0 && myColumn) {
    return (
      <Box
        sx={{
          width: `500px`,
          minHeight: "400px",
          height: "400px",

          button: { color: "text.primary" },
          "& .MuiDataGrid-cellContent": {
            fontSize: "1rem",
          },
          border: "0.5px solid",

          borderRadius: "5px",
        }}
      >
        <DataGridPro
          rows={Object.values(rows)}
          density="compact"
          columns={Object.values(myColumn)}
          localeText={{
            ...translate.components.MuiDataGrid.defaultProps.localeText,
            toolbarColumns: "",
            toolbarFilters: "",
            toolbarDensity: "",
            toolbarExport: "",
          }}
          hideFooter={true}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
          getRowId={(row) => row.PROPERTY_NAME}
          pinnedRows={pinnedRows}
          experimentalFeatures={{ rowPinning: true }}
          disableSelectionOnClick={true}
          disableVirtualization={true}
        />
      </Box>
    );
  }
};

export default MyDataGrid;
