import * as React from "react";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const MaterialUIPickers = ({
  value = 0,
  handleChange = () => {},
  disabled,
  rest,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        value={value === null ? null : dayjs(value)}
        format="DD.MM.YYYY hh:mm"
        views={["day", "month", "year", "hours", "minutes"]}
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
