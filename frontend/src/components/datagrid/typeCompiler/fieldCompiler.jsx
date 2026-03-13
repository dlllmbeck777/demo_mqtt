import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import Text from "./text/text";
import CodeComponent from "./code/main";
import Number from "./number/number";
import Bool from "./bool/bool";
import Datetime from "./datetime/datetime";
import LSelect from "./LSelect/main";
import LayerSelect from "./layerSelect/main";
import RoleSelect from "./roleSelect/main";
import { handleChangeDatagridCell } from "../../../services/actions/datagrid/editCell";
import { isCreated, isUpdated } from "../../../services/utils/permissions";
import RenderCellCompiler from "../renderCell/renderCellCompiler";
const SelectFieldType = ({
  id,
  field,
  code_list,
  prop_type,
  value,
  DECIMALS,
}) => {
  // const value = useSelector(
  //   (state) => state.datagrid?.rows?.find((e) => e?.id === id)?.[field]
  // );
  const dispatch = useDispatch();

  const handleChange = useCallback((value) => {
    dispatch(handleChangeDatagridCell(id, field, value));
  }, []);

  switch (prop_type) {
    case "CODE":
      return (
        <CodeComponent
          value={value}
          handleChange={handleChange}
          CODE_LIST={code_list}
        />
      );
    case "HISTORY":
    case "DATETIME":
      return (
        <Datetime value={value ? value : null} handleChange={handleChange} />
      );

    case "LONGTEXT":
    case "TEXT":
      return <Text value={value} handleChange={handleChange} />;
    case "BOOL":
      return <Bool value={value} handleChange={handleChange} />;
    case "NUMBER":
    case "DURATION":
      return (
        <Number value={value} handleChange={handleChange} DECIMALS={DECIMALS} />
      );
    case "LSELECT":
      return <LSelect value={value} handleChange={handleChange} />;
    case "LAYERSELECT":
      return <LayerSelect value={value} handleChange={handleChange} />;
    case "ROLESELECT":
      return <RoleSelect value={value} handleChange={handleChange} />;
    case "ITEM":
      return "ITEM";
    default:
      return <>{prop_type}</>;
  }
};
const EditCell = ({
  field,
  id,
  code_list,
  prop_type,
  mandatory,
  value,
  useDatagridValue,
  DECIMALS,
}) => {
  const val = useSelector(
    (state) => state.datagrid.rows?.find((e) => e.id === id)?.[field]
  );
  return (
    <Box
      sx={{
        border:
          mandatory === "True" &&
          ((useDatagridValue ? val : value) === "" ||
            (useDatagridValue ? val : value) === null)
            ? "1px solid red"
            : "",
        width: "100%",
        height: "100%",
      }}
    >
      <SelectFieldType
        DECIMALS={DECIMALS}
        id={id}
        field={field}
        value={useDatagridValue ? val : value}
        code_list={code_list}
        prop_type={prop_type}
      />
    </Box>
  );
};
const TextFields = ({
  field,
  id,
  code_list,
  prop_type,
  mandatory,
  value,
  useDatagridValue,
  type,
  DECIMALS,
}) => {
  const dispatch = useDispatch();
  const createdRows = useSelector((state) => state.datagrid.createdRows);
  if (createdRows.includes(id)) {
    if (dispatch(isCreated(type)))
      return (
        <EditCell
          prop_type={prop_type}
          id={id}
          field={field}
          mandatory={mandatory}
          value={value}
          useDatagridValue={useDatagridValue}
          code_list={code_list}
          DECIMALS={DECIMALS}
        />
      );
    else
      return (
        <RenderCellCompiler
          prop_type={prop_type}
          id={id}
          field={field}
          mandatory={mandatory}
          code_list={code_list}
          value={value}
          useDatagridValue={useDatagridValue}
          DECIMALS={DECIMALS}
        />
      );
  } else {
    if (dispatch(isUpdated(type)))
      return (
        <EditCell
          prop_type={prop_type}
          id={id}
          field={field}
          mandatory={mandatory}
          value={value}
          useDatagridValue={useDatagridValue}
          code_list={code_list}
          DECIMALS={DECIMALS}
        />
      );
    else
      return (
        <RenderCellCompiler
          prop_type={prop_type}
          id={id}
          field={field}
          mandatory={mandatory}
          code_list={code_list}
          value={value}
          useDatagridValue={useDatagridValue}
          DECIMALS={DECIMALS}
        />
      );
  }
};

export default React.memo(TextFields);
