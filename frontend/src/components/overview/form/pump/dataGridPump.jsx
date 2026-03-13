import React from "react";
import DataGrid from "../../../datagrid/dataGrid";
import { CustomNoRowsOverlay } from "../../../datagrid/customNoRowOwerlay";
import ItemService from "../../../../services/api/item";
import { useDispatch, useSelector } from "react-redux";
import CustomToolbar from "../customToolbar";
import { deleteForm } from "../../../../services/actions/overview/form";
import {
  fetchData,
  formatData,
} from "../../../../services/actions/datagrid/columns";
import { LinearProgress } from "@mui/material";
const DataGridDT = ({
  chartProps,
  newFunc,
  setFormValue,
  page,
  setPage,
  saveFunc,
}) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const ITEM_ID = useSelector(
    (state) => state.collapseMenu.selectedItem?.FROM_ITEM_ID
  );
  const [rowCount, setRowCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [columns, setColumns] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [sortModel, setSortModel] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedRows, setSelectedRows] = React.useState();
  const [selectedPage, setSelectedPage] = React.useState(0);
  const [classUuid, setClassUuid] = React.useState(true);
  async function loadDataGridData(nextPage, ps) {
    try {
      setData([]);
      setLoading(true);
      console.log(
        JSON.stringify({
          ITEM_ID,
          EVENT_TYPE: chartProps?.TYPE,
        })
      );
      let res = await ItemService.getTransactionPagination(
        CULTURE,
        ITEM_ID,
        chartProps?.TYPE,
        ps,
        nextPage + 1
      );
      console.log(res);
      setRowCount(res?.data?.count);
      let val = [];
      Promise.all(
        res.data?.results.map((e) => {
          val.push({ ...e, update: "" });
        })
      );
      setData(val);
      setFormValue({ ...res?.data?.results?.[0], update: "" });
      setClassUuid(res?.data?.results?.[0].id);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadDataGriColumns() {
    let res = await fetchData(CULTURE, chartProps?.TYPE);
    let myColumns = formatData(res, false);
    setColumns(myColumns);
    setSortModel([
      {
        field: "START_DATETIME",
        sort: "desc",
      },
    ]);
  }
  React.useEffect(() => {
    loadDataGriColumns();
  }, []);
  React.useEffect(() => {
    loadDataGridData(0, pageSize);
  }, [page]);
  const changePageModel = (event) => {
    console.log(event);
    setSelectedPage(event);
    loadDataGridData(event, pageSize);
  };
  const handleRowClick = (params) => {
    setFormValue(params.row);
    setClassUuid(params.row.id);
  };
  const refreshFunc = () => {
    setPage((prev) => !prev);
  };
  const getRowClassName = (params) => {
    return params.row.id === classUuid ? "highlightedRow" : "";
  };
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setSelectedPage(0);
    loadDataGridData(0, newPageSize);
  };
  const Toolbar = () => {
    return (
      <CustomToolbar
        saveFunc={saveFunc}
        refreshFunc={refreshFunc}
        newFunc={newFunc}
        deleteFunc={async () => {
          await dispatch(deleteForm(selectedRows));
          setPage((prev) => !prev);
        }}
      />
    );
  };
  return (
    <DataGrid
      rows={data}
      getRowId={(row) => row?.ROW_ID}
      checkboxSelection={true}
      disableSelectionOnClick={true}
      loading={loading}
      onSelectionModelChange={(row) => setSelectedRows(row)}
      onRowClick={handleRowClick}
      components={{
        Toolbar: Toolbar,
        NoRowsOverlay: CustomNoRowsOverlay,
        LoadingOverlay: LinearProgress,
      }}
      columns={columns}
      sortModel={sortModel}
      onSortModelChange={(model) => setSortModel(model)}
      pagination
      paginationMode="server"
      rowCount={rowCount}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      page={selectedPage}
      onPageChange={(model) => changePageModel(model)}
      rowsPerPageOptions={[10, 25, 50]}
      getRowClassName={getRowClassName}
      sx={{
        "& .highlightedRow": {
          backgroundColor: "#bdbdbd",
        },
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          justifyContent: "space-between",
        },
        ".MuiDataGrid-cell": {
          padding: 0,
        },
      }}
    />
  );
};

export default React.memo(DataGridDT);
