import * as React from "react";

import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid, CustomIconToolbar } from "../../";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { wsBaseUrl } from "../../../services/baseApi";
import { styled } from "@mui/material/styles";
import { unicodeToRgb } from "../../../services/utils/unicodeToRgb";
import {
  alarmHistory,
  system_health,
  communicationsStatus,
} from "../../../services/actions/diagnostic/columns";
import { useIsMount } from "../../../hooks/useIsMount";
import { uuidv4 } from "../../../services/utils/uuidGenerator";

var W3CWebSocket = require("websocket").w3cwebsocket;

function Matrix({ highchartProps, updateUuid }) {
  const isMount = useIsMount();
  const cultur = useSelector((state) => state.lang.cultur);
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const layer = useSelector((state) => state?.auth?.user?.active_layer);
  const token = useSelector((state) => state?.auth?.token);
  const [sortModel, setSortModel] = React.useState([
    { field: "time", sort: "desc" },
  ]);
  React.useEffect(() => {
    setSortModel([{ field: "time", sort: "desc" }]);
  }, []);
  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [cultur, highchartProps?.Alarms]);
  React.useEffect(() => {
    let alarms;

    async function asyncFunc() {
      try {
        switch (highchartProps?.["Alarms"]) {
          case "Notification":
            alarms = new W3CWebSocket(
              `${wsBaseUrl}/ws/notifications/${layer.toLowerCase()}/${token}/`
            );
            alarms.onopen = function () {
              alarms.send(`30`);
              console.log("connected");
            };
            setColumns(await system_health(cultur));
            break;
          case "Warning":
            alarms = new W3CWebSocket(
              `${wsBaseUrl}/ws/warnings/${layer.toLowerCase()}/`
            );
            alarms.onopen = function () {
              alarms.send(`30`);
              console.log("connected");
            };
            setColumns(await communicationsStatus(cultur));
            break;
          case "Alarm":
            alarms = new W3CWebSocket(
              `${wsBaseUrl}/ws/asset/alarms/${layer}/${uuidv4()}/`
            );
            alarms.onopen = async function () {
              let body = [];
              if (highchartProps?.Assets)
                Promise.all(
                  highchartProps?.Assets.map((e) => {
                    body.push(e[1]);
                  })
                );
              setColumns(await alarmHistory(cultur));
              alarms.send(JSON.stringify(body));
              console.log("connected");
            };
            break;
          default:
            alarms = new W3CWebSocket(
              `${wsBaseUrl}/ws/alarms/${layer}/${uuidv4()}/`
            );
        }

        alarms.onerror = function () {
          console.log("Connection Error");
        };

        alarms.onclose = function () {
          console.log("WebSocket Client Closed");
        };
        alarms.onmessage = function (e) {
          async function sendNumber() {
            if (alarms.readyState === alarms.OPEN) {
              if (typeof e.data === "string") {
                let jsonData = JSON.parse(e.data);
                setRows(jsonData);
                setLoading(false);
                setSortModel([{ field: "time", sort: "desc" }]);
              }
              return true;
            }
          }
          sendNumber();
        };
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    }
    asyncFunc();

    return () => {
      if (alarms) {
        alarms.close();
      }
    };
  }, [highchartProps?.["alarms"]]);
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .super-app-theme--1": {
      backgroundColor: `rgba(${unicodeToRgb(highchartProps?.["Error Color"])},${
        highchartProps?.["Error Opacity"]
      })`,
      "&:hover": {
        backgroundColor: `rgba(${unicodeToRgb(
          highchartProps?.["Error Color"]
        )},${highchartProps?.["Error Opacity"]})`,
      },
      "&.Mui-selected": {
        backgroundColor: `rgba(${unicodeToRgb(
          highchartProps?.["Error Color"]
        )},${highchartProps?.["Error Opacity"]})`,
        "&:hover": {
          backgroundColor: `rgba(${unicodeToRgb(
            highchartProps?.["Error Color"]
          )},${highchartProps?.["Error Opacity"]})`,
        },
      },
    },
    "& .super-app-theme--2": {
      backgroundColor: `rgba(${unicodeToRgb(
        highchartProps?.["Warning Color"]
      )},${highchartProps?.["Warning Opacity"]})`,
      "&:hover": {
        backgroundColor: `rgba(${unicodeToRgb(
          highchartProps?.["Warning Color"]
        )},${highchartProps?.["Warning Opacity"]})`,
      },
      "&.Mui-selected": {
        backgroundColor: `rgba(${unicodeToRgb(
          highchartProps?.["Warning Color"]
        )},${highchartProps?.["Warning Opacity"]})`,
        "&:hover": {
          backgroundColor: `rgba(${unicodeToRgb(
            highchartProps?.["Warning Color"]
          )},${highchartProps?.["Warning Opacity"]})`,
        },
      },
    },
    "& .super-app-theme--3": {
      backgroundColor: `rgba(${unicodeToRgb(highchartProps?.["Info Color"])},${
        highchartProps?.["Info Opacity"]
      })`,
      "&:hover": {
        backgroundColor: `rgba(${unicodeToRgb(
          highchartProps?.["Info Color"]
        )},${highchartProps?.["Info Opacity"]})`,
      },
      "&.Mui-selected": {
        backgroundColor: `rgba(${unicodeToRgb(
          highchartProps?.["Info Color"]
        )},${highchartProps?.["Info Opacity"]})`,
        "&:hover": {
          backgroundColor: `rgba(${unicodeToRgb(
            highchartProps?.["Info Color"]
          )},${highchartProps?.["Info Opacity"]})`,
        },
      },
    },
  }));
  return (
    <Box sx={{ width: "100%", height: "100%", p: 1 }}>
      <StyledDataGrid
        columns={columns}
        rows={rows}
        loading={loading}
        hideFooter={true}
        components={{
          Toolbar: CustomIconToolbar,
          LoadingOverlay: LinearProgress,
        }}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        getRowClassName={(params) => `super-app-theme--${params.row.priority}`}
      />
    </Box>
  );
}

export default React.memo(Matrix);
