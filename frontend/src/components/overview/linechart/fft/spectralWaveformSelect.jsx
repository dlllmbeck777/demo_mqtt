import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { Select } from "../../..";
import { changeValeus } from "../../../../services/actions/overview/overviewDialog";
import CodelistService from "../../../../services/api/codeList";
const SpectralWaweformSelect = () => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const typeKey = useSelector((state) => state.overviewDialog.values);
  const Kinematic = useSelector(
    (state) => state.overviewDialog.highchartProps["Kinematic"]
  );
  const Waveform = useSelector(
    (state) => state.overviewDialog.highchartProps["Spectral Waveform"]
  );
  const [kinematicValues, setKinematikValues] = React.useState([]);
  const [spectralValues, setSpectralValues] = React.useState([]);

  const handleChangeSpectral = (val) => {
    dispatch(changeValeus("Spectral Waveform", val));
  };

  const handleChangeKinematik = async (val) => {
    dispatch(changeValeus("Kinematic", val));

    try {
      let value = await CodelistService.getByParentHierarchy({
        CULTURE,
        LIST_TYPE: "SPECTRAL_WAVEFORM",
        PARENT: val,
      });
      setSpectralValues(value?.data);
      handleChangeSpectral(value?.data?.[0]?.CODE);
    } catch (err) {
      console.log(err);
    }
  };
  React.useEffect(() => {
    async function asyncLoadFunc() {
      try {
        let res = await CodelistService.getByParentHierarchy({
          CULTURE,
          LIST_TYPE: "KINEMATIC",
        });
        setKinematikValues(res?.data);
        if (Kinematic === "") {
          handleChangeKinematik(res.data?.[0]?.CODE);
        } else {
          let value = await CodelistService.getByParentHierarchy({
            CULTURE,
            LIST_TYPE: "SPECTRAL_WAVEFORM",
            PARENT: Kinematic,
          });
          setSpectralValues(value?.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    asyncLoadFunc();
  }, []);
  return (
    <>
      <Grid item xs={12} sm={6}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {typeKey?.["Kinematic"]}
          </Grid>
          <Grid item xs={12}>
            <Select
              defaultValue={Kinematic}
              handleChangeFunc={(val) => {
                handleChangeKinematik(val);
              }}
              values={kinematicValues}
              valuesPath={"CODE"}
              dataTextPath={"CODE_TEXT"}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {typeKey?.["Spectral Waveform"]}
          </Grid>
          <Grid item xs={12}>
            <Select
              defaultValue={Waveform}
              handleChangeFunc={(val) => {
                handleChangeSpectral(val);
              }}
              values={spectralValues}
              valuesPath={"CODE"}
              dataTextPath={"CODE_TEXT"}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SpectralWaweformSelect;
