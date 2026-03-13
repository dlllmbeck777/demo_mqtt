import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { DataGridPro, GridToolbar } from "@mui/x-data-grid-pro";
import { grey } from "@mui/material/colors";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid-pro";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  setLoading,
  setDataGridItems,
  changeDataGridItems,
  cleanDataGridItems,
  setNewItem,
  setDeletedItem,
} from "../../../../frontend/src/services/reducers/childCodeList";
import { getParentCode } from "../../../../frontend/src/services/api/djangoApi/codeList";
import LinearProgress from "@mui/material/LinearProgress";

import { columns } from "../../../../frontend/src/pages/main/configuration/initialize/dataGridColumn";
import history from "../../../../frontend/src/routers/history";
import { CustomNoRowsOverlay } from "./customNoRowOwerlay";
import DropDownMenu from "./dropDownMenu";
const getTreeDataPath = (row) => row.HIERARCHY;
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
var myCheckboxSelection = [];
export default function TreeDataWithGap() {
  const dispatch = useDispatch();
  const codeListChild = useSelector((state) => state.codeListChild);
  const childCodeList = useSelector((state) => state.childCodeList);
  const culture = useSelector((state) => state.lang.cultur);
  const [newItemNum, setNewItemNum] = React.useState(1);
  const userEmail = useSelector((state) => state.auth.user.email);
  function CustomToolbar() {
    const codeListChildCurrentChild = useSelector(
      (state) => state.codeListChild.currentChild
    );
    const codeListChildRowId = useSelector(
      (state) => state.codeListChild.rowId
    );

    const mySetNewItem = () => {
      var uuid = uuidv4();
      setNewItemNum(newItemNum + 1);
      dispatch(
        setNewItem({
          uuid: uuid.replace(/-/g, ""),
          value: {
            HIERARCHY: [`${codeListChildRowId}`, `${uuid.replace(/-/g, "")}`],
            ROW_ID: uuid.replace(/-/g, ""),
            LIST_TYPE: codeListChildCurrentChild,
            CULTURE: culture,
            CODE: `(New ${newItemNum})`,
            CODE_TEXT: `(New ${newItemNum})`,
            PARENT: "",
            LEGACY_CODE: "",
            VAL1: "",
            VAL2: "",
            VAL3: "",
            DATE1: "",
            DATE2: "",
            CHAR1: "",
            CHAR2: "",
            LAYER_NAME: "",
            LAST_UPDT_USER: userEmail,
          },
        })
      );
    };
    const myDeleteChild = () => {
      myCheckboxSelection.map((e) => {
        dispatch(
          setDeletedItem({ key: e, value: childCodeList.dataGridItems[e] })
        );
      });
      myCheckboxSelection = [];
    };
    return (
      <GridToolbarContainer>
        <Grid
          container
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Grid item sx={{ alignItems: "center", displat: "flex" }}>
            <Tooltip
              title={"Add Child"}
              componentsProps={{
                tooltip: { sx: { backgroundColor: "primary.dark" } },
              }}
            >
              <IconButton
                onClick={() => {
                  mySetNewItem();
                }}
              >
                <AddBoxIcon fontSize="small" sx={{ color: "#4B4B4B" }} />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={"Delete Child"}
              componentsProps={{
                tooltip: { sx: { backgroundColor: "primary.dark" } },
              }}
            >
              <IconButton
                onClick={() => {
                  myDeleteChild();
                }}
              >
                <DeleteIcon fontSize="small" sx={{ color: "#4B4B4B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={"Show Filters"}
              componentsProps={{
                tooltip: { sx: { backgroundColor: "primary.dark" } },
              }}
            >
              <GridToolbarFilterButton
                sx={{
                  color: "#4B4B4B",
                  span: {
                    m: 0,
                  },
                }}
              />
            </Tooltip>
            <Tooltip
              title={"Find Column"}
              componentsProps={{
                tooltip: { sx: { backgroundColor: "primary.dark" } },
              }}
            >
              <GridToolbarColumnsButton
                sx={{
                  color: "#4B4B4B",
                  span: {
                    m: 0,
                  },
                }}
              />
            </Tooltip>
            <Tooltip
              title={"Show Density"}
              componentsProps={{
                tooltip: { sx: { backgroundColor: "primary.dark" } },
              }}
            >
              <GridToolbarDensitySelector
                sx={{
                  color: "#4B4B4B",
                  span: {
                    m: 0,
                  },
                }}
              />
            </Tooltip>
            <Tooltip
              title={"Show Export"}
              componentsProps={{
                tooltip: { sx: { backgroundColor: "primary.dark" } },
              }}
            >
              <GridToolbarExport
                sx={{
                  color: "#4B4B4B",
                  span: {
                    m: 0,
                  },
                }}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </GridToolbarContainer>
    );
  }
  React.useEffect(() => {
    const myFunc = async () => {
      dispatch(setLoading(true));
      if (codeListChild.index >= 0) {
        let data = await getParentCode(culture, codeListChild.rowId);
        dispatch(cleanDataGridItems());
        data.data.map((e, i) => {
          dispatch(
            setDataGridItems({ key: data.data[i].ROW_ID, value: data.data[i] })
          );
        });
      }
      dispatch(setLoading(false));
    };
    myFunc();
  }, [childCodeList.refreshDataGrid]);
  React.useEffect(() => {
    history.push(`${codeListChild.currentChild.toLowerCase()}`);
  }, [childCodeList.refreshDataGrid, codeListChild.index]);

  const onCellEditCommit = (cellData) => {
    const { id, field, value } = cellData;
    dispatch(changeDataGridItems({ id, field, value }));
  };
  const groupingColDef = {
    headerName: "",
    hideDescendantCount: true,
    valueFormatter: () => "",
    width: 50,
    // minWidth: 0,

    resizable: false,
  };
  const [sortModel, setSortModel] = React.useState([
    {
      field: "CODE",
      sort: "asc",
    },
  ]);
  return (
    <Box>
      {/*<Box sx={{ mb: 1.5 }}>
         <DropDownMenu />

        <Box
          sx={{
            border: "0.2px solid",
            backgroundColor: "#4B4B4B",
            borderColor: "#4B4B4B",
            width: "98%",
            margin: "auto",
          }}
        />
      </Box> */}

      <Box
        sx={{
          m: 0.5,
          "& .super-app-theme--cell": {
            backgroundColor: grey[200],
          },
          // "& .mandatory": {
          //   backgroundColor: "red",
          // },
          button: {
            minWidth: "36px",
            height: "36px",
            borderRadius: "50px",
          },
        }}
      >
        <Box
          sx={{
            minHeight: "calc(500px - 36px - 16px - 40px )",
            height: "calc(100vh - 60px - 36px - 16px - 60px)",
            width: "100%",
            "& .MuiInputBase-input": {
              padding: "0px important",
            },
            "& .MuiDataGrid-cellContent": {
              fontSize: "16px",
            },
            "& .super-app-theme--cell": {
              backgroundColor: grey[200],
            },

            "& .MuiDataGrid-virtualScrollerRenderZone": {
              "&>*:nth-of-type(1)": {
                "&>*:nth-of-type(1)": {
                  svg: {
                    display: "none",
                  },
                },
              },
            },

            // ---------------------------------------------------------
            // "& .MuiDataGrid-virtualScrollerRenderZone": {
            //   "&>*:nth-of-type(1)": {
            //     "&>*:nth-of-type(1)": {
            //       svg: {
            //         display: "none",
            //       },
            //     },
            //   },
            // },

            // ---------------------------------------------------------

            // "& .MuiDataGrid-virtualScrollerRenderZone": {
            //   div: {
            //     "&>*:nth-of-type(2)": {
            //       display: "none",
            //     },
            //   },

            //   "&>*:nth-of-type(1)": {
            //     "&>*:nth-of-type(1)": {
            //       display: "none",
            //     },
            //     "&>*:nth-of-type(2)": {
            //       display: "flex",
            //       minWidth: "50px !important",
            //       maxWidth: "50px !important",
            //       button: {
            //         position: "relative",
            //         left: "-2px",
            //       },
            //     },
            //   },
            // },
          }}
        >
          <DataGridPro
            componentsProps={{
              basePopper: {
                sx: {
                  ".MuiDataGrid-columnsPanel": {
                    "&>*:nth-of-type(2)": {
                      display: "none",
                    },
                  },
                },
              },
            }}
            localeText={{
              toolbarColumns: "",
              toolbarFilters: "",
              toolbarDensity: "",
              toolbarExport: "",
            }}
            density="compact"
            defaultGroupingExpansionDepth={1}
            hideFooter={true}
            treeData
            onCellEditCommit={onCellEditCommit}
            rows={Object.values(childCodeList.dataGridItems)}
            columns={columns}
            getTreeDataPath={getTreeDataPath}
            getRowId={(row) => row.ROW_ID}
            loading={childCodeList.loading}
            isRowSelectable={(rowId) => rowId.id !== codeListChild.rowId}
            checkboxSelection={true}
            disableSelectionOnClick={true}
            onSelectionModelChange={(rowId) => (myCheckboxSelection = rowId)}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            components={{
              Toolbar: CustomToolbar,
              NoRowsOverlay: CustomNoRowsOverlay,
              LoadingOverlay: LinearProgress,
            }}
            groupingColDef={groupingColDef}
            disableIgnoreModificationsIfProcessingProps
          />
        </Box>
      </Box>
    </Box>
  );
}
