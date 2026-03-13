import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomIconToolbar } from "../../../../components";
import DataGrid from "../../../../components/datagrid/component/dataGrid";
import { setSelectedRows } from "../../../../services/actions/datagrid/rows";

const MemoizedDataGrid = React.memo(
  ({ columns, rows }) => {
    const dispatch = useDispatch();
    return (
      <DataGrid
        columns={columns}
        rows={rows}
        pagination
        autoPageSize={true}
        checkboxSelection={true}
        disableSelectionOnClick={true}
        onSelectionModelChange={(ids) => dispatch(setSelectedRows(ids))}
        sortModelProp={[
          {
            field: "first_name",
            sort: "asc",
          },
          {
            field: "last_name",
            sort: "asc",
          },
        ]}
        Toolbar={CustomIconToolbar}
        componentsProps={{
          footer: {
            style: { justifyContent: "flex-start" },
          },
        }}
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

const UserEditor = () => {
  const rows = useSelector((state) => state.datagrid.rows);
  const columns = useSelector((state) => state.datagrid.columns);
  const refresh = useSelector((state) => state.datagrid.refresh);

  return <MemoizedDataGrid rows={rows} columns={columns} refresh={refresh} />;
};

export default UserEditor;
