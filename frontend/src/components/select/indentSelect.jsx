import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function MySelect(props) {
  const {
    values = [],
    valuesPath = null,
    dataTextPath = null,
    indentPath = null,
    handleChangeFunc = () => {},
    defaultValue = "",
    errFunc = () => {
      return false;
    },
    disabled = false,
  } = props;
  const [selectedItem, setSelectedItem] = React.useState(defaultValue);
  const handleChange = (event) => {
    setSelectedItem(event.target.value);
    handleChangeFunc(event.target.value);
  };
  React.useEffect(() => {
    setSelectedItem(defaultValue);
  }, [defaultValue]);

  return (
    <Box sx={{ minWidth: 125, width: "100%", display: "inline-block" }}>
      <FormControl fullWidth>
        <Select
          disabled={disabled}
          error={errFunc()}
          value={selectedItem}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-input": { py: 0.5, fontSize: "1rem" },
          }}
        >
          {values.map((e, key) => (
            <MenuItem
              key={key}
              value={valuesPath ? e[valuesPath] : e}
              sx={{
                fontSize: "1rem",
                paddingLeft: (e[indentPath] + 1) * 2,
                paddingTop:
                  key === 0 && (valuesPath ? e[valuesPath] : e) === ""
                    ? "14px"
                    : "6px",
                paddingBottom:
                  key === 0 && (valuesPath ? e[valuesPath] : e) === ""
                    ? "14px"
                    : "6px",
              }}
            >
              {dataTextPath ? e[dataTextPath] : e}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
