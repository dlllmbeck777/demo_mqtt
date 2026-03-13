import React from "react";
import { Box, Grid, Chip, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import CodelistService from "../../../../services/api/codeList";
import ItemService from "../../../../services/api/item";
import TextFields from "../../../textfield/textfieldSplitter/textFieldCompiler";
import { dateFormatDDMMYY } from "../../../../services/utils/dateFormatter";
import "../../../../assets/styles/page/overview/chartContainer.scss";
const ChipContainer = ({ dt }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [downttimeLabel, setDowntimeLabel] = React.useState("");
  const [type, setType] = React.useState([]);
  const asyncLoadFunc = async () => {
    const body = JSON.stringify({ CULTURE, CODE: dt.CHAR1 });
    try {
      if (dt.CHAR1 !== "" && dt.CHAR1) {
        let res = await CodelistService.getByParentHierarchy(body);
        setDowntimeLabel(res?.data?.[0]?.CODE_TEXT);
      }
    } catch (err) {}
  };

  React.useEffect(() => {
    asyncLoadFunc();
  }, [CULTURE]);
  async function loadDataGridData() {
    try {
      let type = await ItemService.getTypePropertyNoToken({
        CULTURE,
        TYPE: "DOWNTIME",
      });
      setType(type.data?.["DOWNTIME"]);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    loadDataGridData();
  }, [CULTURE]);
  return (
    <Box>
      <Tooltip
        title={
          <Box sx={{ fontSize: "1rem" }} className="calendar-tooltip-text">
            {type.map((tp) => {
              tp.READ_ONLY = true;
              if (tp?.HIDDEN !== "True" && dt?.[tp?.["COLUMN_NAME"]])
                return (
                  <Grid container sx={{ pb: 0.5 }}>
                    <Grid
                      className="calendar-tooltip-text__header"
                      item
                      xs={12}
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {tp?.SHORT_LABEL}:
                    </Grid>
                    <Grid item xs={12}>
                      <TextFields row={tp} value={dt?.[tp?.["COLUMN_NAME"]]} />
                    </Grid>
                  </Grid>
                );
            })}
          </Box>
        }
      >
        <Chip label={downttimeLabel} sx={{ fontSize: "1rem" }} />
      </Tooltip>
    </Box>
  );
};
function areTimestampsOnSameDay(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  const isSameYear = date1.getFullYear() === date2.getFullYear();
  const isSameMonth = date1.getMonth() === date2.getMonth();
  const isSameDay = date1.getDate() === date2.getDate();

  return isSameYear && isSameMonth && isSameDay;
}
const calendarCell = ({
  downtime,
  time,
  futureData,
  lastItems,
  index,
  type,
}) => {
  return (
    <Grid
      item
      xs={3}
      sx={{
        height: "100px",
        textAlign: "center",
        border: "1px solid black",
        borderTop: "0px",
        borderLeft: "0px",
        borderRight: (index + 1) % 4 === 0 ? "0px" : "1px solid black",
        // borderBottom: lastItems ? "0px" : "1px solid black",
        overflow: "auto",
      }}
    >
      <Box sx={{ p: 1, fontSize: "1.2rem", py: 2 }}>
        {dateFormatDDMMYY(parseInt(time))}
      </Box>
      {downtime.map((a, i) => {
        return <ChipContainer dt={a} key={i} />;
      })}
      {["DATE4", "DATE5", "DATE3", "DATE2"].map((e) => {
        if (futureData?.[e]) {
          // console.log(time);
          // console.log(futureData?.[e]);
          // console.log(areTimestampsOnSameDay(time, futureData?.[e]));
          if (areTimestampsOnSameDay(time, futureData?.[e]))
            return (
              <Chip
                label={
                  type
                    ? type?.find((a) => a?.COLUMN_NAME === e)?.SHORT_LABEL
                    : ""
                }
                sx={{ fontSize: "1rem" }}
                color="success"
              />
            );
        }
      })}
    </Grid>
  );
};

export default calendarCell;
