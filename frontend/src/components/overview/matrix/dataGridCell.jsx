import React from "react";
import $ from "jquery";
import { webSocket } from "../utils/webSocket/lastData";

const DataGridCell = ({
  refreshSec,
  handlePropChange,
  color,
  valueFormatter,
  widgetId,
  ...params
}) => {
  const [colors, setColors] = React.useState("");
  var loop = [];
  for (
    let i = 0;
    i < color?.[`[${params?.row?.[params?.field + "NAME"]}] Stops`];
    i++
  ) {
    loop.push(i);
  }
  React.useEffect(() => {
    handlePropChange();
    let ws = false;
    if (params?.row?.[params?.field]) {
      const tagName = params?.row?.[params?.field + "NAME"];
      const wsFunc = (data) => {
        if (!isNaN(valueFormatter(data._value)))
          $(
            `.matrix-widget-container__${
              params?.row?.[params?.field]
            }__val__${widgetId}`
          ).html(valueFormatter(data._value));

        loop.map((e) => {
          if (
            parseFloat(
              color?.[`[${e}] [${params?.row?.[params?.field + "NAME"]}] Low`]
            ) < data._value &&
            parseFloat(
              color?.[`[${e}] [${params?.row?.[params?.field + "NAME"]}] High`]
            ) > data._value
          ) {
            setColors(
              color?.[`[${e}] [${params?.row?.[params?.field + "NAME"]}] Color`]
            );
          }
        });
      };
      ws = new webSocket(parseInt(refreshSec), tagName, wsFunc);
      ws.openWs();
    }
    return () => {
      ws.closeWs();
    };
  }, [color]);

  return (
    <div
      className={`matrix-widget-container__${
        params?.row?.[params?.field]
      }__${widgetId} matrix-widget-container__cell__${widgetId}`}
      style={{ color: colors }}
    >
      <span
        className={`matrix-widget-container__${
          params?.row?.[params?.field]
        }__val__${widgetId}
        matrix-widget-container__val__${widgetId}`}
      ></span>{" "}
      <span
        className={`matrix-widget-container__${
          params?.row?.[params?.field]
        }__uom__${widgetId} 
        matrix-widget-container__uom__${widgetId}`}
      >
        {params?.row?.[`${params?.field + "UOM"}`]}
      </span>
    </div>
  );
};

export default React.memo(DataGridCell);
