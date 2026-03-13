import React from "react";
import { Grid, Button, LinearProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DataGrid from "../../../../components/datagrid/component/dataGrid";
import { CustomNoRowsOverlay } from "../../../../components/datagrid/customNoRowOwerlay";
import { setDatagridColumns } from "../../../../services/actions/datagrid/columns";
import { cleanDatagrid } from "../../../../services/actions/datagrid/datagrid";
import Toolbar from "./dgActionMenu";
const MemoizedDataGrid = React.memo(
  ({ columns, rows }) => {
    return (
      <DataGrid
        sx={{
          "& .MuiDataGrid-cell": {
            padding: 0,
          },
        }}
        columns={columns}
        rows={rows}
        components={{
          Toolbar: Toolbar,
          NoRowsOverlay: CustomNoRowsOverlay,
          LoadingOverlay: LinearProgress,
        }}
        rowBuffer={10}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.columns.length === nextProps.columns.length &&
      prevProps.rows.length === nextProps.rows.length
    );
  }
);
const LoaderEditor = () => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const columns = useSelector((state) => state?.datagrid?.columns);
  const type = useSelector((state) => state?.loaderPage?.dgHelper);
  const rows = useSelector((state) => state?.datagrid?.rows);

  async function myAsyncFunc() {
    try {
      dispatch(setDatagridColumns(CULTURE, type?.TYPE));
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    myAsyncFunc();
    return () => {
      dispatch(cleanDatagrid());
    };
  }, [type]);

  return (
    <Grid
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <MemoizedDataGrid columns={columns} rows={rows} />
    </Grid>
  );
};

export default React.memo(LoaderEditor);
