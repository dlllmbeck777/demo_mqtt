import React from "react";
import { Grid, Box } from "@mui/material";
import ItemService from "../../../../services/api/item";
import { useDispatch, useSelector } from "react-redux";
import {
  saveFormRead,
  updateForm,
} from "../../../../services/actions/overview/form";
import { Divider } from "@mui/material";
import DatagridPump from "./dataGridPump";
import FormItem from "./formItem";
import { useIsMount } from "../../../../hooks/useIsMount";
const Formbody = ({ chartProps, width, height, updateUuid }) => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const itemId = useSelector(
    (state) => state.collapseMenu?.selectedItem?.FROM_ITEM_ID
  );
  const [page, setPage] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [formValue, setFormValue] = React.useState({});
  async function myAsyncFunc() {
    try {
      let res = await ItemService.getTypePropertyNoToken({
        CULTURE,
        TYPE: chartProps?.TYPE,
      });
      console.log(res);
      let currentStatus = await ItemService.hierarchStatusGet({
        ITEM_ID: itemId,
        EVENT_TYPE: chartProps?.TYPE,
      });
      handleChange("OLD", {
        ROW_ID: currentStatus?.data?.ROW_ID,
        END_DATETIME: new Date().getTime(),
      });
      setData(res?.data?.[chartProps?.TYPE]);
      handleChange("EVENT_TYPE", chartProps?.TYPE);
      handleChange("CREATE_SOURCE", "x");
      handleChange("UPDATE_SOURCE", "x");
    } catch {
      setData([]);
    }
  }
  React.useEffect(() => {
    myAsyncFunc();
  }, []);
  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [chartProps?.CULTURE]);
  const handleChange = React.useCallback(async (key, value) => {
    setFormValue((prev) => {
      return { ...prev, [key]: value };
    });
  }, []);
  const handleSave = async () => {
    if (formValue?.update === "") {
      await dispatch(updateForm(formValue));
    } else await dispatch(saveFormRead(formValue));
    setPage((prev) => !prev);
    newFunc();
    dispatch({
      type: "TOGGLE_STATUS",
    });
  };
  const newFunc = React.useCallback(async () => {
    setFormValue({});
    try {
      let currentStatus = await ItemService.hierarchStatusGet({
        ITEM_ID: itemId,
        EVENT_TYPE: chartProps?.TYPE,
      });
      handleChange("OLD", {
        ROW_ID: currentStatus?.data?.ROW_ID,
        END_DATETIME: new Date().getTime(),
      });
    } catch (err) {
      console.log(err);
    }
    handleChange("EVENT_TYPE", chartProps?.TYPE);
    handleChange("CREATE_SOURCE", "x");
    handleChange("UPDATE_SOURCE", "x");
  }, []);
  console.log(chartProps);
  console.log(chartProps?.Position?.[1]);
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
              display: "inline-grid",
              overflow: "auto",
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
                return (
                  <FormItem
                    key={i}
                    row={e}
                    handleChange={handleChange}
                    value={formValue?.[e.COLUMN_NAME]}
                  />
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
            <DatagridPump
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
            <DatagridPump
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
                return (
                  <FormItem
                    key={i}
                    row={e}
                    handleChange={handleChange}
                    value={formValue?.[e.COLUMN_NAME]}
                  />
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
