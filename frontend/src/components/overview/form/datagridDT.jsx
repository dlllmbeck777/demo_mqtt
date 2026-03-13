import React, { Children } from "react";
import DataGrid from "../../datagrid/dataGrid";
import { CustomNoRowsOverlay } from "../../datagrid/customNoRowOwerlay";
import ItemService from "../../../services/api/item";
import { useDispatch, useSelector } from "react-redux";
import { dateFormatDDMMYYHHMM } from "../../../services/utils/dateFormatter";
import DgCodeCell from "./dgCodeCell";
import CustomToolbar from "./customToolbar";
import { deleteForm } from "../../../services/actions/overview/form";
import { LinearProgress } from "@mui/material";
import ShowPdf from "./showPdf";
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
  const [classUuid, setClassUuid] = React.useState(true);
  const [rowCount, setRowCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [sortModel, setSortModel] = React.useState([
    {
      field: "START_DATETIME",
      sort: "desc",
    },
  ]);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedPage, setSelectedPage] = React.useState(0);
  const [type, setType] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  async function loadDataGridData(nextPage, ps) {
    try {
      setData([]);
      setLoading(true);
      let res = await ItemService.getTransactionPagination(
        CULTURE,
        ITEM_ID,
        "DOWNTIME",
        ps,
        nextPage + 1
      );
      setRowCount(res?.data?.count);
      let val = [];
      console.log(res.data);
      Promise.all(
        res.data?.results.map((e) => {
          val.push({ ...e, update: "" });
        })
      );
      setFormValue({ ...res?.data?.results?.[0], update: "" });
      setClassUuid(res?.data?.results?.[0].id);
      setData(val);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    loadDataGridData(0, pageSize);
  }, [page]);
  const changePageModel = (event) => {
    setSelectedPage(event);
    loadDataGridData(event, pageSize);
  };
  async function myAsyncFunc() {
    try {
      let res = await ItemService.getTypePropertyNoToken({
        CULTURE,
        TYPE: chartProps?.TYPE,
      });
      setType(res?.data?.[chartProps?.TYPE]);
    } catch {
      setData([]);
    }
  }
  React.useEffect(() => {
    myAsyncFunc();
  }, []);

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
      columns={[
        {
          field: "START_DATETIME",
          headerName: type?.find((e) => e.COLUMN_NAME === "START_DATETIME")
            ?.SHORT_LABEL,
          width: 100,
          renderCell: (params) => {
            return dateFormatDDMMYYHHMM(new Date(params.value));
          },
        },
        {
          field: "CHAR11",
          headerName: type?.find((e) => e.COLUMN_NAME === "CHAR11")
            ?.SHORT_LABEL,
          type: "boolean",
          width: 75,
          valueGetter: (params) => {
            return params?.value === "True";
          },
        },
        {
          field: "END_DATETIME",
          headerName: type?.find((e) => e.COLUMN_NAME === "END_DATETIME")
            ?.SHORT_LABEL,
          width: 100,
          renderCell: (params) => {
            return dateFormatDDMMYYHHMM(new Date(params.value));
          },
        },
        {
          field: "VAL1",
          headerName: type?.find((e) => e.COLUMN_NAME === "VAL1")?.SHORT_LABEL,
          width: 100,
        },
        {
          field: "CHAR1",
          headerName: type?.find((e) => e.COLUMN_NAME === "CHAR1")?.SHORT_LABEL,
          width: 200,
          renderCell: (params) => {
            return <DgCodeCell value={params.value} />;
          },
        },
        {
          field: "CHAR2",
          width: 200,
          headerName: type?.find((e) => e.COLUMN_NAME === "CHAR2")?.SHORT_LABEL,
        },
        {
          field: "CHAR10",
          width: 200,
          headerName: type?.find((e) => e.COLUMN_NAME === "CHAR10")
            ?.SHORT_LABEL,
        },
        {
          field: "PDF_FILE",
          width: 50,
          headerName: type?.find((e) => e.COLUMN_NAME === "PDF_FILE")
            ?.SHORT_LABEL,
          renderCell: (params) => {
            return <ShowPdf params={params} />;
          },
        },
      ]}
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
          backgroundColor: "#9e9e9e",
          color: "white",
        },
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          justifyContent: "space-between",
        },
      }}
    />
  );
};

export default DataGridDT;
