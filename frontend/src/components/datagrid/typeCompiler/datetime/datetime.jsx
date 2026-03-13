import * as React from "react";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const MaterialUIPickers = ({
  value = "9000-10-10",
  handleChange = () => {},
  ...props
}) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        "& .MuiFormControl-root": {
          display: "flex",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          pl: 2,
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={dayjs(value)}
          format="DD.MM.YYYY hh:mm"
          views={["day", "month", "year", "hours", "minutes"]}
          onChange={(newValue) => {
            handleChange(newValue?.$d?.getTime());
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-input": {
              p: 0,
            },
          }}
          {...props}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default React.memo(MaterialUIPickers);
