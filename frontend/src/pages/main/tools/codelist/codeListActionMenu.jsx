import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, IconButton } from "@mui/material";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid-pro";

import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";

import { addChildCodeList } from "../../../../services/actions/codelist/datagrid";
import { deleteRow } from "../../../../services/actions/datagrid/rows";
import { isCreated, isDeleted } from "../../../../services/utils/permissions";
import { MyTooltip } from "../../../../components";
export const CustomToolbar = () => {
  const dispatch = useDispatch();
  const selectedType = useSelector((state) => state.drawerMenu.selectedItem.ID);
  return (
    <GridToolbarContainer>
      <Grid
        container
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Grid item sx={{ alignItems: "center", displat: "flex" }}>
          <MyTooltip resourceId={"TOOLTIP_NEW_CHILD"}>
            <IconButton
              disabled={!dispatch(isCreated(selectedType))}
              onClick={() => {
                dispatch(addChildCodeList());
              }}
            >
              <AddBoxIcon fontSize="small" />
            </IconButton>
          </MyTooltip>

          <MyTooltip resourceId={"TOOLTIP_DELETE_CHILD"}>
            <IconButton
              disabled={!dispatch(isDeleted(selectedType))}
              onClick={() => {
                dispatch(deleteRow());
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_SHOW_FILTER"}>
            <GridToolbarFilterButton />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_FIND_COLUMN"}>
            <GridToolbarColumnsButton />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_SHOW_DENSITY"}>
            <GridToolbarDensitySelector />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_SHOW_EXPORT"}>
            <GridToolbarExport />
          </MyTooltip>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
};
