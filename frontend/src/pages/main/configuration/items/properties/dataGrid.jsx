import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CustomIconToolbar,
  CustomNoRowsOverlay,
} from "../../../../../components";
import CustomColumnMenu from "./customColumnMenu";
import {
  loadItemRowsDataGrid,
  saveItem,
  cleanColumns,
} from "../../../../../services/actions/item/itemDataGrid";
import LinearProgress from "@mui/material/LinearProgress";

import {
  setBodyConfirmation,
  setSaveFunctonConfirmation,
  setTitleConfirmation,
} from "../../../../../services/actions/confirmation/historyConfirmation";
import DataGrid from "../../../../../components/datagrid/component/dataGrid";
import resourceList from "../../../../../services/api/resourceList";
const MemoizedDataGrid = React.memo(
  ({ columns, rows }) => {
    const loading = useSelector((state) => state.itemDataGrid.loading);
    const pinnedRows =
      rows?.length > 0
        ? {
            top: [rows?.[0]],
            bottom: [],
          }
        : {};
    return (
      <DataGrid
        sx={{
          boxSizing: "border-box",
          ".MuiDataGrid-pinnedRows": {
            zIndex: 2,
          },
        }}
        componentsProps={{
          basePopper: {
            sx: {
              ".MuiDataGrid-columnsPanel": {
                "&>*:nth-of-type(n+5)": {
                  display: "none",
                },
              },
            },
          },
        }}
        rows={rows}
        columns={columns}
        hideFooter={true}
        components={{
          Toolbar: CustomIconToolbar,
          ColumnMenu: CustomColumnMenu,
          NoRowsOverlay: CustomNoRowsOverlay,
          LoadingOverlay: LinearProgress,
        }}
        loading={loading}
        pinnedRows={pinnedRows}
        experimentalFeatures={{ rowPinning: true }}
        disableSelectionOnClick={true}
        sortModelProp={[
          {
            field: "SORT_ORDER",
            sort: "asc",
          },
        ]}
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

const MyDataGrid = () => {
  const dispatch = useDispatch();
  const column = useSelector((state) => state.datagrid.columns);
  const columns = useSelector((state) => state.itemDataGrid.columns);
  const rows = useSelector((state) => state.datagrid.rows);
  const CULTURE = useSelector((state) => state.lang.cultur);

  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const typeRow = useSelector((state) => state.itemDataGrid.typeRow);
  const itemId = useSelector((state) => state.treeview.selectedItem.ITEM_ID);
  const name = useSelector(
    (state) => state.treeview.selectedItem.PROPERTY_STRING
  );
  React.useEffect(() => {
    async function asyncFunc() {
      let res = {};
      try {
        res = await resourceList.getResourcelist({
          CULTURE,
          PARENT: "POPUP",
        });
      } catch (err) {
        console.log(err);
      }

      dispatch(setSaveFunctonConfirmation(saveItem));
      dispatch(
        setTitleConfirmation(
          res?.data?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]?.SHORT_LABEL
        )
      );
      dispatch(setBodyConfirmation(`${name ? name : "new"}`));
    }
    asyncFunc();
  }, [name]);

  React.useEffect(() => {
    if (selectedIndex !== -3) dispatch(cleanColumns());
    if (selectedIndex !== -2 && selectedIndex !== -3) {
      dispatch(loadItemRowsDataGrid());
    }
  }, [itemId, name, selectedIndex, typeRow]);
  if (selectedIndex !== -3) {
    return (
      <MemoizedDataGrid
        columns={[...column, ...Object.values(columns)]}
        rows={rows}
      />
    );
  } else {
    return <></>;
  }
};

export default React.memo(MyDataGrid);
