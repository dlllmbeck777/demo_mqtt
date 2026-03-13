export const updateSeries = (chartRef, highchartProps) => {
    chartRef.current.chart.series.map((e, i) => {
        e.update({
            color: highchartProps["Show Enable Custom Color"]
                ? highchartProps[`[${e.userOptions.id}] Color`]
                : "",
        });
    });
}