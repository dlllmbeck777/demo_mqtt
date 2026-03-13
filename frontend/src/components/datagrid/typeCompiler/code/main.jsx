import React from "react";
import { Select, MenuItem, Box } from "@mui/material";
import { useSelector } from "react-redux";
import CodelistService from "../../../../services/api/codeList";
const Main = (props) => {
  const {
    handleChange = () => {},
    value = "",
    disabled = false,
    CODE_LIST,
    ...rest
  } = props;
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [values, setValues] = React.useState([{ CODE: "", CODE_TEXT: "" }]);

  const asyncLoadFunc = async () => {
    const body = JSON.stringify({ CULTURE, CODE_LIST });
    console.log(CODE_LIST);
    try {
      let res = await CodelistService.getItemPropCode(body);
      setValues((prev) => [{ CODE: "", CODE_TEXT: "" }, ...res?.data]);
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
            {e?.CODE_TEXT}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default React.memo(Main);
