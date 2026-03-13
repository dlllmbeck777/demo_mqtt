import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { changeValeus } from "../../../../services/actions/overview/overviewDialog";
import { IndentSelect, Select } from "../../../";
import CodelistService from "../../../../services/api/codeList";
import ItemService from "../../../../services/api/item";
import "../../../../assets/styles/page/overview/popUpLayout.scss";
const ChoseMeasure = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const ItemData = useSelector((state) => state.overviewDialog.itemData);
  const TYPE = useSelector(
    (state) => state.overviewDialog?.highchartProps?.["Transaction"]
  );
  const processDeff = useSelector(
    (state) => state.overviewDialog.highchartProps["Process Defination"]
  );
  const [processDeffData, setProcessDeffData] = React.useState([]);

  const defProp = useSelector(
    (state) => state.overviewDialog.highchartProps["Transaction Property"]
  );
  React.useEffect(() => {
    const asyncLoadFunc = async () => {
      const body = JSON.stringify({ CULTURE, TYPE });
      try {
        let res = await ItemService.getTypePropertyNoToken(body);
        let data = [];
        Promise.all(
          Object.values(res.data).map((e) => {
            Promise.all(
              e.map((type) => {
                if (
                  type.PROPERTY_TYPE === "NUMBER" ||
                  type.PROPERTY_TYPE === "DURATION"
                )
                  data.push(type);
              })
            );
          })
        );
        setProcessDeffData((prev) => data);
      } catch (err) {}
    };
    asyncLoadFunc();
  }, [TYPE, CULTURE]);
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };

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
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      {/* 
      <Grid item xs={12} md={6}>
        <Grid container rowGap={0.5}>
          <Grid item xs={12}>
            {type?.["Process Defination"]}
          </Grid>
          <Grid item xs={12}>
            <Select
              disabled={processDeffData.length === 0 ? true : false}
              values={processDeffData}
              defaultValue={processDeff?.ROW_ID}
              valuesPath={"ROW_ID"}
              dataTextPath={"SHORT_LABEL"}
              handleChangeFunc={(value) => {
                handleChangeFunc(
                  "Process Defination",
                  processDeffData.find((e) => e.ROW_ID === value)
                );
              }}
            />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default ChoseMeasure;
