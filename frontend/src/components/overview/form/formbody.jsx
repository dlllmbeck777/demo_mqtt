import React from "react";
import { Grid, Box } from "@mui/material";
import ItemService from "../../../services/api/item";
import { useDispatch, useSelector } from "react-redux";
import TextFields from "../../textfield/textfieldSplitter/textFieldCompiler";
import DownTime from "./downtime";
import DagagridDT from "./datagridDT";
import { saveForm, updateForm } from "../../../services/actions/overview/form";
import { Divider } from "@mui/material";
import CodelistService from "../../../services/api/codeList";
import { useIsMount } from "../../../hooks/useIsMount";
const Formbody = ({ chartProps, width, height, updateUuid }) => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [codelist, setCodelist] = React.useState([]);
  const [page, setPage] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [formValue, setFormValue] = React.useState({});
  async function myAsyncFunc() {
    try {
      let res = await ItemService.getTypePropertyNoToken({
        CULTURE,
        TYPE: chartProps?.TYPE,
      });
      const body = JSON.stringify({ CULTURE, CODE_LIST: "DOWNTIME_CODE" });
      let val = await CodelistService.getItemPropCode(body);
      setCodelist(val?.data);
      setData(res?.data?.[chartProps?.TYPE]);
      handleChange("EVENT_TYPE", chartProps?.TYPE);
      handleChange("CREATE_SOURCE", "x");
      handleChange("UPDATE_SOURCE", "x");
      handleChange("CHAR11", false);
    } catch {
      setData([]);
    }
  }
  React.useEffect(() => {
    myAsyncFunc();
  }, []);

  const handleSave = async () => {
    if (formValue?.update === "") {
      await dispatch(updateForm(formValue));
    } else await dispatch(saveForm(formValue));
    setPage((prev) => !prev);
    newFunc();
  };
  const handleChange = React.useCallback((key, value) => {
    if (key === "CHAR11" && value) {
      handleChange("END_DATETIME", new Date("01.01.9000").getTime());
    }
    setFormValue((prev) => {
      return { ...prev, [key]: value };
    });
  }, []);
  const hadleDefaultValueCheck = (row) => {
    try {
      if (row.PROPERTY_TYPE === "BOOL") {
        return (
          formValue?.[row?.COLUMN_NAME] === "True" ||
          formValue?.[row?.COLUMN_NAME] === true
        );
      } else if (row.PROPERTY_NAME === "DOWNTIME_TYPE") {
        if (formValue?.[row?.COLUMN_NAME]) {
          let returnVal = [];
          function reqursiveFunctiom(val) {
            if (val !== "" && val && val !== undefined) {
              returnVal.push(val);
              reqursiveFunctiom(codelist.find((e) => e.CODE === val)?.PARENT);
            }
          }
          reqursiveFunctiom(formValue?.[row?.COLUMN_NAME]);
          return returnVal.reverse();
        }
      }
      return formValue?.[row?.COLUMN_NAME];
    } catch (err) {}
  };
  const newFunc = () => {
    setFormValue({});
    handleChange("EVENT_TYPE", chartProps?.TYPE);
    handleChange("CREATE_SOURCE", "x");
    handleChange("UPDATE_SOURCE", "x");
    handleChange("CHAR11", false);
  };
  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [chartProps?.CULTURE]);
  return (
    <Box
      sx={{
        width: width,
        height: height,
        overflow:
          chartProps?.Position?.[1] === "T" || chartProps?.Position?.[1] === "B"
            ? "auto"
            : "hidden",
      }}
    >
      {chartProps?.Position?.[1] === "T" ||
      chartProps?.Position?.[1] === "L" ? (
        <>
          <Box
            sx={{
              p: 2,
              pt: 3,
              width: chartProps?.Position?.[1] === "T" ? "100%" : width / 2,
              height: chartProps?.Position?.[1] === "T" ? "auto" : "100%",
              overflow: "auto",
              display: "inline-grid",
              // flex: "0 0 auto",
            }}
          >
            <Grid
              container
              columnSpacing={2}
              rowGap={2}
              sx={{ height: "fit-content" }}
            >
              {data.map((e, i) => {
                if (
                  (formValue?.["CHAR11"] === true ||
                    formValue?.["CHAR11"] === "True") &&
                  e.PROPERTY_NAME === "END_DATETIME"
                ) {
                  return <></>;
                }
                return e.PROPERTY_NAME === "DOWNTIME_TYPE" ? (
                  <DownTime
                    row={e}
                    handleChange={handleChange}
                    parent={null}
                    header={e?.SHORT_LABEL + " [0]"}
                    index={0}
                    defaultValue={hadleDefaultValueCheck(e)}
                  />
                ) : (
                  <Grid
                    item
                    xs={e?.PROPERTY_TYPE === "LONGTEXT" ? 12 : 6}
                    key={i}
                  >
                    <Grid container rowGap={0.5}>
                      <Grid item xs={12}>
                        {e?.SHORT_LABEL}
                      </Grid>
                      <Grid item xs={12}>
                        <TextFields
                          key={e?.ROW_ID + formValue?.ROW_ID}
                          row={e}
                          handleChange={handleChange}
                          value={hadleDefaultValueCheck(e)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          {chartProps?.Position?.[1] === "T" ? (
            <Divider className={"chart-container__form-divider"} />
          ) : (
            <></>
          )}
          <Box
            sx={{
              display: "inline-grid",
              width: chartProps?.Position?.[1] === "T" ? "100%" : width / 2,
              height: chartProps?.Position?.[1] === "T" ? "500px" : "100%",
              p: 2,
              minHeight: "300px",
              button: {
                minWidth: "36px",
                height: "36px",
                borderRadius: "50px",
                span: {
                  margin: 0,
                },
              },
            }}
          >
            <DagagridDT
              page={page}
              chartProps={chartProps}
              setFormValue={setFormValue}
              newFunc={newFunc}
              setPage={setPage}
              saveFunc={handleSave}
            />
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "inline-grid",
              width: chartProps?.Position?.[1] === "B" ? "100%" : width / 2,
              height: "100%",
              p: 2,
              minHeight: "300px",
              button: {
                minWidth: "36px",
                height: "36px",
                borderRadius: "50px",
                span: {
                  margin: 0,
                },
              },
            }}
          >
            <DagagridDT
              page={page}
              chartProps={chartProps}
              setFormValue={setFormValue}
              newFunc={newFunc}
              setPage={setPage}
              saveFunc={handleSave}
            />
          </Box>
          {chartProps?.Position?.[1] === "B" ? (
            <Divider className={"chart-container__form-divider"} />
          ) : (
            <></>
          )}
          <Box
            sx={{
              p: 2,
              pt: 3,
              width: chartProps?.Position?.[1] === "B" ? "100%" : width / 2,
              height: chartProps?.Position?.[1] === "B" ? "auto" : "100%",
              overflow: "auto",
              display: "inline-grid",
              // flex: "0 0 auto",
            }}
          >
            <Grid
              container
              columnSpacing={2}
              rowGap={2}
              sx={{ height: "fit-content" }}
            >
              {data.map((e, i) => {
                if (
                  (formValue?.["CHAR11"] === true ||
                    formValue?.["CHAR11"] === "True") &&
                  e.PROPERTY_NAME === "END_DATETIME"
                ) {
                  return <></>;
                }
                return e.PROPERTY_NAME === "DOWNTIME_TYPE" ? (
                  <DownTime
                    row={e}
                    handleChange={handleChange}
                    parent={null}
                    header={e?.SHORT_LABEL + " [0]"}
                    index={0}
                    defaultValue={hadleDefaultValueCheck(e)}
                  />
                ) : (
                  <Grid
                    item
                    xs={e?.PROPERTY_TYPE === "LONGTEXT" ? 12 : 6}
                    key={i}
                  >
                    <Grid container rowGap={0.5}>
                      <Grid item xs={12}>
                        {e?.SHORT_LABEL}
                      </Grid>
                      <Grid item xs={12}>
                        <TextFields
                          key={e?.ROW_ID + formValue?.ROW_ID}
                          row={e}
                          handleChange={handleChange}
                          value={hadleDefaultValueCheck(e)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default React.memo(Formbody);
