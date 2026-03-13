import React from "react";
import $ from "jquery";
import Box from "@mui/material/Box";
import DataGrid from "../../datagrid/dataGrid";
import "../../../assets/styles/components/overview/matrixWidget.scss";
import DataGridCell from "./dataGridCell";
import LinearProgress from "@mui/material/LinearProgress";
import { uuidv4 } from "../../../services/utils/uuidGenerator";
import { GridFooterContainer } from "@mui/x-data-grid-pro";
const Matrix = ({ highchartProps }) => {
  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [widgetId, setWidgetId] = React.useState(uuidv4());
  const [sortModel, setSortModel] = React.useState([
    { field: "tag", sort: "asc" },
  ]);
  React.useEffect(() => {
    setSortModel([{ field: "tag", sort: "asc" }]);
  }, [columns]);
  const valueFormatter = (data) => {
    return `${parseFloat(
      parseFloat(data).toFixed(
        highchartProps?.["Decimal Places"] === ""
          ? 0
          : highchartProps?.["Decimal Places"]
      )
    )} `;
  };
  const handlePropChange = () => {
    $(`.matrix-widget-container__val__${widgetId}`).css({
      "font-size":
        highchartProps?.["Value Font Size"] !== ""
          ? highchartProps?.["Value Font Size"] + "px"
          : "12px",
      display: highchartProps?.["Show Measurement"] ? "inline-block" : "none",
    });

    $(`.matrix-widget-container__uom__${widgetId}`).css({
      "font-size":
        highchartProps?.["UoM Font Size"] !== ""
          ? highchartProps?.["UoM Font Size"] + "px"
          : "12px",
      display: highchartProps?.["Show Unit of Measurement"]
        ? "inline-block"
        : "none",
    });
  };
  React.useEffect(() => {
    let column = [
      {
        field: "tag",
        headerName: " ",
        flex: 2,
        renderCell: (params) => (
          <span
            style={{
              fontSize:
                highchartProps?.["Tag Name Font Size"] !== ""
                  ? highchartProps?.["Tag Name Font Size"] + "px"
                  : "12px",
            }}
          >
            {params.value}
          </span>
        ),
      },
    ];
    if (highchartProps?.Assets)
      Promise.all(
        highchartProps?.Assets?.map((e) => {
          column.push({
            field: e[0],
            headerName: e[1],
            flex: 1,
            headerClassName: `matrix-widget-container__datagrid__header__${widgetId}`,
            renderCell: (params) => {
              return (
                <DataGridCell
                  {...params}
                  handlePropChange={handlePropChange}
                  refreshSec={highchartProps["Widget Refresh (seconds)"]}
                  color={highchartProps}
                  valueFormatter={valueFormatter}
                  widgetId={widgetId}
                />
              );
            },
          });
        })
      );

    setColumns(column);

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
    let row = [];
    Promise.all(
      Object.keys(shortnames).map((e, i) => {
        let temp = highchartProps?.Inputs?.filter(
          (a) => a.SHORT_NAME.replace(`${a?.TRANSACTION_PROPERTY}`, "") === e
        );
        let rowItem = {};
        if (
          temp[0]?.OPERATIONS_TYPE &&
          !temp[0]?.OPERATIONS_TYPE === "velocity"
        ) {
          rowItem = {
            id: i,
            tag: temp[0].SHORT_NAME.replace(
              `${temp[0]?.TRANSACTION_PROPERTY}`,
              ""
            ),
            calcTag: temp[0].SHORT_NAME.replace(
              `${temp[0]?.TRANSACTION_PROPERTY}`,
              ""
            ),
          };
        } else {
          rowItem = {
            id: i,
            tag: temp[0].SHORT_NAME.replace(
              `${temp[0]?.TRANSACTION_PROPERTY}`,
              ""
            ),
          };
        }
        temp.map((e) => {
          rowItem = {
            ...rowItem,
            [e.ITEM_ID]: e.TAG_ID,
            [e.ITEM_ID + "UOM"]: e?.CATALOG_SYMBOL ? e.CATALOG_SYMBOL : "",
            [e.ITEM_ID + "NAME"]: e.NAME,
          };
        });
        row.push(rowItem);
      })
    );
    setRows(row);
  }, [highchartProps?.Inputs]);
  React.useEffect(() => {
    if (highchartProps?.Inputs)
      highchartProps?.Inputs.map((e) => {
        $(`.matrix-widget-container__${e.TAG_ID}__val__${widgetId}`).html(
          valueFormatter(
            parseFloat(
              $(
                `.matrix-widget-container__${e.TAG_ID}__val__${widgetId}`
              ).html()
            )
          )
        );
      });
  }, [highchartProps?.["Decimal Places"]]);
  React.useEffect(() => {
    handlePropChange();
  }, [highchartProps]);
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
  return (
    <Box
      className={`matrix-widget-container`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        [`& .matrix-widget-container__datagrid__header__${widgetId}`]: {
          fontSize: highchartProps?.["Asset Font Size"]
            ? highchartProps?.["Asset Font Size"] + "px"
            : "14px",
        },
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        showCellRightBorder={true}
        components={{ Footer: CustomFooter, LoadingOverlay: LinearProgress }}
        sortModel={sortModel}
        // loading={loading}
        onSortModelChange={(model) => {
          setSortModel(model);
        }}
        // orientation="horizontal"
        // autoHeight
      />
    </Box>
  );
};

export default Matrix;
