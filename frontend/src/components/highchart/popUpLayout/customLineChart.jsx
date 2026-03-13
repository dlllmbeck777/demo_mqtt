import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, IconButton } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MyNumberTextField, ColorTextfield } from "../..";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import MyList from "../../overview/utils/popUpUtils/list";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import { uuidv4 } from "../../../services/utils/uuidGenerator";
const Stop = ({ tag, index }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const min = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`[${index}] [${tag.NAME}] Low`]
  );
  const max = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`[${index}] [${tag.NAME}] High`]
  );
  const color = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`[${index}] [${tag.NAME}] Color`]
  );
  const opacity = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.[`[${index}] [${tag.NAME}] Opacity`]
  );
  const minMax = useSelector(
    (state) =>
      state.overviewDialog.highchartProps["Show Enable Manual Y-Axis Min/Max"]
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
    dispatch(changeValeus("Settings Flag", uuidv4()));
  };
  return (
    <Grid container columnSpacing={2} key={index} sx={{ mb: 1 }}>
      <Grid item xs={12} md={3}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {`[${index}] ${type?.Low}`}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              disabled={!minMax}
              defaultValue={min}
              handleChangeFunc={(value) => {
                handleChangeFunc(`[${index}] [${tag.NAME}] Low`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {`[${index}] ${type?.High}`}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              disabled={!minMax}
              defaultValue={max}
              handleChangeFunc={(value) => {
                handleChangeFunc(`[${index}] [${tag.NAME}] High`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {`[${index}] ${type?.Opacity}`}
          </Grid>
          <Grid item xs={12}>
            <MyNumberTextField
              disabled={!minMax}
              defaultValue={opacity}
              handleChangeFunc={(value) => {
                handleChangeFunc(`[${index}] [${tag.NAME}] Opacity`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {`[${index}] ${type?.Color}`}
          </Grid>
          <Grid item xs={12}>
            <ColorTextfield
              disabled={!minMax}
              defaultValue={color}
              handleChangeFunc={(value) => {
                handleChangeFunc(`[${index}] [${tag.NAME}] Color`, value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
const Stops = ({ tag }) => {
  const stopNum = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`[${tag.NAME}] Stops`]
  );
  return [...Array(parseInt(stopNum))].map((e, i) => {
    return <Stop tag={tag} index={i} />;
  });
};

const ColorPicker = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const Inputs = useSelector(
    (state) => state.overviewDialog.highchartProps?.Inputs
  );
  const highchartProps = useSelector(
    (state) => state.overviewDialog.highchartProps
  );
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Boundaries"]
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  const helper = (e) => {
    dispatch(changeValeus(`${e.NAME} Y-Axis Minimum`, e.LIMIT_LOLO));
    dispatch(changeValeus(`${e.NAME} Y-Axis Maximum`, e.LIMIT_HIHI));
    dispatch(changeValeus(`${e.NAME} Y-Axis Normal Minimum`, e.NORMAL_MINIMUM));
    dispatch(changeValeus(`${e.NAME} Y-Axis Normal Maximum`, e.NORMAL_MAXIMUM));

    dispatch(changeValeus(`[${e.NAME}] Stops`, 3));
    dispatch(changeValeus(`[0] [${e.NAME}] Low`, parseFloat(e.LIMIT_LOLO)));
    dispatch(
      changeValeus(`[0] [${e.NAME}] High`, parseFloat(e.NORMAL_MINIMUM))
    );
    dispatch(changeValeus(`[0] [${e.NAME}] Color`, "#008000"));
    dispatch(changeValeus(`[0] [${e.NAME}] Opacity`, "0.15"));
    dispatch(changeValeus(`[1] [${e.NAME}] Low`, parseFloat(e.NORMAL_MINIMUM)));
    dispatch(
      changeValeus(`[1] [${e.NAME}] High`, parseFloat(e.NORMAL_MAXIMUM))
    );
    dispatch(changeValeus(`[1] [${e.NAME}] Color`, "#d7d700"));
    dispatch(changeValeus(`[1] [${e.NAME}] Opacity`, "0.15"));
    dispatch(changeValeus(`[2] [${e.NAME}] Low`, parseFloat(e.NORMAL_MAXIMUM)));
    dispatch(changeValeus(`[2] [${e.NAME}] High`, parseFloat(e.LIMIT_HIHI)));
    dispatch(changeValeus(`[2] [${e.NAME}] Color`, "#ff0000"));
    dispatch(changeValeus(`[2] [${e.NAME}] Opacity`, "0.15"));
    dispatch(changeValeus(`Color Flag`, uuidv4()));
  };

  return (
    <Grid container rowGap={2}>
      {Inputs?.map((e, i) => (
        <Grid item xs={12} key={i}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className="overview-custom-line-chart-tag-name"
            >
              {e.SHORT_NAME}
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                columnSpacing={2}
                rowSpacing={2}
                className="AAAAAAAAAAAAAAAAA"
              >
                <Grid item xs={6}>
                  <MinMaxSelection name={e.NAME} />
                </Grid>
                <Grid item xs={boundaries ? 6 : 12}>
                  <Grid
                    container
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Grid item xs={6}>
                      <Grid container rowGap={0.5}>
                        <Grid
                          item
                          xs={12}
                          className="overview-custom-line-chart-prop"
                        >
                          {type?.Color}
                        </Grid>
                        <Grid item xs={12}>
                          <ColorTextfield
                            defaultValue={highchartProps[`[${e.NAME}] Color`]}
                            handleChangeFunc={(value) => {
                              handleChangeFunc(`[${e.NAME}] Color`, value);
                              dispatch(changeValeus(`Color Flag`, uuidv4()));
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      className="overview-custom-line-chart-prop"
                    >
                      <IconButton
                        onClick={() => {
                          helper(e);
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {i === 0 && <Stops tag={e} />}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};

const MinMaxSelection = ({ name }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const minMax = useSelector(
    (state) =>
      state.overviewDialog.highchartProps["Show Enable Manual Y-Axis Min/Max"]
  );
  const minimum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.Inputs.filter(
        (e) => e.NAME === name
      )[0]?.LIMIT_LOLO
  );
  const maximum = useSelector(
    (state) =>
      state.overviewDialog.highchartProps?.Inputs.filter(
        (e) => e.NAME === name
      )[0]?.LIMIT_HIHI
  );
  const minimumManual = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`${name} Y-Axis Minimum`]
  );
  const maximumManual = useSelector(
    (state) => state.overviewDialog.highchartProps?.[`${name} Y-Axis Maximum`]
  );
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Boundaries"]
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };

  return (
    boundaries && (
      <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={6}>
          <Grid container rowGap={0.5}>
            <Grid
              item
              xs={12}
              className="overview-custom-line-chart-prop"
              sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {type?.["Y-Axis Minimum"]}
            </Grid>
            <Grid item xs={12}>
              <MyNumberTextField
                defaultValue={minMax ? minimumManual : minimum}
                disabled={!minMax}
                handleChangeFunc={(value) => {
                  handleChangeFunc(`${name} Y-Axis Minimum`, value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container rowGap={0.5}>
            <Grid
              item
              xs={12}
              className="overview-custom-line-chart-prop"
              sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {type?.["Y-Axis Maximum"]}
            </Grid>
            <Grid item xs={12}>
              <MyNumberTextField
                defaultValue={minMax ? maximumManual : maximum}
                disabled={!minMax}
                handleChangeFunc={(value) => {
                  handleChangeFunc(`${name} Y-Axis Maximum`, value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  );
};

const YAxis = () => {
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Boundaries"]
  );
  return (
    <Grid container>
      <Grid item xs={7}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            <ColorPicker />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Grid container rowGap={0.5}>
          <MyList
            array={[
              "Enable Custom Color",
              boundaries && "Enable Manual Y-Axis Min/Max",
              "Enable Y-Axis Align Ticks",
              "Enable Y-Axis Start On Ticks",
              "Enable Y-Axis End On Ticks",
            ]}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default YAxis;
