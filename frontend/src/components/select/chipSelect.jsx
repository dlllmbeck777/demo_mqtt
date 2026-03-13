import * as React from "react";

import {
  Box,
  Chip,
  OutlinedInput,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

function MySelect(props) {
  const {
    values = [],
    valuesPath = null,
    dataTextPath = null,
    indentPath = null,
    handleChangeFunc = () => {},
    defaultValue = [],
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

  return (
    <Box sx={{ width: "100%", display: "inline-block" }}>
      <FormControl fullWidth>
        <Select
          disabled={disabled}
          error={errFunc()}
          value={selectedItem}
          onChange={handleChange}
          multiple
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box
              sx={{
                height: "min-content",
                maxHeight: "36px",
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                overflow: "auto",
                fontSize: "1rem",
                ["&::-webkit-scrollbar"]: {
                  width: "4px",
                  height: "100%",
                },
                ["&::-webkit-scrollbar-thumb"]: {
                  borderRadius: "4px",
                  backgroundColor: "#606060",
                },
              }}
            >
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  variant="outlined"
                  color="secondary"
                  sx={{ fontSize: "1rem", fontWeight: "400" }}
                />
              ))}
            </Box>
          )}
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

export default React.memo(MySelect);
