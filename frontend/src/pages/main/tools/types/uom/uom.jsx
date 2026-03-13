import React from "react";
import { Select, MenuItem, Box } from "@mui/material";
import { useSelector } from "react-redux";
import UomService from "../../../../../services/api/uom";
const Main = (props) => {
  const {
    handleChange = () => {},
    value = "",
    disabled = false,
    QUANTITY_TYPE,
    ...rest
  } = props;
  const [values, setValues] = React.useState([
    { CATALOG_SYMBOL: "", CODE: "" },
  ]);

  const asyncLoadFunc = async () => {
    if (QUANTITY_TYPE !== null)
      try {
        let res = await UomService.getUomNoToken(QUANTITY_TYPE);
        console.log(res);
        setValues((prev) => [{ CATALOG_SYMBOL: "", CODE: "" }, ...res?.data]);
      } catch (err) {
        console.log(err);
      }
  };

  React.useEffect(() => {
    asyncLoadFunc();
  }, [QUANTITY_TYPE]);

  const handleChangeSelect = (event) => {
    handleChange(event.target.value);
  };
  return (
    <Select
      disabled={disabled}
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
            value={e.CODE}
            sx={{
              fontSize: "1rem",
              paddingTop: key === 0 ? "14px" : "6px",
              paddingBottom: key === 0 ? "14px" : "6px",
              textTransform: "capitalize",
            }}
          >
            {e?.CATALOG_SYMBOL}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default React.memo(Main);
