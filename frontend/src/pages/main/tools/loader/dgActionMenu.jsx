import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid-pro";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { loaderSave } from "../../../../services/actions/loader/loader";
import { MyTooltip } from "../../../../components";
import { isCreated } from "../../../../services/utils/permissions";
const CustomToolbar = () => {
  const dispatch = useDispatch();
  const selectedType = useSelector((state) => state.drawerMenu.selectedItem.ID);

  return (
    <GridToolbarContainer container sx={{ alignItems: "center" }}>
      <MyTooltip resourceId={"TOOLTIP_SAVE"}>
        <IconButton
          disabled={!dispatch(isCreated(selectedType))}
          onClick={() => {
            dispatch(loaderSave());
          }}
        >
          <SaveOutlinedIcon fontSize="small" />
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
    </GridToolbarContainer>
  );
};

export default React.memo(CustomToolbar);
