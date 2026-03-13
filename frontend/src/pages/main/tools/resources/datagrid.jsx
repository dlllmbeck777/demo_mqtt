import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { CustomToolbar } from "./actionsMenu";
import {
  refreshDataGridResourcelist,
  saveResourceList,
} from "../../../../services/actions/resource/datagridResource";
import DataGrid from "../../../../components/datagrid/component/dataGrid";
import { setSelectedRows } from "../../../../services/actions/datagrid/rows";
import {
  setSaveFunctonConfirmation,
  setTitleConfirmation,
  setBodyConfirmation,
} from "../../../../services/actions/confirmation/historyConfirmation";
import { useIsMount } from "../../../../hooks/useIsMount";
import { setDatagridColumns } from "../../../../services/actions/datagrid/columns";
import resourceList from "../../../../services/api/resourceList";
import ConfirmDataGrid from "../../../../components/datagrid/confirmDG/datagrid";

const MemoizedDataGrid = React.memo(
  ({ columns, rows, refresh }) => {
    const dispatch = useDispatch();
    return (
      <DataGrid
        defaultGroupingExpansionDepth={1}
        hideFooter={true}
        rows={rows}
        columns={columns}
        checkboxSelection={true}
        disableSelectionOnClick={true}
        onSelectionModelChange={(rowId) => dispatch(setSelectedRows(rowId))}
        Toolbar={CustomToolbar}
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

export default function TreeDataWithGap() {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.datagrid.rows);
  const columns = useSelector((state) => state.datagrid.columns);
  const refresh = useSelector((state) => state.datagrid.refresh);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const rowId = useSelector((state) => state.treeview.selectedItem.ROW_ID);

  React.useEffect(() => {
    dispatch(setDatagridColumns(CULTURE, "RESOURCES"));
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

      dispatch(setSaveFunctonConfirmation(saveResourceList));
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
    } else if (selectedIndex !== -2) {
      dispatch(refreshDataGridResourcelist());
    }
  }, [rowId]);
  return <MemoizedDataGrid rows={rows} columns={columns} refresh={refresh} />;
}
