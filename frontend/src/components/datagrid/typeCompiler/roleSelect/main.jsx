import React from "react";
import { Select, MenuItem, Box } from "@mui/material";
import Users from "../../../../services/api/users";
const RoleSelect = ({ value, handleChange, ...rest }) => {
  const [values, setValues] = React.useState([]);
  async function myAsyncFunc() {
    let res = await Users.getRoles();
    setValues(res.data);
  }
  React.useEffect(() => {
    myAsyncFunc();
  }, []);

  const handleChangeSelect = (event) => {
    handleChange(event.target.value);
  };
  return (
    <Select
      value={value}
      onChange={handleChangeSelect}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: "300px",
          },
        },
      }}
      disableUnderline={true}
      sx={{
        boxShadow: "none",
        "& .MuiOutlinedInput-notchedOutline": { border: 0 },
        fontSize: "1rem",
        width: "100%",
        height: "100%",
        "& .MuiOutlinedInput-input": {
          fontSize: "1rem",
        },
        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            border: 0,
          },
        "& svg": {
          right: 0,
        },
      }}
      {...rest}
    >
      {values.map((e, key) => {
        return (
          <MenuItem
            key={key}
            value={e?.ROLES_ID}
            sx={{
              fontSize: "1rem",
              paddingTop: key === 0 ? "14px" : "6px",
              paddingBottom: key === 0 ? "14px" : "6px",
              textTransform: "capitalize",
            }}
          >
            {e?.ROLES_NAME}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default RoleSelect;
