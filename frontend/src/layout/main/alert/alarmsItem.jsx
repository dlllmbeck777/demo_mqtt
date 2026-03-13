import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { dateFormatDDMMYYHHMMSS } from "../../../services/utils/dateFormatter";
import CircleIcon from "@mui/icons-material/Circle";
import {
  ErrorOutline,
  WarningAmberOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import CodelistService from "../../../services/api/codeList";
const alarmLevel = {
  1: "error",
  2: "warning",
  3: "info",
};
const AlertItem = ({ data, index, itemReaded }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const alarmIcon = {
    1: (
      <ErrorOutline
        fontSize="large"
        color={alarmLevel[data.priority]}
        sx={{ filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25))" }}
      />
    ),
    2: (
      <WarningAmberOutlined
        fontSize="large"
        color={alarmLevel[data.priority]}
        sx={{ filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25))" }}
      />
    ),
    3: (
      <InfoOutlined
        fontSize="large"
        color={alarmLevel[data.priority]}
        sx={{ filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25))" }}
      />
    ),
  };
  const [val, setVal] = React.useState([]);
  async function myAsyncFunc() {
    try {
      let val = await CodelistService.getByParentHierarchy({
        CULTURE,
        LIST_TYPE: "DATA_ALARMS_CODE",
      });
      setVal(val);
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    myAsyncFunc();
  }, []);
  return (
    <Grid
      container
      alignItems={"center"}
      justifyContent={"space-around"}
      columnGap={2}
      className={`notification__container__item ${
        index % 2 === 0 ? "" : "notification__container__item-odd"
      }
      notification__container__item__${alarmLevel[data.priority]}
      `}
      onClick={() => {
        itemReaded(data.id);
      }}
    >
      <Grid item xs={1}>
        {alarmIcon[data.priority]}
      </Grid>
      <Grid item xs={!data.is_read ? 8 : 10}>
        <Grid container rowGap={1}>
          <Grid
            item
            xs={12}
            sx={{ fontSize: "1.1rem", textTransform: "capitalize", mb: 1 }}
          >
            - {data.LOG_TYPE}
            <br />
          </Grid>
          <Grid item xs={12}>
            {data?.short_name} {"("}
            {data?.interval}
            {")"},
            {val?.data?.filter((e) => e?.CODE === "Value")?.[0]?.CODE_TEXT} :{" "}
            {data?.tag_value}{" "}
            {
              val?.data?.filter((e) => e?.CODE === data?.gap_type)?.[0]
                ?.CODE_TEXT
            }{" "}
            : {data?.gap}
          </Grid>
          <Grid item xs={12}>
            {dateFormatDDMMYYHHMMSS(new Date(data["time"] + 18000000))}
          </Grid>
        </Grid>
      </Grid>
      {!data.is_read && (
        <Grid item xs={1}>
          <CircleIcon fontSize="small" color="success" />
        </Grid>
      )}
    </Grid>
  );
};

export default AlertItem;
