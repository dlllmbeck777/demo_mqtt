import React from "react";
import { Select, MenuItem, Box } from "@mui/material";
import Auth from "../../../../services/api/auth";
const Main = (props) => {
  const {
    handleChange = () => {},
    value = "",
    disabled = false,
    ...rest
  } = props;
  const [values, setValues] = React.useState([""]);

  const asyncLoadFunc = async () => {
    try {
      let res = await Auth.userEnableLayer();
      console.log(res.data);
      setValues((prev) => [...prev, ...res.data]);
    } catch (err) {}
  };

  React.useEffect(() => {
    asyncLoadFunc();
  }, []);

  const handleChangeSelect = (event) => {
    handleChange(event.target.value);
  };
  return (
    <Select
      disabled={disabled}
      value={value}
      autoFocus
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
            value={e}
            sx={{
              fontSize: "1rem",
              paddingTop: key === 0 ? "14px" : "6px",
              paddingBottom: key === 0 ? "14px" : "6px",
              textTransform: "capitalize",
            }}
          >
            {e}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default React.memo(Main);
