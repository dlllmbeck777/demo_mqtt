import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton } from "@mui/material";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid-pro";

import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  deleteProperty,
  addNewProperty,
} from "../../../../services/actions/type/datagrid";
import { MyTooltip } from "../../../../components";
export const CustomToolbar = () => {
  const dispatch = useDispatch();
  return (
    <GridToolbarContainer>
      <MyTooltip resourceId={"TOOLTIP_NEW_CHILD"}>
        <IconButton
          onClick={() => {
            dispatch(addNewProperty());
          }}
        >
          <AddBoxIcon
            fontSize="small"
            className="types-property-action-menu-icon"
          />
        </IconButton>
      </MyTooltip>

      <MyTooltip resourceId={"TOOLTIP_DELETE_CHILD"}>
        <IconButton
          onClick={() => {
            dispatch(deleteProperty());
          }}
        >
          <DeleteIcon
            fontSize="small"
            className="types-property-action-menu-icon"
          />
        </IconButton>
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_SHOW_FILTER"}>
        <GridToolbarFilterButton className="types-property-action-menu-icon" />
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_FIND_COLUMN"}>
        <GridToolbarColumnsButton className="types-property-action-menu-icon" />
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_SHOW_DENSITY"}>
        <GridToolbarDensitySelector className="types-property-action-menu-icon" />
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_SHOW_EXPORT"}>
        <GridToolbarExport className="types-property-action-menu-icon" />
      </MyTooltip>
    </GridToolbarContainer>
  );
};
