import React from "react";
import $ from "jquery";
import Box from "@mui/material/Box";
import DataGrid from "../../datagrid/dataGrid";
import "../../../assets/styles/components/overview/matrixWidget.scss";
import LinearProgress from "@mui/material/LinearProgress";
import { uuidv4 } from "../../../services/utils/uuidGenerator";
import { GridFooterContainer } from "@mui/x-data-grid-pro";
import VerticalRenderCell from "./verticalRenderCell";
const Matrix = ({ highchartProps }) => {
  const [widgetId, setWidgetId] = React.useState(uuidv4());
  const [columns, setColumns] = React.useState([
    {
      field: "assets",
      headerName: "Assets",
      flex: 1,
      headerClassName: `matrix-widget-container__datagrid__header__${widgetId}`,
      renderCell: (params) => (
        <span
          style={{
            fontSize:
              highchartProps?.["Asset Font Size"] !== ""
                ? highchartProps?.["Asset Font Size"] + "px"
                : "12px",
          }}
        >
          {params.value}
        </span>
      ),
    },
  ]);
  const [rows, setRows] = React.useState([]);
  const CustomFooter = () => {
    return (
      <GridFooterContainer>
        <Box
          sx={{ textAlign: "right", pr: 2, width: "100%", fontSize: "1rem" }}
        >
          Parameters : {rows.length}
        </Box>
      </GridFooterContainer>
    );
  };

  React.useEffect(() => {
    let shortnames = {};
    if (highchartProps?.Inputs)
      Promise.all(
        highchartProps?.Inputs?.map((e, i) => {
          if (e.SHORT_NAME === null || e.SHORT_NAME === "") {
            shortnames[e.NAME] = false;
            highchartProps.Inputs[i].SHORT_NAME = e.NAME;
          } else {
            shortnames[
              e.SHORT_NAME.replace(`${e?.TRANSACTION_PROPERTY}`, "")
            ] = false;
          }
        })
      );

    Promise.all(
      Object.keys(shortnames).map((e, i) => {
        let temp = highchartProps?.Inputs?.filter(
          (a) => a.SHORT_NAME.replace(`${a?.TRANSACTION_PROPERTY}`, "") === e
        );
        setColumns((prev) => [
          ...prev,
          {
            field: temp[0].SHORT_NAME.replace(
              `${temp[0]?.TRANSACTION_PROPERTY}`,
              ""
            ),
            headerName: temp[0].SHORT_NAME.replace(
              `${temp[0]?.TRANSACTION_PROPERTY}`,
              ""
            ),
            flex: 1,
            headerClassName: `matrix-widget-container__datagrid__header__${widgetId}`,
            renderCell: (params) => {
              return (
                <VerticalRenderCell
                  tag={
                    highchartProps.Inputs.filter((e) => {
                      return e.SHORT_NAME === params.row.assets + params.field;
                    })[0]
                  }
                  highchartProps={highchartProps}
                />
              );
            },
          },
        ]);
      })
    );
    if (highchartProps?.Assets)
      highchartProps.Assets.map((a, i) => {
        let tagName = {};
        Promise.all(
          highchartProps.Inputs.map((e) => {
            if (e.TRANSACTION_PROPERTY === a[1]) {
              tagName = {
                ...tagName,
                [e.SHORT_NAME.replace(`${e?.TRANSACTION_PROPERTY}`, "")]: "",
              };
            }
          })
        );
        setRows((prev) => [...prev, { assets: a[1], id: i, ...tagName }]);
      });
    return () => {
      setColumns([
        {
          field: "assets",
          headerName: "Assets",
          flex: 1,
          headerClassName: `matrix-widget-container__datagrid__header__${widgetId}`,
          renderCell: (params) => (
            <span
              style={{
                fontSize:
                  highchartProps?.["Asset Font Size"] !== ""
                    ? highchartProps?.["Asset Font Size"] + "px"
                    : "12px",
              }}
            >
              {params.value}
            </span>
          ),
        },
      ]);
      setRows([]);
    };
  }, [highchartProps]);
  return (
    <Box
      className={`matrix-widget-container`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        [`& .matrix-widget-container__datagrid__header__${widgetId}`]: {
          fontSize: highchartProps?.["Tag Name Font Size"]
            ? highchartProps?.["Tag Name Font Size"] + "px"
            : "14px",
        },
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        showCellRightBorder={true}
        components={{ Footer: CustomFooter, LoadingOverlay: LinearProgress }}
      />
    </Box>
  );
};

export default Matrix;
