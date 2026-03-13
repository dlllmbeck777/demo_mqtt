import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { CustomToolbar } from "./codeListActionMenu";
import {
  refreshDataGridCodelist,
  saveCodeList,
  addNewCodeListItemSchema,
} from "../../../../services/actions/codelist/datagrid";
import {
  setBodyConfirmation,
  setSaveFunctonConfirmation,
  setTitleConfirmation,
} from "../../../../services/actions/confirmation/historyConfirmation";
import { useIsMount } from "../../../../hooks/useIsMount";
import { setDatagridColumns } from "../../../../services/actions/datagrid/columns";
import DataGrid from "../../../../components/datagrid/component/dataGrid";
import { setSelectedRows } from "../../../../services/actions/datagrid/rows";
import resourceList from "../../../../services/api/resourceList";
import ConfirmDataGrid from "../../../../components/datagrid/confirmDG/datagrid";
const getTreeDataPath = (row) => row?.HIERARCHY;

const groupingColDef = {
  headerName: "",
  hideDescendantCount: true,
  valueFormatter: () => "",
  width: 50,
  resizable: false,
};

const MemoizedDataGrid = React.memo(
  ({ columns, rows, refresh }) => {
    const dispatch = useDispatch();
    if (rows?.[0]?.HIERARCHY)
      return (
        <DataGrid
          componentsProps={{
            basePopper: {
              sx: {
                ".MuiDataGrid-columnsPanel": {
                  "&>*:nth-of-type(2)": {
                    display: "none",
                  },
                  "&>*:nth-of-type(1)": {
                    display: "none",
                  },
                },
              },
            },
          }}
          sx={{
            "& .MuiCheckbox-root.Mui-disabled": {
              display: "none",
            },
          }}
          defaultGroupingExpansionDepth={1}
          hideFooter={true}
          treeData
          rows={rows}
          columns={columns}
          getTreeDataPath={getTreeDataPath}
          checkboxSelection={true}
          isRowSelectable={(params) => !(params.row?.HIERARCHY.length < 2)}
          disableSelectionOnClick={true}
          onSelectionModelChange={(id) => dispatch(setSelectedRows(id))}
          sortModelProp={[
            {
              field: "CODE",
              sort: "asc",
            },
          ]}
          Toolbar={CustomToolbar}
          groupingColDef={groupingColDef}
        />
      );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.columns.length === nextProps.columns.length &&
      prevProps.rows.length === nextProps.rows.length &&
      prevProps.refresh === nextProps.refresh
    );
  }
);

function TreeDataWithGap() {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.datagrid.rows);
  const columns = useSelector((state) => state.datagrid.columns);
  const refresh = useSelector((state) => state.datagrid.refresh);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const code = useSelector((state) => state.treeview.selectedItem.CODE);

  React.useEffect(() => {
    if (selectedIndex === -2 && selectedIndex !== -3) {
      dispatch(addNewCodeListItemSchema());
    }
  }, [selectedIndex]);

  React.useEffect(() => {
    dispatch(setDatagridColumns(CULTURE, "CODE_LST"));
  }, [CULTURE]);
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

      dispatch(setSaveFunctonConfirmation(saveCodeList));
      dispatch(
        setTitleConfirmation(
          res?.data?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]?.SHORT_LABEL
        )
      );
      dispatch(setBodyConfirmation(<ConfirmDataGrid />));
    }
    asyncFunc();
  }, [CULTURE]);

  React.useEffect(() => {
    if (isMount) {
    } else if (selectedIndex !== -2 && selectedIndex !== -3) {
      dispatch(refreshDataGridCodelist());
    }
  }, [code, CULTURE]);
  return <MemoizedDataGrid rows={rows} columns={columns} refresh={refresh} />;
}

export default React.memo(TreeDataWithGap);
