import * as React from "react";
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
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { MyTooltip } from "../..";
const CustomToolbar = ({ newFunc, deleteFunc, saveFunc, refreshFunc }) => {
  return (
    <GridToolbarContainer container sx={{ alignItems: "center" }}>
      <MyTooltip resourceId={"TOOLTIP_NEW"}>
        <IconButton
          onClick={() => {
            newFunc();
          }}
        >
          <AddBoxIcon fontSize="small" sx={{ color: "icon.secondary" }} />
        </IconButton>
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_SAVE"}>
        <IconButton
          onClick={() => {
            saveFunc();
          }}
        >
          <SaveOutlinedIcon fontSize="small" sx={{ color: "icon.secondary" }} />
        </IconButton>
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_DELETE"}>
        <IconButton
          onClick={() => {
            deleteFunc();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ color: "icon.secondary" }} />
        </IconButton>
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_SHOW_FILTER"}>
        <GridToolbarFilterButton />
      </MyTooltip>
      <MyTooltip title={"TOOLTIP_FIND_COLUMN"}>
        <GridToolbarColumnsButton />
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_SHOW_DENSITY"}>
        <GridToolbarDensitySelector />
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_SHOW_EXPORT"}>
        <GridToolbarExport />
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_REFRESH"}>
        <IconButton
          onClick={() => {
            refreshFunc();
          }}
        >
          <RefreshIcon fontSize="small" sx={{ color: "icon.secondary" }} />
        </IconButton>
      </MyTooltip>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
