import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { Select } from "../..";
import CodelistService from "../../../services/api/codeList";
import { useIsMount } from "../../../hooks/useIsMount";
const Downtime = ({
  row,
  handleChange,
  parent,
  header,
  index,
  defaultValue,
}) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [values, setvalues] = React.useState([]);

  const handleChangeFunc = (value) => {
    handleChange("CHAR1", value);
  };
  async function asyncFunction() {
    try {
      let val = await CodelistService.getByParentHierarchy({
        CULTURE,
        LIST_TYPE: row?.CODE_LIST,
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
        <Grid item xs={6} key={defaultValue?.[index]}>
          <Grid container rowGap={0.5}>
            <Grid item xs={12}>
              {header}
            </Grid>
            <Grid item xs={12}>
              <Select
                values={values}
                value={defaultValue?.[index]}
                valuesPath="CODE"
                dataTextPath="CODE_TEXT"
                handleChangeFunc={handleChangeFunc}
              />
            </Grid>
          </Grid>
        </Grid>
      )}

      {defaultValue?.[index] && (
        <Downtime
          row={row}
          handleChange={handleChange}
          parent={defaultValue?.[index]}
          header={row?.SHORT_LABEL + ` [${index + 1}]`}
          index={index + 1}
          defaultValue={defaultValue}
        />
      )}
    </>
  );
};

export default Downtime;
