import * as React from "react";
import { Box } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import ConstructionIcon from "@mui/icons-material/Construction";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import ItemService from "../../../../services/api/item";
import CodelistService from "../../../../services/api/codeList";

const TimeItem = ({ time, comment, downtimeCode, Icon }) => {
  const [values, setValues] = React.useState("");
  const CULTURE = useSelector((state) => state.lang.cultur);
  const asyncLoadFunc = async () => {
    const body = JSON.stringify({ CULTURE, CODE: downtimeCode });

    try {
      if (downtimeCode !== "" && downtimeCode) {
        let res = await CodelistService.getByParentHierarchy(body);
        setValues(res?.data?.[0]?.CODE_TEXT);
      }
    } catch (err) {}
  };

  React.useEffect(() => {
    asyncLoadFunc();
  }, [CULTURE]);
  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ m: "auto 0" }}
        align="right"
        variant="body2"
        color="text.secondary"
      >
        {new Date(time).toLocaleDateString()}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot>{Icon}</TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: "12px", px: 2, margin: "auto" }}>
        <Typography variant="h6" component="span">
          {values}
        </Typography>
        <Typography>{comment}</Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export default function CustomizedTimeline({ width, height, chartProps }) {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [data, setData] = React.useState([]);
  const [futureData, setFutureData] = React.useState({});
  const [type, setType] = React.useState(false);
  const ITEM_ID = useSelector(
    (state) => state.collapseMenu.selectedItem?.FROM_ITEM_ID
  );
  async function loadDataGridData() {
    try {
      setData([]);
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
      console.log(temp);
      setFutureData((prev) => temp.data);
      let res = await ItemService.getDowntimeDG({
        CULTURE,
        ITEM_ID,
        EVENT_TYPE: "DOWNTIME",
      });
      console.log(res);

      let val = [];
      Promise.all(
        res.data.map((e) => {
          val.push({ ...e, update: "" });
        })
      );
      console.log(val);
      setData(val);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    loadDataGridData();
  }, [CULTURE]);
  return (
    <Box sx={{ width: width, height: height, overflow: "auto" }}>
      <Timeline position="alternate">
        {["DATE4", "DATE5", "DATE3", "DATE2"].map((e) => {
          if (futureData?.[e])
            return (
              <TimeItem
                key={e}
                time={futureData?.[e]}
                comment={
                  type
                    ? type?.find((a) => a?.COLUMN_NAME === e)?.SHORT_LABEL
                    : ""
                }
                Icon={<ConstructionIcon />}
              />
            );
        })}
        <TimeItem key="current" time={new Date().getTime()} />
        {data.map((e, i) => {
          console.log(e);
          return (
            <TimeItem
              key={i}
              time={e?.START_DATETIME}
              comment={e?.CHAR2}
              downtimeCode={e?.CHAR1}
              Icon={<ConstructionIcon />}
            />
          );
        })}
      </Timeline>
    </Box>
  );
}
