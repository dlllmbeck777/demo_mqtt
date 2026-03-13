import React from "react";
import { Grid, Button } from "@mui/material";
import LoaderSelect from "./loaderSelect";
import { Select } from "../../../../components";
import { useDispatch, useSelector } from "react-redux";
import CodelistService from "../../../../services/api/codeList";
import {
  changeValues,
  cleanLoader,
  readExel,
} from "../../../../services/actions/loader/loader";
const ActionMenu = () => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const values = useSelector((state) => state.loaderPage.values);
  const [seperatorValues, setSeperatorValues] = React.useState([]);
  const [fileName, setFileName] = React.useState("Choise File");
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    const fileName = selectedFile.name;
    handleChange("FILE", event.target.files[0]);
    const fileExtension = selectedFile.name.split(".").pop();
    setFileName(fileName);
    handleChange("EXTENSION", fileExtension);
  }

  function handleChange(key, val) {
    dispatch(changeValues(key, val));
  }

  React.useEffect(() => {
    async function myAsyncFunc() {
      let val = await CodelistService.getByParentHierarchy({
        CULTURE,
        LIST_TYPE: "CSV_SEPERATOR",
      });
      setSeperatorValues(val.data);
    }
    myAsyncFunc();
    return () => {
      dispatch(cleanLoader());
    };
  }, []);
  return (
    <Grid container columnGap={1} sx={{ p: 1 }}>
      <LoaderSelect
        list_type="LOADER"
        parent={null}
        handleChangeFunc={handleChange}
      />
      <form action="submit">
        <label htmlFor="file-input">
          <input
            id="file-input"
            type="file"
            accept=".xlsx, .xls, .csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button component="span">{fileName}</Button>
        </label>
      </form>
      {values?.EXTENSION === "csv" && (
        <Grid item xs={2}>
          <Select
            values={seperatorValues}
            defaultValue={values?.SEPERATOR}
            valuesPath="CODE_TEXT"
            dataTextPath="CODE_TEXT"
            handleChangeFunc={(val) => {
              handleChange("SEPERATOR", val);
            }}
          />
        </Grid>
      )}
      <Button
        onClick={() => {
          dispatch(readExel());
        }}
      >
        Read Csv
      </Button>
    </Grid>
  );
};

export default ActionMenu;
