import { unicodeToRgb } from "../../../services/utils/unicodeToRgb";

export const updateAxisTitle = (chartRef, titleFontSize) => {
    chartRef.current.chart.yAxis.map((e) => {
        e.update({
            title: {
                style: {
                    fontSize:
                        titleFontSize === ""
                            ? "11px"
                            : `${titleFontSize}px`,
                },
            },
        });
    });
}
export const updateAxisValue = (chartRef, valueFontSize) => {
    chartRef.current.chart.yAxis.map((e) => {
        e.update({
            labels: {
                style: {
                    fontSize:
                        valueFontSize === ""
                            ? 11
                            : valueFontSize,
                },
            },
        });
    });
}
export const updateAxisAlignTick = (chartRef, alignTicks) => {
    chartRef.current.chart.yAxis.map((e) => {
        e.update({
            alignTicks: alignTicks,
        });
    });
}
export const updateAxisStartTick = (chartRef, startOnTick) => {
    chartRef.current.chart.yAxis.map((e) => {
        e.update({
            startOnTick: startOnTick
        });
    });
}
export const updateAxisEndTick = (chartRef, endOnTick) => {
    chartRef.current.chart.yAxis.map((e) => {
        e.update({
            endOnTick: endOnTick,
        });
    });
}
export const helperUpdateSettings = (e, highchartProps) => {
    e.update({
        plotBands: highchartProps?.["Show Boundaries"]
            ? [
                {
                    color: `rgba(${unicodeToRgb(
                        highchartProps?.[
                        `[0] [${highchartProps.Inputs?.[0]?.NAME}] Color`
                        ]
                    )},${highchartProps?.[
                    `[0] [${highchartProps.Inputs?.[0]?.NAME}] Opacity`
                    ]
                        })`,
                    from: !highchartProps?.[
                        "Show Enable Manual Y-Axis Min/Max"
                    ]
                        ? parseFloat(highchartProps.Inputs?.[0]?.LIMIT_LOLO)
                        : parseFloat(
                            highchartProps?.[
                            `[0] [${highchartProps.Inputs?.[0]?.NAME}] Low`
                            ]
                        ),
                    to: !highchartProps?.[
                        "Show Enable Manual Y-Axis Min/Max"
                    ]
                        ? parseFloat(
                            highchartProps.Inputs?.[0]?.NORMAL_MINIMUM
                        )
                        : parseFloat(
                            highchartProps?.[
                            `[0] [${highchartProps.Inputs?.[0]?.NAME}] High`
                            ]
                        ),
                },
                {
                    color: `rgba(${unicodeToRgb(
                        highchartProps?.[
                        `[1] [${highchartProps.Inputs?.[0]?.NAME}] Color`
                        ]
                    )},${highchartProps?.[
                    `[1] [${highchartProps.Inputs?.[0]?.NAME}] Opacity`
                    ]
                        })`,
                    from: !highchartProps?.[
                        "Show Enable Manual Y-Axis Min/Max"
                    ]
                        ? parseFloat(
                            highchartProps.Inputs?.[0]?.NORMAL_MINIMUM
                        )
                        : parseFloat(
                            highchartProps?.[
                            `[1] [${highchartProps.Inputs?.[0]?.NAME}] Low`
                            ]
                        ),
                    to: !highchartProps?.[
                        "Show Enable Manual Y-Axis Min/Max"
                    ]
                        ? parseFloat(
                            highchartProps.Inputs?.[0]?.NORMAL_MAXIMUM
                        )
                        : parseFloat(
                            highchartProps?.[
                            `[1] [${highchartProps.Inputs?.[0]?.NAME}] High`
                            ]
                        ),
                },
                {
                    color: `rgba(${unicodeToRgb(
                        highchartProps?.[
                        `[2] [${highchartProps.Inputs?.[0]?.NAME}] Color`
                        ]
                    )},${highchartProps?.[
                    `[2] [${highchartProps.Inputs?.[0]?.NAME}] Opacity`
                    ]
                        })`,
                    from: !highchartProps?.[
                        "Show Enable Manual Y-Axis Min/Max"
                    ]
                        ? parseFloat(
                            highchartProps.Inputs?.[0]?.NORMAL_MAXIMUM
                        )
                        : parseFloat(
                            highchartProps?.[
                            `[2] [${highchartProps.Inputs?.[0]?.NAME}] Low`
                            ]
                        ),
                    to: !highchartProps?.[
                        "Show Enable Manual Y-Axis Min/Max"
                    ]
                        ? parseFloat(highchartProps.Inputs?.[0]?.LIMIT_HIHI)
                        : parseFloat(
                            highchartProps?.[
                            `[2] [${highchartProps.Inputs?.[0]?.NAME}] High`
                            ]
                        ),
                },
            ]
            : [],
    });
}

export const updateSettings = (chartRef, highchartProps) => {
    let checkAll = false
    let plot = false
    Promise.all(
        chartRef.current.chart.yAxis.map((e) => {
            if (e.options.id === "yaxis-" + 0)
                plot = e
            if (e.plotLinesAndBands.length > 0) {
                checkAll = true
                helperUpdateSettings(e, highchartProps)
            }

        })
    )
    if (!checkAll && plot) {
        helperUpdateSettings(plot, highchartProps)
    }
}

export const updatePlotOption = (chartRef, value) => {
    let val = []
    Promise.all(
        value?.map(e => {
            if (e) {
                val.push(e)
            }
        })
    )
    Promise.all(
        chartRef.current.chart.yAxis.map((e) => {
            e.update({
                plotLines: [
                    ...val
                ],
            })
        })
    )

    Promise.all(
        val?.map(e => {
            chartRef.current.chart.addSeries({
                color: e.color,
                name: e.name,
                dashStyle: 'shortdash',
                marker: {
                    enabled: false
                },
                events: {
                    legendItemClick: function (a) {
                        if (this.visible) {
                            this.chart.yAxis[0].removePlotLine(e.id);
                        }
                        else {
                            this.chart.yAxis[0].addPlotLine(e);
                        }
                    }
                }
            })
        })
    )

}