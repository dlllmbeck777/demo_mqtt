import React from "react";
import { Box } from "@mui/material";
import Code from "./code/main";
import Bool from "./bool/main";
import Date from "./date/main";
import Chip from "./chip/main";
import Priority from "./priority/main";
import Resources from "./resources/main";
import Layer from "./layerSelect/main";
import Role from "./roleSelect/main";
import Number from "./number/main";
import { useSelector } from "react-redux";
const SelectFieldType = ({ prop_type, value, code_list, DECIMALS }) => {
  switch (prop_type) {
    case "HISTORY":
    case "DATETIME":
      return <Date value={value} />;
    case "CODE":
      return <Code value={value} />;
    case "BOOL":
      return <Bool value={value} />;
    case "CHIP":
      return <Chip value={value} />;
    case "PRIORITY":
      return <Priority value={value} />;
    case "RESOURCES":
      return <Resources value={value} parent={code_list} />;
    case "LAYERSELECT":
      return <Layer value={value} parent={code_list} />;
    case "ROLESELECT":
      return <Role value={value} parent={code_list} />;
    case "DURATION":
    case "NUMBER":
      return <Number value={value} parent={code_list} DECIMALS={DECIMALS} />;
    case "LSELECT":
    case "LONGTEXT":
    case "CUSTOM":
    case "TEXT":
      return value;
    case "ITEM":
      return "ITEM";
    default:
      return <>{prop_type}</>;
  }
};

const TextFields = ({
  prop_type,
  id,
  field,
  mandatory,
  value,
  useDatagridValue,
  code_list,
  DECIMALS,
}) => {
  const val = useSelector(
    (state) => state.datagrid.rows?.find((e) => e.id === id)?.[field]
  );
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        pl: 2,
        pr: 2,
        border:
          mandatory === "True" &&
          ((useDatagridValue ? val : value) === "" ||
            (useDatagridValue ? val : value) === null)
            ? "1px solid red"
            : "",
      }}
    >
      <SelectFieldType
        code_list={code_list}
        value={useDatagridValue ? val : value}
        prop_type={prop_type}
        DECIMALS={DECIMALS}
      />
    </Box>
  );
};

export default React.memo(TextFields);
