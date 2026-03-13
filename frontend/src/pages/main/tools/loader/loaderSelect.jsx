import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { Select } from "../../../../components";
import CodelistService from "../../../../services/api/codeList";
const LoaderSelect = ({ list_type, parent, handleChangeFunc = () => {} }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [values, setvalues] = React.useState([]);
  const [value, setvalue] = React.useState(null);
  const handleChange = (value) => {
    setvalue(value);
    handleChangeFunc("TYPE", value);
  };
  async function asyncFunction() {
    try {
      let val = await CodelistService.getByParentHierarchy({
        CULTURE,
        LIST_TYPE: list_type,
        PARENT: parent,
      });
      setvalues(val.data);
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    asyncFunction();
  }, [parent, CULTURE]);
  return (
    <>
      {values?.length > 0 && (
        <Grid item xs={2}>
          <Select
            values={values}
            defaultValue={value}
            valuesPath="CODE"
            dataTextPath="CODE_TEXT"
            handleChangeFunc={handleChange}
          />
        </Grid>
      )}

      {value && (
        <LoaderSelect
          list_type={list_type}
          handleChangeFunc={handleChangeFunc}
          parent={value}
        />
      )}
    </>
  );
};

export default LoaderSelect;
