import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import exporting from "highcharts/modules/exporting";
import data from "highcharts/modules/data";
import accessibility from "highcharts/modules/accessibility";
import ItemService from "../../../../services/api/item";
import { useIsMount } from "../../../../hooks/useIsMount";
import { useSelector } from "react-redux";
exporting(Highcharts);
data(Highcharts);
accessibility(Highcharts);
const Bar = ({ chartProps, width, height, updateUuid }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const isMount = useIsMount();
  const chartRef = React.createRef();
  async function loadData() {
    try {
      let res = await ItemService.chartStatusGet({
        CULTURE,
        ITEM_ID: chartProps?.["Transaction Property"],
        EVENT_TYPE: chartProps?.Transaction,
      });
      console.log(res);
      let seriesData = [];
      const data = res.data;
      Promise.all(
        chartProps?.["Process Defination"].map((transaction) => {
          seriesData.push({
            name: transaction?.SHORT_LABEL,
            y: parseFloat(data?.[transaction?.COLUMN_NAME]),
            drilldown: transaction?.SHORT_LABEL,
          });
        })
      );
      if (chartRef.current) {
        chartRef.current.chart.addSeries({
          name: "Transaction",
          colorByPoint: true,
          data: seriesData,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    loadData();
  }, []);
  React.useEffect(() => {
    if (!isMount) {
      updateUuid();
    }
  }, [chartProps?.["Input Flag"]]);
  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      title: false,
    },
    legend: {
      enabled: false,
      layout: "horizontal",
    },
    // legend: {
    //   enabled: chartProps["Show Enable Graph Legend"],
    //   layout: "horizontal",
    //   itemStyle: {
    //     fontSize: chartProps["Graph Legend Font Size (em)"]
    //       ? `${chartProps["Graph Legend Font Size (em)"]}px`
    //       : "12px",
    //   },
    // },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: chartProps["Show Enable Export"],
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: `<b>{point.name}</b>: {point.percentage:.${chartProps["Decimal Places"]}f}`,
          style: {
            textOutline: "1px contrast !important",
          },
        },
      },
    },
  };
  return (
    <HighchartsReact
      ref={chartRef}
      highcharts={Highcharts}
      options={{
        ...options,
        chart: {
          ...options.chart,
          width: width,
          height: height,
        },
      }}
    />
  );
};
export default React.memo(Bar);
