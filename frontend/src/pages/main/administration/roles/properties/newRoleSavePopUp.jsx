import React from "react";

import { MyTextField } from "../../../../../components";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changeRoleName } from "../../../../../services/actions/roles/properties";
const NewRoleSavePopUp = () => {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.roles.roles.ROLES_NAME);
  return (
    <Box>
      Role Name
      <br />
      <br />
      <MyTextField
        defaultValue={name}
        handleChangeFunc={(value) => {
          dispatch(changeRoleName(value));
        }}
      />
    </Box>
  );
};

export default NewRoleSavePopUp;
