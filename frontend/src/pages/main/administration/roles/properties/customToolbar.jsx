import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid-pro";

import { MyTextField } from "../../../../../components";
import { changeRoleName } from "../../../../../services/actions/roles/properties";
const CustomToolbar = () => {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.roles.roles.ROLES_NAME);
  return (
    <GridToolbarContainer className="roles-custom-toolbar">
      <Grid>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Grid>
      <Grid>
        <MyTextField
          defaultValue={name}
          handleChangeFunc={(value) => {
            dispatch(changeRoleName(value));
          }}
        />
      </Grid>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
