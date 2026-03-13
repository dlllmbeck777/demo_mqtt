import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { CustomToolbar } from "./customToolbar";
import { loadDataGrid, saveUom } from "../../../../services/actions/uom/uom";
import {
  setBodyConfirmation,
  setSaveFunctonConfirmation,
  setTitleConfirmation,
} from "../../../../services/actions/confirmation/historyConfirmation";
import DataGrid from "../../../../components/datagrid/component/dataGrid";
import { setSelectedRows } from "../../../../services/actions/datagrid/rows";
import { cleanDatagrid } from "../../../../services/actions/datagrid/datagrid";
import { setDatagridColumns } from "../../../../services/actions/datagrid/columns";
import { cleanAllValues } from "../../../../services/actions/datagrid/utils";

const MemoizedDataGrid = React.memo(
  ({ columns, rows }) => {
    const dispatch = useDispatch();
    return (
      <DataGrid
        rows={rows}
        columns={columns}
        isCellEditable={(params) => !params.row?.IS_BASE_UOM}
        isRowSelectable={(params) => !params.row?.IS_BASE_UOM}
        checkboxSelection={true}
        disableSelectionOnClick={true}
        onSelectionModelChange={(id) => dispatch(setSelectedRows(id))}
        Toolbar={CustomToolbar}
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

const Body = () => {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.datagrid.rows);
  const columns = useSelector((state) => state.datagrid.columns);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const name = useSelector(
    (state) => state.treeview.selectedItem.QUANTITY_TYPE
  );
  React.useEffect(() => {
    dispatch(setDatagridColumns(CULTURE, "UOM"));
    return () => {
      dispatch(cleanDatagrid());
    };
  }, []);
  React.useEffect(() => {
    dispatch(setSaveFunctonConfirmation(saveUom));
    dispatch(setTitleConfirmation("Are you sure you want to save this ? "));
    dispatch(setBodyConfirmation(`${name ? name : "new"}`));
    if (selectedIndex !== -3) dispatch(cleanAllValues());
    if (selectedIndex !== -2 && selectedIndex !== -3) {
      dispatch(loadDataGrid(name));
    }
  }, [name]);

  return <MemoizedDataGrid rows={rows} columns={columns} />;
};

export default React.memo(Body);
