import * as React from "react";

import {
  Box,
  Chip,
  OutlinedInput,
  FormControl,
  Select,
  MenuItem,
  Popover,
} from "@mui/material";
import Auth from "../../../../services/api/auth";
function MySelect({ value, handleChange }) {
  const [values, setValues] = React.useState([]);
  const handleChangeFunc = (event) => {
    handleChange(event.target.value);
  };
  React.useEffect(() => {
    async function myFunc() {
      try {
        let res = await Auth.getLayers();
        console.log(res);
        setValues(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    myFunc();
  }, []);
  return (
    <FormControl fullWidth>
      <Select
        value={value}
        onChange={handleChangeFunc}
        multiple
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
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
          "& .MuiSelect-select": {
            padding: 0,
            paddingLeft: "12px",
          },
        }}
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
            value={e}
            sx={{
              fontSize: "1rem",
              paddingTop: key === 0 && e === "" ? "14px" : "6px",
              paddingBottom: key === 0 && e === "" ? "14px" : "6px",
            }}
          >
            {e}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default React.memo(MySelect);
