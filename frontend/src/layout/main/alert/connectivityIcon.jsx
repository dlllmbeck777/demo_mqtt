import * as React from "react";
import { Grid, IconButton, Tooltip } from "@mui/material";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorsOffIcon from "@mui/icons-material/SensorsOff";
import { useSelector } from "react-redux";
import { wsBaseUrl } from "../../../services/baseApi";
import resourceList from "../../../services/api/resourceList";
var W3CWebSocket = require("websocket").w3cwebsocket;

const AlertIcon = () => {
  const [data, setData] = React.useState([]);
  const [reloadWs, setReloadWs] = React.useState(false);
  const layer = useSelector((state) => state?.auth?.user?.active_layer);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [tooltip, setTooltip] = React.useState([]);
  async function asyncGetTooltipText() {
    //console.log(`CULTURE ----------------------------  ${CULTURE}`);
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "TOOLTIP",
      });
      //console.log(`RES.DATA   -----------------------------  ${res.data}`);
      setTooltip(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetTooltipText();
  }, [CULTURE]);
  React.useEffect(() => {
    const currentLayer = String(layer || "Inkai").toLowerCase();
    const alarms = new W3CWebSocket(
      `${wsBaseUrl}/ws/last/warnings/${currentLayer}/`
    );
    //console.log(`ALARM   ++++++++++++++++++++++++++++++++++++++++++++++++  ${alarms}`);
    alarms.onerror = function () {
      console.log("Connection Error");
    };
    alarms.onopen = function () {
      alarms.send(`3`);
      console.log("connected");
    };
    alarms.onclose = function () {
      console.log("WebSocket Client Closed");
    };
    alarms.onmessage = function (e) {
      async function sendNumber() {
        //console.log(`ALARMS.readyState  ++++++ -----------------------------  ${alarms.readyState}`);
        //console.log(`ALARMS.OPEN  ++++++ -----------------------------  ${alarms.OPEN}`);
        if (alarms.readyState === alarms.OPEN) {
          if (typeof e.data === "string") {
            //console.log(`JSON.DATA  +++++++++++ -----------------------------  ${e.data}`);
            let jsonData = JSON.parse(e.data);
            setData(jsonData);
          }
          return true;
        }
      }
      sendNumber();
    };
    return () => {
      if (alarms) {
        alarms.close();
      }
    };
  }, [layer, reloadWs]);

  React.useEffect(() => {
    window.addEventListener("online", () => {
      setReloadWs((prev) => !prev);
    });
    window.addEventListener("offline", () => {
      setData([{ state: "No Connection" }]);
    });
  }, []);
  let dataStateTitle = {
    Running: tooltip?.filter((e) => e.ID === "TOOLTIP_CONNECTED")?.[0]
      ?.SHORT_LABEL,
    Stopped: tooltip?.filter((e) => e.ID === "TOOLTIP_STOPPED")?.[0]
      ?.SHORT_LABEL,
    "No Connection": tooltip?.filter(
      (e) => e.ID === "TOOLTIP_SHOW_NO_CONNECTION"
    )?.[0]?.SHORT_LABEL,
  };
  //console.log(`dataStateTitle   -----------------------------  ${dataStateTitle}`);
  //console.log(`dataStateTitle 777  -----------------------------  ${dataStateTitle[data?.[0]?.state]}`); 
  //console.log(`DATA ----------------------------  ${data}`);
  return (
    <Grid
      className="alarms"
      item
      sx={{ position: "relative", mr: 1, marginLeft: "6px" }}
    >
      <Tooltip title={dataStateTitle[data?.[0]?.state]}>
        <IconButton>
          {data?.[0]?.state === "Running" ? (
            <SensorsIcon fontSize="large" sx={{ color: "green" }} />
          ) : (
            <SensorsOffIcon
              fontSize="large"
              sx={{ color: data?.[0]?.state === "Stopped" ? "red" : "yellow" }}
            />
          )}
        </IconButton>
      </Tooltip>
    </Grid>
  );
};
export default React.memo(AlertIcon);
