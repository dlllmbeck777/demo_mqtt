import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@mui/material";

import PopUpItem from "../../highchart/popUpLayout/popUpItem";
import { Select } from "../..";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import CodelistService from "../../../services/api/codeList";
import MyList from "../utils/popUpUtils/list";
const StepOne = () => {
  const dispatch = useDispatch();
  const [shemaValues, setShemaValues] = React.useState([]);
  const type = useSelector((state) => state.overviewDialog.values);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const FontSize = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Default Font Size"]
  );
  const Shema = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Schematic Type"]
  );

  React.useEffect(() => {
    async function asyncLoadFunc() {
      try {
        let res = await CodelistService.getByParentHierarchy({
          CULTURE,
          LIST_TYPE: "SCHEMATIC_TYPE",
        });
        setShemaValues(res?.data);
        if (Shema === "") {
          dispatch(changeValeus("Schematic Type", res?.data?.[0]?.CODE));
        }
      } catch (err) {
        console.log(err);
        console.log("catch");
      }
    }
    asyncLoadFunc();
  }, []);
  return (
    <Grid
      container
      columnSpacing={2}
      rowGap={2}
      className="pop-up-layout-font-size"
    >
      <Grid item xs={12} sm={8.5}>
        <Grid container rowGap={2}>
          <Grid item xs={12}>
            <Grid container columnSpacing={2} rowGap={2}>
              <PopUpItem type="text" title="Name" nullTrue={true} />
              <PopUpItem
                type="number"
                title="Name Font Size(em)"
                disabled={FontSize}
              />
              <PopUpItem type="number" title="Widget Refresh (seconds)" />
              <PopUpItem
                type="number"
                title="Value Font Size"
                disabled={FontSize}
              />
              <PopUpItem
                type="number"
                title="UoM Font Size"
                disabled={FontSize}
              />
              <PopUpItem type="number" title="Decimal Places" />

              <Grid item xs={12} sm={6}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={12}>
                    {type?.["Schematic Type"]}
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      values={shemaValues}
                      defaultValue={Shema}
                      handleChangeFunc={(value) => {
                        dispatch(changeValeus("Schematic Type", value));
                      }}
                      valuesPath={"CODE"}
                      dataTextPath={"CODE_TEXT"}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3.5}>
        <Grid container>
          <Grid item xs={12}>
            <MyList
              array={[
                "Name",
                "Measurement",
                "Unit of Measurement",
                "Boundaries",
                "Default Font Size",
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StepOne;
