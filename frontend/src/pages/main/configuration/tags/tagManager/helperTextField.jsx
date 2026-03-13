import React from "react";
import { useSelector } from "react-redux";
import TextFieldCompiler from "../../../../../components/textfield/textfieldSplitter/textFieldCompiler";
import {
  TransactionTypeSelect,
  TransactionPropertySelect,
} from "./itemSelect.jsx";
import UomSelect from "./uomSelect.jsx";
const HelperTextField = ({ row, handleChange }) => {
  const value = useSelector(
    (state) => state.tags.saveValues?.[row?.COLUMN_NAME]
  );
  if (row?.PROPERTY_TYPE === "ITEM") {
    if (row?.PROPERTY_NAME === "TRANSACTION_TYPE") {
      return <TransactionTypeSelect />;
    } else if (row?.PROPERTY_NAME === "TRANSACTION_PROPERTY") {
      return <TransactionPropertySelect />;
    }
  }
  if (row?.PROPERTY_TYPE === "UOM") {
    return <UomSelect />;
  }
  return (
    <TextFieldCompiler row={row} handleChange={handleChange} value={value} />
  );
};

export default HelperTextField;
