import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Grid } from "@mui/material";

import { LoadingComponent } from "../../../components";
import {
  updateChart,
  fillTypeValues,
} from "../../../services/actions/overview/overviewDialog";
import CodelistService from "../../../services/api/codeList";
import * as PopUps from "../../../components/overview/updatePopUp";
import resourceList from "../../../services/api/resourceList";
import "../../../assets/styles/page/overview/updateContainer.scss";

const buttonTextCache = new Map();
const widgetCodeDetailCache = new Map();

const DialogContent = ({ highchartProps, chartId, refresh, ...rest }) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [loading, setLoading] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [btnText, setBtnText] = React.useState([]);
  const { [selectedItem?.CHAR1]: Element } = PopUps;
  const cancelLabel =
    btnText?.find((e) => e.ID === "BUTTON_TEXT_CANCEL")?.SHORT_LABEL || "Cancel";
  const saveLabel =
    btnText?.find((e) => e.ID === "BUTTON_TEXT_SAVE")?.SHORT_LABEL || "Save";

  React.useEffect(() => {
    let isActive = true;

    async function loadDialogData() {
      if (!highchartProps?.Type) {
        setLoading(false);
        return;
      }

      setLoading(true);
      dispatch({
        type: "SET_HIGHCHART_PROPERTY_OVERVIEW_DIALOG",
        payload: { ...highchartProps },
      });

      const widgetTypeKey = `${CULTURE}:${highchartProps.Type}`;
      const buttonTextKey = `${CULTURE}:BUTTON_TEXT`;

      const selectedItemPromise = highchartProps?.CHAR1
        ? Promise.resolve(highchartProps)
        : widgetCodeDetailCache.has(widgetTypeKey)
        ? Promise.resolve(widgetCodeDetailCache.get(widgetTypeKey))
        : CodelistService.getCodelistDetail({
            CODE: highchartProps.Type,
            CULTURE,
          }).then((res) => {
            const value = res?.data?.[0] || null;
            widgetCodeDetailCache.set(widgetTypeKey, value);
            return value;
          });

      const typeValuesPromise = dispatch(fillTypeValues(highchartProps.Type));

      if (buttonTextCache.has(buttonTextKey)) {
        setBtnText(buttonTextCache.get(buttonTextKey));
      } else {
        resourceList
          .getResourcelist({
            CULTURE,
            PARENT: "BUTTON_TEXT",
          })
          .then((res) => {
            const value = res?.data || [];
            buttonTextCache.set(buttonTextKey, value);
            if (isActive) {
              setBtnText(value);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      try {
        const [nextSelectedItem] = await Promise.all([
          selectedItemPromise,
          typeValuesPromise,
        ]);

        if (!isActive) {
          return;
        }

        setSelectedItem(nextSelectedItem);
      } catch (err) {
        if (!isActive) {
          return;
        }
        console.log(err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadDialogData();

    return () => {
      isActive = false;
    };
  }, [CULTURE, dispatch, highchartProps]);

  return (
    <Grid container className="overview-update-pop-up">
      <Grid item xs={12} className="overview-update-pop-up__box">
        {Element && !loading ? (
          <Element title={highchartProps.Type} {...rest} />
        ) : (
          <LoadingComponent />
        )}
      </Grid>

      <Grid
        container
        columnSpacing={0.5}
        className="overview-update-pop-up__footer"
      >
        <Grid item>
          <Button
            className="dialog-header-text"
            onClick={() => {
              rest.handleClose();
            }}
            variant="outlined"
          >
            {cancelLabel}
          </Button>
        </Grid>
        <Grid item>
          <Button
            className="dialog-header-text"
            onClick={() => {
              dispatch(updateChart(chartId, refresh));
              rest.handleClose();
            }}
            variant="outlined"
          >
            {saveLabel}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(DialogContent);
