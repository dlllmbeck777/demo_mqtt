import { Box, Grid, Chip, Tooltip } from "@mui/material";
import axios from "axios";
import React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ItemService from "../../../../services/api/item";
import CalendarCell from "./calendarCell";
import { dateFormatDDMMYY } from "../../../../services/utils/dateFormatter";
import { useSelector } from "react-redux";
let cancelToken;
const Chart = ({ width, height, chartProps }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [time, setTime] = React.useState(
    new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)
  );
  const [futureData, setFutureData] = React.useState({});
  const [type, setType] = React.useState(false);
  const [data, setData] = React.useState({});
  const handeDateChange = async (newValue) => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    cancelToken = axios.CancelToken.source();
    try {
      const res = await ItemService.calendar(
        {
          ITEM_ID: chartProps?.["Transaction Property"],
          TIMESTAMP:
            new Date(newValue?.setDate(1)).setHours(0, 0, 0, 0) + 18000000,
        },
        cancelToken
      );
      console.log(res);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
    setTime(new Date(newValue?.setDate(1)).setHours(0, 0, 0, 0));
  };
  async function loadFutureData() {
    let type = await ItemService.getTypePropertyNoToken({
      CULTURE,
      TYPE: chartProps?.Transaction,
    });
    console.log(type);
    setType(type.data?.[chartProps?.Transaction]);
    let temp = await ItemService.chartStatusGet({
      CULTURE,
      ITEM_ID: chartProps?.["Transaction Property"],
      EVENT_TYPE: chartProps?.Transaction,
    });
    setFutureData((prev) => temp.data);
  }
  React.useEffect(() => {
    handeDateChange(
      new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0))
    );
  }, []);
  React.useEffect(() => {
    loadFutureData();
  }, [CULTURE]);
  return (
    <Box
      sx={{
        p: 2,
        width,
        height,
      }}
    >
      <Box
        sx={{
          border: "1px solid black",
          borderRadius: "10px",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderBottom: "1px solid black",
            p: 1,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker", "DatePicker", "DatePicker"]}
            >
              <DatePicker
                value={dayjs(time)}
                onChange={(newValue) => {
                  handeDateChange(newValue?.$d);
                }}
                views={["month", "year"]}
                sx={{
                  width: "250px",
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box
          sx={{ width: "100%", height: "calc(100% - 75px)", overflow: "auto" }}
        >
          <Grid container sx={{ overflow: "auto", width: "100%" }}>
            {Object.keys(data)
              .reverse()
              .map((e, i) => {
                return (
                  <CalendarCell
                    downtime={data[e]}
                    time={parseInt(e)}
                    futureData={futureData}
                    type={type}
                    index={i}
                    lastItems={
                      Object.keys(data).length - i <=
                      Object.keys(data).length % 4
                    }
                    key={i}
                  />
                );
              })}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Chart;
