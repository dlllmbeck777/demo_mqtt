import React from "react";

import { Select } from "../..";
import { useSelector } from "react-redux";
import CodelistService from "../../../services/api/codeList";
const CodeComponent = ({ value, handleChange, CODE_LIST, disabled }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [values, setvalues] = React.useState([]);
  const handleChangeFunc = (value) => {
    handleChange(value);
  };
  async function asyncFunction() {
    let val = await CodelistService.getItemPropCode({
      CULTURE,
      CODE_LIST,
    });
    setvalues(val.data);
  }
  React.useEffect(() => {
    asyncFunction();
  }, []);
  return (
    <Select
      values={values}
      value={value}
      valuesPath="CODE"
      dataTextPath="CODE_TEXT"
      handleChangeFunc={handleChangeFunc}
      disabled={disabled}
    />
  );
};

export default React.memo(CodeComponent);
