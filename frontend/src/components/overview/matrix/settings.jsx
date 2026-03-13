import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MyNumberTextField, ColorTextfield } from "../..";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Stops = ({ tagName }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`Show Boundaries`]
  );
  const stopNum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${tagName}] Stops`]
  );
  const highchartProps = useSelector(
    (state) => state.overviewDialog.highchartProps
  );
  var loop = [];
  for (let i = 0; i < stopNum; i++) {
    loop.push(i);
  }
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  return loop.map((e) => {
    return (
      <Grid container columnGap={2} key={e} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6} md={4.5}>
          <Grid container rowGap={0.5}>
            <Grid item xs={12}>
              {`[${e}] ${type?.Low}`}
            </Grid>
            <Grid item xs={12}>
              <MyNumberTextField
                disabled={!boundaries}
                defaultValue={highchartProps[`[${e}] [${tagName}] Low`]}
                handleChangeFunc={(value) => {
                  handleChangeFunc(`[${e}] [${tagName}] Low`, value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4.5}>
          <Grid container rowGap={0.5}>
            <Grid item xs={12}>
              {`[${e}] ${type?.High}`}
            </Grid>
            <Grid item xs={12}>
              <MyNumberTextField
                disabled={!boundaries}
                defaultValue={highchartProps[`[${e}] [${tagName}] High`]}
                handleChangeFunc={(value) => {
                  handleChangeFunc(`[${e}] [${tagName}] High`, value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Grid container rowGap={0.5}>
            <Grid item xs={12}>
              {`[${e}] ${type?.Color}`}
            </Grid>
            <Grid item xs={12}>
              <ColorTextfield
                disabled={!boundaries}
                defaultValue={highchartProps[`[${e}] [${tagName}] Color`]}
                handleChangeFunc={(value) => {
                  handleChangeFunc(`[${e}] [${tagName}] Color`, value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  });
};

const ColorPicker = () => {
  const dispatch = useDispatch();
  const Inputs = useSelector(
    (state) => state.overviewDialog.highchartProps?.Inputs
  );
  return (
    Inputs && (
      <Grid container rowGap={2}>
        {Inputs.map((e, i) => (
          <Grid item key={i}>
            <Grid container rowGap={1}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Grid
                    item
                    xs={12}
                    className="overview-custom-line-chart-tag-name"
                  >
                    {e.SHORT_NAME}
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <MinMaxSelection name={e.NAME} />
                  <Stops tagName={e.NAME} />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        ))}
      </Grid>
    )
  );
};

const MinMaxSelection = ({ name }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`Show Boundaries`]
  );
  const minimum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`${name} Y-Axis Minimum`]
  );
  const maximum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`${name} Y-Axis Maximum`]
  );
  const normalMinimum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`${name} Y-Axis Normal Minimum`]
  );
  const normalMaximum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`${name} Y-Axis Normal Maximum`]
  );
  const stops = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${name}] Stops`]
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  const minimumTag = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.Inputs.filter(
        (e) => e.NAME === name
      )[0]?.LIMIT_LOLO
  );
  const tagMaximum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.Inputs.filter(
        (e) => e.NAME === name
      )[0]?.LIMIT_HIHI
  );
  const tagNormalMinimum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.Inputs.filter(
        (e) => e.NAME === name
      )[0]?.NORMAL_MINIMUM
  );
  const tagNormalMaximum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.Inputs.filter(
        (e) => e.NAME === name
      )[0]?.NORMAL_MAXIMUM
  );
  return (
    <Grid container columnGap={2} rowGap={1} sx={{ mb: 1 }}>
      <Grid itme xs={12} sm={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12} className="overview-custom-line-chart-prop">
            {type?.["Minimum"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              defaultValue={minimum}
              disabled={!boundaries}
              handleChangeFunc={(value) => {
                handleChangeFunc(`${name} Y-Axis Minimum`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid itme xs={12} sm={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12} className="overview-custom-line-chart-prop">
            {type?.["Normal Minimum"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              disabled={!boundaries}
              defaultValue={normalMinimum}
              handleChangeFunc={(value) => {
                handleChangeFunc(`${name} Y-Axis Normal Minimum`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={2} sx={{ marginTop: "auto" }}>
        <IconButton
          variant="outlined"
          onClick={() => {
            dispatch(changeValeus(`${name} Y-Axis Minimum`, minimumTag));
            dispatch(changeValeus(`${name} Y-Axis Maximum`, tagMaximum));
            dispatch(
              changeValeus(`${name} Y-Axis Normal Minimum`, tagNormalMinimum)
            );
            dispatch(
              changeValeus(`${name} Y-Axis Normal Maximum`, tagNormalMaximum)
            );

            dispatch(changeValeus(`[${name}] Stops`, 3));
            dispatch(changeValeus(`[0] [${name}] Low`, parseFloat(minimumTag)));
            dispatch(
              changeValeus(`[0] [${name}] High`, parseFloat(tagNormalMinimum))
            );
            dispatch(changeValeus(`[0] [${name}] Color`, "#008000"));
            dispatch(
              changeValeus(`[1] [${name}] Low`, parseFloat(tagNormalMinimum))
            );
            dispatch(
              changeValeus(`[1] [${name}] High`, parseFloat(tagNormalMaximum))
            );
            dispatch(changeValeus(`[1] [${name}] Color`, "#d7d700"));
            dispatch(
              changeValeus(`[2] [${name}] Low`, parseFloat(tagNormalMaximum))
            );
            dispatch(
              changeValeus(`[2] [${name}] High`, parseFloat(tagMaximum))
            );
            dispatch(changeValeus(`[2] [${name}] Color`, "#ff0000"));
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Grid>
      <Grid itme xs={12} sm={4} md={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12} className="overview-custom-line-chart-prop">
            {type?.["Normal Maximum"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              disabled={!boundaries}
              defaultValue={normalMaximum}
              handleChangeFunc={(value) => {
                handleChangeFunc(`${name} Y-Axis Normal Maximum`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid itme xs={12} sm={4} md={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12} className="overview-custom-line-chart-prop">
            {type?.["Maximum"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              disabled={!boundaries}
              defaultValue={maximum}
              handleChangeFunc={(value) => {
                handleChangeFunc(`${name} Y-Axis Maximum`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid itme xs={12} sm={4} md={2}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12} className="overview-custom-line-chart-prop">
            {type?.["Stops"]}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              defaultValue={stops}
              disabled={!boundaries}
              handleChangeFunc={(value) => {
                dispatch(changeValeus(`[${name}] Stops`, value));
              }}
              className="overview-number-text-field"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const YAxis = () => {
  const Inputs = useSelector(
    (state) => state.overviewDialog.highchartProps.Inputs
  );
  return (
    <Grid container rowGap={0.5}>
      <Grid item xs={12}>
        <ColorPicker />
      </Grid>
    </Grid>
  );
};

export default YAxis;
