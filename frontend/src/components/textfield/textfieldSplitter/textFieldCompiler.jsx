import React from "react";

import DatetimeComponent from "./datetimeComponent";
import CodeComponent from "./codeComponent";
import BoolComponent from "./boolComponent";
import DateComponent from "./dateComponent";
import TextComponent from "./textComponent";
import NumberComponent from "./numberComponent";
import LongtextComponent from "./longtextComponent";
import BlobComponent from "./blobComponent";
import DurationComponent from "./durationComponent";
const TextFields = ({ row, handleChange = () => {}, value = "" }) => {
  const handleGroupNameChange = (value) => {
    handleChange(`${row?.COLUMN_NAME}_NAME`, value);
  };

  const handleChangeFunc = (value) => {
    handleChange(row?.COLUMN_NAME, value);
  };
  console.log(row?.READ_ONLY);
  switch (row?.PROPERTY_TYPE) {
    case "CODE":
      return (
        <CodeComponent
          value={value}
          handleChange={handleChangeFunc}
          CODE_LIST={row?.CODE_LIST}
          disabled={row?.READ_ONLY}
        />
      );
    case "DATE":
      return (
        <DateComponent
          value={value ? value : null}
          handleChange={handleChangeFunc}
          disabled={row?.READ_ONLY}
        />
      );
    case "DATETIME":
      return (
        <DatetimeComponent
          value={value ? value : null}
          handleChange={handleChangeFunc}
          disabled={row?.READ_ONLY}
        />
      );
    case "TEXT":
      return (
        <TextComponent
          value={value}
          handleChange={handleChangeFunc}
          disabled={row?.READ_ONLY}
        />
      );
    case "LONGTEXT":
      return (
        <LongtextComponent
          value={value}
          handleChange={handleChangeFunc}
          disabled={row?.READ_ONLY}
        />
      );
    case "BOOL":
      return (
        <BoolComponent
          value={value}
          handleChange={handleChangeFunc}
          disabled={row?.READ_ONLY}
        />
      );
    case "NUMBER":
    case "DURATION":
      return (
        <DurationComponent
          value={value === null ? "" : value}
          handleChange={handleChangeFunc}
          disabled={row?.READ_ONLY}
          UOM={row?.UOM}
          DECIMALS={row.DECIMALS}
        />
      );
    // return (
    //   <NumberComponent
    //     value={value === null ? "" : value}
    //     handleChange={handleChangeFunc}
    //     disabled={row?.READ_ONLY}
    //   />
    // );
    case "ITEM":
      return "ITEM";
    case "BLOB":
      return (
        <BlobComponent
          value={value === null ? "" : value}
          handleChange={handleChangeFunc}
          handleGroupNameChange={handleGroupNameChange}
          disabled={row?.READ_ONLY}
        />
      );
    default:
      return <>{row?.PROPERTY_TYPE}</>;
  }
};

export default React.memo(TextFields);
