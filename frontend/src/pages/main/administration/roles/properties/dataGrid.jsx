import React from "react";
import DataGrid from "../../../../../components/datagrid/component/dataGrid";
import { useDispatch, useSelector } from "react-redux";

import CustomToolbar from "./customToolbar";
import {
  setBodyConfirmation,
  setSaveFunctonConfirmation,
  setTitleConfirmation,
} from "../../../../../services/actions/confirmation/historyConfirmation";

import { cleanRoles } from "../../../../../services/actions/roles/roles";
import {
  updateRole,
  loadRolesProps,
} from "../../../../../services/actions/roles/properties";
import NewRoleSavePopUp from "./newRoleSavePopUp";
import { setDatagridColumns } from "../../../../../services/actions/datagrid/columns";
import resourceList from "../../../../../services/api/resourceList";
const getTreeDataPath = (row) => row.hierarchy;

const groupingColDef = {
  headerName: "Type",
};

const MemoizedDataGrid = React.memo(
  ({ columns, rows, refresh }) => {
    if (rows?.[0]?.hierarchy)
      return (
        <DataGrid
          columns={columns}
          rows={rows}
          getTreeDataPath={getTreeDataPath}
          defaultGroupingExpansionDepth={1}
          treeData
          groupingColDef={groupingColDef}
          Toolbar={CustomToolbar}
          hideFooter={true}
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

const RolesDataGrid = ({ isHome }) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const rows = useSelector((state) => state.datagrid.rows);
  const columns = useSelector((state) => state.datagrid.columns);
  const refresh = useSelector((state) => state.datagrid.refresh);
  const name = useSelector((state) => state.treeview.selectedItem.ROLES_NAME);
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
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

      dispatch(setSaveFunctonConfirmation(updateRole));
      dispatch(
        setTitleConfirmation(
          res?.data?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]?.SHORT_LABEL
        )
      );
      dispatch(setBodyConfirmation(`${name ? name : <NewRoleSavePopUp />}`));
    }
    asyncFunc();
  }, [CULTURE, name]);

  React.useEffect(() => {
    if (selectedIndex !== -3) dispatch(cleanRoles());
    if (selectedIndex !== -2 && selectedIndex !== -3) {
      dispatch(loadRolesProps());
    }
  }, [selectedIndex]);
  React.useEffect(() => {
    dispatch(setDatagridColumns(CULTURE, "ROLES"));
  }, [CULTURE]);
  return isHome ? (
    <></>
  ) : (
    <MemoizedDataGrid rows={rows} columns={columns} refresh={refresh} />
  );
};

export default React.memo(RolesDataGrid);
