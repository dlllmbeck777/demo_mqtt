import React from "react";
import DataGrid from "../../datagrid/dataGrid";
import CustomToolbar from "../../datagrid/customToolbar";
import { CustomNoRowsOverlay } from "../../datagrid/customNoRowOwerlay";

import LinearProgress from "@mui/material/LinearProgress";
import { InfluxDB } from "@influxdata/influxdb-client";
import {
  backfillBucket,
  influxToken,
  influxOrg,
  influxUrl,
} from "../../../services/baseApi";
import { useIsMount } from "../../../hooks/useIsMount";
import { uuidv4 } from "../../../services/utils/uuidGenerator";
import resourceList from "../../../services/api/resourceList";
import { useSelector } from "react-redux";
const Tabular = ({ highchartProps }) => {
  const isMount = useIsMount();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [allData, setAllData] = React.useState([]);
  const [loading, setLoading] = React.useState(0);
  const [header, setHeaderText] = React.useState([]);
  const [timeDifference, setTimeDifference] = React.useState();
  const lastTime = Math.floor(new Date().getTime() / 1000) - 10;
  const [sortModel, setSortModel] = React.useState([
    {
      field: "_time",
      sort: "desc",
    },
  ]);
  const MyLinearProgress = () => {
    return (
      <div>
        <LinearProgress variant="determinate" value={loading} />
        {loading}%
      </div>
    );
  };
  async function asyncFetchFunction(time) {
    let res = [];
    let query = `from(bucket: "${backfillBucket}")
      |> range(start: -${(time + 1) * 15}d,stop: -${time * 15}d)
      |> filter(fn: (r) => r["_field"] == "tag_value")
      |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
      |> filter(fn: (r) => 
    `;
    Promise.all(
      highchartProps.Inputs.map((tag, i) => {
        if (i !== 0) query = query + " or ";
        query = query + `r["_measurement"] == "${tag.NAME}"`;
      })
    );
    query = query + ")";
    const queryApi = await new InfluxDB({
      url: influxUrl,
      token: influxToken,
    }).getQueryApi(influxOrg);
    await queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        res.push({ ...o, id: uuidv4() });
      },
      complete() {
        setAllData((prev) => {
          return [...prev, ...res];
        });

        setLoading((prev) => prev + 100 / (timeDifference * 2));
      },
      error(error) {
        console.log("query failed- ", error);
        setLoading((prev) => prev + +100 / (timeDifference * 2));
      },
    });
  }

  React.useEffect(() => {
    if (!isMount) {
      [...Array(timeDifference * 2)].map((e, i) => {
        asyncFetchFunction(i);
      });
    }
  }, [timeDifference]);
  function difference(tarih1, tarih2) {
    const date1 = new Date(tarih1);
    const date2 = new Date(tarih2);

    const yil1 = date1.getFullYear();
    const ay1 = date1.getMonth();
    const yil2 = date2.getFullYear();
    const ay2 = date2.getMonth();

    const farkYil = yil2 - yil1;
    const farkAy = ay2 - ay1;

    return farkYil * 12 + farkAy;
  }
  async function myFunc() {
    let res = [];
    let query = `from(bucket: "${backfillBucket}")
      |> range(start: 0,stop: ${lastTime - 1})
      |> filter(fn: (r) => r["_field"] == "tag_value")
      |> first()
      |> filter(fn: (r) => 
    `;
    if (highchartProps?.Inputs)
      Promise.all(
        highchartProps.Inputs.map((tag, i) => {
          if (i !== 0) query = query + " or ";
          query = query + `r["_measurement"] == "${tag.NAME}"`;
        })
      );
    query = query + ")";
    const queryApi = await new InfluxDB({
      url: influxUrl,
      token: influxToken,
    }).getQueryApi(influxOrg);
    await queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        res.push(o);
      },
      complete() {
        setTimeDifference(
          difference(Date.parse(res?.[0]?._time), lastTime * 1000)
        );
      },
      error(error) {
        console.log("query failed- ", error);
      },
    });
  }

  React.useEffect(() => {
    myFunc();
    return () => {
      setAllData([]);
    };
  }, []);
  async function asyncGetHeaderText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "DATAGRID_TABULAR",
      });
      console.log(res);
      setHeaderText(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetHeaderText();
  }, [CULTURE]);
  return (
    <DataGrid
      columns={[
        {
          field: "_measurement",
          headerName: header?.filter(
            (e) => e.ID === "DATAGRID_TABULAR_SHORT_NAME"
          )?.[0]?.SHORT_LABEL,
          valueGetter: (params) => {
            return highchartProps?.Inputs?.find((e) => e.NAME === params.value)
              ?.SHORT_NAME;
          },
        },
        {
          field: "_time",
          headerName: header?.filter(
            (e) => e.ID === "DATAGRID_TABULAR_TIME_STAMP"
          )?.[0]?.SHORT_LABEL,
          type: "dateTime",
        },
        {
          field: "_value",
          headerName: header?.filter(
            (e) => e.ID === "DATAGRID_TABULAR_VALUE"
          )?.[0]?.SHORT_LABEL,
        },
      ]}
      rows={loading === 100 ? allData : []}
      loading={loading !== 100}
      components={{
        Toolbar: CustomToolbar,
        NoRowsOverlay: CustomNoRowsOverlay,
        LoadingOverlay: MyLinearProgress,
      }}
      sortModel={sortModel}
      onSortModelChange={(model) => setSortModel(model)}
    />
  );
};

export default Tabular;
