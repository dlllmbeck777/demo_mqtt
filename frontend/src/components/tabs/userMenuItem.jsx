import React from "react";
import { MenuItem } from "@mui/material";
import Overview from "../../services/api/overview";
const UserMenuItem = ({ user, row_id, index }) => {
  const [state, setState] = React.useState(user.state);
  return (
    <MenuItem
      key={index}
      sx={{
        backgroundColor: state ? "rgba(0, 255, 0, .5)" : "rgba(255,0,0,0.15)",
        mx: 0.5,
        mt: index !== 0 && 0.5,
        borderRadius: "7px",
        py: "4px !important",
      }}
      onClick={() => {
        setState((prev) => {
          Overview.dashboardUpdatePerm({
            email: user.email,
            ROW_ID: row_id,
            state: !prev,
          });
          return !prev;
        });
      }}
    >
      {user.first_name + " " + user.last_name}
    </MenuItem>
  );
};

export default UserMenuItem;
