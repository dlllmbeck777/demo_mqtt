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

const Stops = ({ name }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`Show Boundaries`]
  );
  const stopNum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${name}] Stops`]
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
              {`[${name}][${e}] ${type?.Low}`}
            </Grid>
            <Grid item xs={12}>
              <MyNumberTextField
                disabled={!boundaries}
                defaultValue={highchartProps[`[${name}][${e}] Low`]}
                handleChangeFunc={(value) => {
                  handleChangeFunc(`[${name}][${e}] Low`, value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4.5}>
          <Grid container rowGap={0.5}>
            <Grid item xs={12}>
              {`[${name}][${e}]  ${type?.High}`}
            </Grid>
            <Grid item xs={12}>
              <MyNumberTextField
                disabled={!boundaries}
                defaultValue={highchartProps[`[${name}][${e}] High`]}
                handleChangeFunc={(value) => {
                  handleChangeFunc(`[${name}][${e}] High`, value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Grid container rowGap={0.5}>
            <Grid item xs={12}>
              {`[${name}][${e}]  ${type?.Color}`}
            </Grid>
            <Grid item xs={12}>
              <ColorTextfield
                disabled={!boundaries}
                defaultValue={highchartProps[`[${name}][${e}] Color`]}
                handleChangeFunc={(value) => {
                  handleChangeFunc(`[${name}][${e}] Color`, value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  });
};

const MinMaxSelection = ({ name }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`Show Boundaries`]
  );
  const minimumTag = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`[${name}] Measurement`]?.[0]
        .LIMIT_LOLO
  );
  const maximumTag = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`[${name}] Measurement`]?.[0]
        .LIMIT_HIHI
  );
  const normalMinimumTag = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`[${name}] Measurement`]?.[0]
        .NORMAL_MINIMUM
  );
  const normalMaximumTag = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`[${name}] Measurement`]?.[0]
        .NORMAL_MAXIMUM
  );
  const stops = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${name}] Stops`]
  );

  const minimum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${name}] Minimum`]
  );
  const maximum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${name}] Maximum`]
  );
  const normalMinimum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${name}] Normal Minimum`]
  );
  const normalMaximum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${name}] Normal Maximum`]
  );

  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  return (
    <Grid container columnGap={2} rowGap={1} sx={{ mb: 1 }}>
      <Grid itme xs={12} sm={4.5}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12} className="overview-custom-line-chart-prop">
            {type?.Minimum}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              defaultValue={boundaries ? minimum : minimumTag}
              disabled={!boundaries}
              handleChangeFunc={(value) => {
                handleChangeFunc(`[${name}] Minimum`, value);
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
              defaultValue={boundaries ? normalMinimum : normalMinimumTag}
              handleChangeFunc={(value) => {
                handleChangeFunc(`[${name}] Normal Minimum`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={2} sx={{ marginTop: "auto" }}>
        <IconButton
          variant="outlined"
          onClick={() => {
            dispatch(changeValeus(`[${name}] Minimum`, minimumTag));
            dispatch(changeValeus(`[${name}] Maximum`, maximumTag));
            dispatch(
              changeValeus(`[${name}] Normal Minimum`, normalMinimumTag)
            );
            dispatch(
              changeValeus(`[${name}] Normal Maximum`, normalMaximumTag)
            );
            dispatch(changeValeus(`[${name}] Stops`, 3));
            dispatch(changeValeus(`[${name}][0] Low`, parseFloat(minimumTag)));
            dispatch(
              changeValeus(`[${name}][0] High`, parseFloat(normalMinimumTag))
            );
            dispatch(changeValeus(`[${name}][0] Color`, "#008000"));
            dispatch(
              changeValeus(`[${name}][1] Low`, parseFloat(normalMinimumTag))
            );
            dispatch(
              changeValeus(`[${name}][1] High`, parseFloat(normalMaximumTag))
            );
            dispatch(changeValeus(`[${name}][1] Color`, "#d7d700"));
            dispatch(
              changeValeus(`[${name}][2] Low`, parseFloat(normalMaximumTag))
            );
            dispatch(changeValeus(`[${name}][2] High`, parseFloat(maximumTag)));
            dispatch(changeValeus(`[${name}][2] Color`, "#ff0000"));
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
              defaultValue={boundaries ? normalMaximum : normalMaximumTag}
              handleChangeFunc={(value) => {
                handleChangeFunc(`[${name}] Normal Maximum`, value);
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
              defaultValue={boundaries ? maximum : maximumTag}
              handleChangeFunc={(value) => {
                handleChangeFunc(`[${name}] Maximum`, value);
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
const ColorPicker = ({ name }) => {
  return (
    <Grid item key={name}>
      <Grid container rowGap={1}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid item xs={12} className="overview-custom-line-chart-tag-name">
              {name + 1}
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <MinMaxSelection name={name} />
            <Stops name={name} />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

const StepThree = () => {
  return (
    <Grid container rowGap={2}>
      {[...Array(6)].map((e, i) => {
        return <ColorPicker name={i} />;
      })}
    </Grid>
  );
};

export default StepThree;
