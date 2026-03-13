import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { isCreated, isDeleted } from "../../../../services/utils/permissions";

import { addRowResource } from "../../../../services/actions/resource/datagridResource";
import { deleteRow } from "../../../../services/actions/datagrid/rows";
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
                dispatch(addRowResource());
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
            <GridToolbarFilterButton
              sx={{
                color: "icon.secondary",
                span: {
                  m: 0,
                },
              }}
            />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_FIND_COLUMN"}>
            <GridToolbarColumnsButton
              sx={{
                color: "icon.secondary",
                span: {
                  m: 0,
                },
              }}
            />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_SHOW_DENSITY"}>
            <GridToolbarDensitySelector
              sx={{
                color: "icon.secondary",
                span: {
                  m: 0,
                },
              }}
            />
          </MyTooltip>
          <MyTooltip resourceId={"TOOLTIP_SHOW_EXPORT"}>
            <GridToolbarExport
              sx={{
                color: "icon.secondary",
                span: {
                  m: 0,
                },
              }}
            />
          </MyTooltip>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
};
