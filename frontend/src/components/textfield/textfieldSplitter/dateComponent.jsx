import * as React from "react";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const MaterialUIPickers = ({
  value = "2100-01-01",
  handleChange = () => {},
  disabled,
  ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        value={dayjs(value)}
        format="DD.MM.YYYY"
        views={["day", "month", "year"]}
        onChange={(newValue) => {
          handleChange(newValue?.$d?.getTime());
        }}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-input": {
            padding: "6px",
          },
        }}
        disabled={disabled}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default React.memo(MaterialUIPickers);
