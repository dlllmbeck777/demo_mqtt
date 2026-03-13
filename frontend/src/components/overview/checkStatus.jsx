import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { webSocket } from "./utils/webSocket/status";
const CheckStatus = ({ chartProps }) => {
  const [status, setStatus] = React.useState(true);
  const [list, setList] = React.useState([]);
  React.useEffect(() => {
    let ws = false;
    function myFunc(tagName) {
      const wsFunc = (data) => {
        setList(data);
      };
      ws = new webSocket(tagName, wsFunc);
      ws.openWs();
    }
    if (chartProps?.Inputs) {
      let body = [];
      Promise.all(
        chartProps?.Inputs.map((e) => {
          body.push(e.NAME);
        })
      );
      myFunc(body);
    } else if (chartProps?.Measurement) {
      myFunc([chartProps?.Measurement?.[0].NAME]);
    } else {
      setStatus(false);
    }
    return () => {
      if (ws) ws.closeWs();
    };
  }, [chartProps]);
  React.useEffect(() => {}, []);
  return (
    <Box sx={{ position: "absolute", left: 2, bottom: 2 }}>
      <IconButton>
        {status &&
          (list.length === 0 ? (
            <LinkIcon sx={{ color: "green" }} />
          ) : (
            <Tooltip
              title={
                <>
                  {list?.map((e) => {
                    return (
                      <>
                        {e} <br />
                      </>
                    );
                  })}
                </>
              }
            >
              <LinkOffIcon sx={{ color: "red" }} />
            </Tooltip>
          ))}
      </IconButton>
    </Box>
  );
};

export default CheckStatus;
