import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

import ItemService from "../../../services/api/item";
import CodelistService from "../../../services/api/codeList";
import TypeService from "../../../services/api/type";
const Status = ({ item }) => {
  const status = useSelector((state) => state.tapsOverview.status);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [statusState, setStatusState] = React.useState([]);
  const [currentStatus, setCurrentStatus] = React.useState({});
  React.useEffect(() => {
    async function myFunc() {
      try {
        const body = JSON.stringify({ CULTURE, CODE_LIST: "PUMP_STATUS" });
        let val = await CodelistService.getItemPropCode(body);
        setStatusState(val.data);
      } catch (err) {
        console.log(err);
      }
    }
    myFunc();
  }, []);

  React.useEffect(() => {
    async function myFunc() {
      try {
        let readType = await TypeService.getItemReadWid(item);
        let res = await ItemService.hierarchStatusGet({
          ITEM_ID: item,
          EVENT_TYPE: readType?.data?.[0]?.TYPE,
        });
        setCurrentStatus(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    myFunc();
  }, [status]);
  return (
    <Box
      sx={{
        top: 0,
        right: 0,
        mr: 1,
        position: "absolute",
        border: "1px solid",
        display: "inline-block",
        borderColor: statusState.filter(
          (e) => e.CODE === currentStatus?.CHAR1
        )?.[0]?.CHAR1,
        color: statusState.filter((e) => e.CODE === currentStatus?.CHAR1)?.[0]
          ?.CHAR1,
      }}
    >
      <Box sx={{ padding: "0.5rem", fontSize: "1rem" }}>
        {
          statusState.filter((e) => e.CODE === currentStatus?.CHAR1)?.[0]
            ?.CODE_TEXT
        }
      </Box>
    </Box>
  );
};

export default Status;
