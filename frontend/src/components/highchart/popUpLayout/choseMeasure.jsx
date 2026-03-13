import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import { Select } from "../..";
import ItemLinkService from "../../../services/api/itemLink";
import { IndentSelect } from "../../";
import "../../../assets/styles/page/overview/popUpLayout.scss";
const ChoseMeasure = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const ItemData = useSelector((state) => state.overviewDialog.itemData);
  const measure = useSelector(
    (state) => state.overviewDialog.highchartProps.Measurement?.[0]?.TAG_ID
  );
  const defProp = useSelector(
    (state) => state.overviewDialog.highchartProps["Transaction Property"]
  );
  const UOM = useSelector(
    (state) => state.overviewDialog.highchartProps["UOM"]
  );
  const [tags, setTags] = React.useState([]);
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };

  React.useEffect(() => {
    const myFunc = async () => {
      if (ItemData.length === 0 || tags.length === 0) {
        let response = await ItemLinkService.getTags({ ID: defProp, CULTURE });
        setTags(response.data);
      }
    };
    myFunc();
  }, [defProp]);

  return (
    <Grid
      container
      columnSpacing={2}
      rowGap={2}
      className="pop-up-layout-font-size"
    >
      <Grid item xs={12} md={6}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["Transaction Property"]}
          </Grid>
          <Grid item xs={12}>
            <IndentSelect
              disabled={ItemData.length === 0 ? true : false}
              values={ItemData}
              valuesPath="0"
              dataTextPath="1"
              indentPath="2"
              defaultValue={defProp}
              handleChangeFunc={async (value) => {
                handleChangeFunc("Transaction Property", value);
                let res = await ItemLinkService.getTags({ ID: value, CULTURE });
                setTags(res.data);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["Measurement"]}
          </Grid>
          <Grid item xs={12}>
            <Select
              disabled={tags.length === 0 ? true : false}
              values={tags}
              valuesPath="TAG_ID"
              dataTextPath="SHORT_NAME"
              defaultValue={measure}
              handleChangeFunc={async (value) => {
                handleChangeFunc(
                  "Measurement",
                  tags.filter((e) => e.TAG_ID === value)
                );
                handleChangeFunc(
                  "Minimum",
                  tags.filter((e) => e.TAG_ID === value)[0].LIMIT_LOLO
                );
                handleChangeFunc(
                  "Normal Minimum",
                  tags.filter((e) => e.TAG_ID === value)[0].NORMAL_MINIMUM
                );
                handleChangeFunc(
                  "Normal Maximum",
                  tags.filter((e) => e.TAG_ID === value)[0].NORMAL_MAXIMUM
                );
                handleChangeFunc(
                  "Maximum",
                  tags.filter((e) => e.TAG_ID === value)[0].LIMIT_HIHI
                );
                handleChangeFunc(
                  "UOM",
                  tags.filter((e) => e.TAG_ID === value)[0].CATALOG_SYMBOL
                );
                handleChangeFunc("Stops", 3);
                handleChangeFunc(
                  "[0] Stops",
                  tags.filter((e) => e.TAG_ID === value)[0].NORMAL_MINIMUM
                );

                handleChangeFunc(
                  "[0] Low",
                  tags.filter((e) => e.TAG_ID === value)[0].LIMIT_LOLO
                );

                handleChangeFunc(
                  "[0] High",
                  tags.filter((e) => e.TAG_ID === value)[0].NORMAL_MINIMUM
                );
                handleChangeFunc("[0] Color", "#008000");

                handleChangeFunc(
                  "[1] Stops",
                  tags.filter((e) => e.TAG_ID === value)[0].NORMAL_MAXIMUM
                );
                handleChangeFunc(
                  "[1] Low",
                  tags.filter((e) => e.TAG_ID === value)[0].NORMAL_MINIMUM
                );

                handleChangeFunc(
                  "[1] High",
                  tags.filter((e) => e.TAG_ID === value)[0].NORMAL_MAXIMUM
                );
                handleChangeFunc("[1] Color", "#d7d700");

                handleChangeFunc(
                  "[2] Stops",
                  tags.filter((e) => e.TAG_ID === value)[0].LIMIT_HIHI
                );

                handleChangeFunc(
                  "[2] Low",
                  tags.filter((e) => e.TAG_ID === value)[0].NORMAL_MAXIMUM
                );

                handleChangeFunc(
                  "[2] High",
                  tags.filter((e) => e.TAG_ID === value)[0].LIMIT_HIHI
                );
                handleChangeFunc("[2] Color", "#ff0000");
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["UOM"]}
          </Grid>
          <Grid item xs={12}>
            <Select values={[UOM]} defaultValue={UOM} disabled={true} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChoseMeasure;
