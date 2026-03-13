import React from "react";
import { Box } from "@mui/material";
import ItemService from "../../../../services/api/item";
import { useSelector } from "react-redux";
import UomService from "../../../../services/api/uom";
const Measurement = ({ chartProps, width, height }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);

  const [data, setData] = React.useState("0");
  const [uom, setUom] = React.useState("");
  function colorPicker(val) {
    let color = "inherit";
    let i = 0;
    while (i < parseInt(chartProps?.Stops)) {
      if (
        parseFloat(chartProps[`[${i}] Low`]) <= val &&
        parseFloat(chartProps[`[${i}] High`]) > val
      ) {
        color = chartProps[`[${i}] Color`];
      }
      i++;
    }
    return color;
  }
  console.log(chartProps);
  async function loadData() {
    try {
      let res = await ItemService.chartStatusGet({
        CULTURE,
        ITEM_ID: chartProps?.["Transaction Property"],
        EVENT_TYPE: chartProps?.Transaction,
      });
      setData((prev) => res.data);
    } catch (err) {
      console.log(err);
    }
  }
  async function loadUom() {
    try {
      const body = { CULTURE, CODE: chartProps?.["Process Defination"]?.UOM };
      let res = await UomService.getUomCode(body);
      console.log(res);
      setUom((prev) => res.data?.[0]?.CATALOG_SYMBOL);
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    loadData();
  }, []);
  React.useEffect(() => {
    loadUom();
  }, [CULTURE]);
  return (
    <Box
      sx={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        display: chartProps["Show Measurement"] ? "flex" : "none",
        fontSize:
          chartProps["Value Font Size"] !== ""
            ? `${chartProps["Value Font Size"]}px`
            : "14px",
        color: colorPicker(
          parseFloat(data?.[chartProps?.["Process Defination"]?.COLUMN_NAME])
        ),
        fontWeight: "bold",
      }}
    >
      {parseFloat(
        data?.[chartProps?.["Process Defination"]?.COLUMN_NAME]
      ).toFixed(
        chartProps["Decimal Places"] === "" ? 0 : chartProps["Decimal Places"]
      )}{" "}
      {chartProps?.["Show Unit of Measurement"] ? uom : ""}
    </Box>
  );
};
export default React.memo(Measurement);
