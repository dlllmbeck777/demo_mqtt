import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Input } from "@mui/material";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import { Select } from "../..";
import ItemLinkService from "../../../services/api/itemLink";
import { IndentSelect } from "../../";
import "../../../assets/styles/page/overview/popUpLayout.scss";

const MeasureLoop = ({ tags, name, id }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const tagname = useSelector(
    (state) =>
      state.overviewDialog.highchartProps[`[${name}] Measurement`]?.[0].NAME
  );

  const UOM = useSelector(
    (state) => state.overviewDialog.highchartProps[`[${name}] Uom`]
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };

  return (
    <>
      <Grid item xs={12}>
        {name + 1}
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
              valuesPath="NAME"
              dataTextPath="SHORT_NAME"
              defaultValue={tagname}
              handleChangeFunc={async (value) => {
                handleChangeFunc(
                  `[${name}] Measurement`,
                  tags.filter((e) => e.NAME === value)
                );
                handleChangeFunc(
                  `[${name}] Uom`,
                  tags.filter((e) => e.NAME === value)[0].CATALOG_SYMBOL
                );
                handleChangeFunc(`[${name}] Stops`, 3);

                handleChangeFunc(
                  `[${name}] Minimum`,
                  tags.filter((e) => e.NAME === value)[0].LIMIT_LOLO
                );
                handleChangeFunc(
                  `[${name}] Normal Minimum`,
                  tags.filter((e) => e.NAME === value)[0].NORMAL_MINIMUM
                );
                handleChangeFunc(
                  `[${name}] Normal Maximum`,
                  tags.filter((e) => e.NAME === value)[0].NORMAL_MAXIMUM
                );
                handleChangeFunc(
                  `[${name}] Maximum`,
                  tags.filter((e) => e.NAME === value)[0].LIMIT_HIHI
                );
                handleChangeFunc(
                  `[${name}][0] Low`,
                  tags.filter((e) => e.NAME === value)[0].LIMIT_LOLO
                );
                handleChangeFunc(
                  `[${name}][0] High`,
                  tags.filter((e) => e.NAME === value)[0].NORMAL_MINIMUM
                );
                handleChangeFunc(`[${name}][0] Color`, `#008000`);

                handleChangeFunc(
                  `[${name}][1] Low`,
                  tags.filter((e) => e.NAME === value)[0].NORMAL_MINIMUM
                );

                handleChangeFunc(
                  `[${name}][1] High`,
                  tags.filter((e) => e.NAME === value)[0].NORMAL_MAXIMUM
                );
                handleChangeFunc(`[${name}][1] Color`, `#d7d700`);

                handleChangeFunc(
                  `[${name}][2] Low`,
                  tags.filter((e) => e.NAME === value)[0].NORMAL_MAXIMUM
                );

                handleChangeFunc(
                  `[${name}][2] High`,
                  tags.filter((e) => e.NAME === value)[0].LIMIT_HIHI
                );
                handleChangeFunc(`[${name}][2] Color`, `#ff0000`);
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
    </>
  );
};

const ChoseMeasure = () => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const ItemData = useSelector((state) => state.overviewDialog.itemData);
  const defProp = useSelector(
    (state) => state.overviewDialog.highchartProps["Transaction Property"]
  );
  const type = useSelector((state) => state.overviewDialog.values);
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
      <Grid item xs={6}></Grid>
      {[...Array(6)].map((e, i) => (
        <MeasureLoop tags={tags} name={i} id={i} />
      ))}
    </Grid>
  );
};

export default ChoseMeasure;
