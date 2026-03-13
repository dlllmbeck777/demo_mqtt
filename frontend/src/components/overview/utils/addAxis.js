import { unicodeToRgb } from "../../../services/utils/unicodeToRgb"

export const addAxis = (series, highchartProps, tag, index) => {
    series.addAxis(
        {
            plotBands: highchartProps?.["Show Boundaries"] && index === 0
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

            id: "yaxis-" + index,
            name: tag.NAME,
            opposite: false,
            alignTick: highchartProps["Show Enable Y-Axis Align Ticks"],

            startOnTick:
                highchartProps["Show Enable Y-Axis Start On Ticks"],
            endOnTick: highchartProps["Show Enable Y-Axis End On Ticks"],
            showFirstLabel: true,
            showLastLabel: true,

            title: {
                text: tag.CATALOG_SYMBOL
                    ? `${tag.QUANTITY_TYPE} (${tag.CATALOG_SYMBOL})`
                    : "Undefined (UoM)",
                style: {
                    fontSize:
                        highchartProps["Graph Axis Title Font Size (em)"] === ""
                            ? "11px"
                            : `${highchartProps["Graph Axis Title Font Size (em)"]}px`,
                },
            },
            labels: {
                style: {
                    fontSize:
                        highchartProps["Graph Axis Value Font Size (em)"] === ""
                            ? 11
                            : highchartProps["Graph Axis Value Font Size (em)"],
                },
            },
            events: {
                afterSetExtremes: function (e) {
                    if (e.min === e.max) {
                        this.update({
                            labels: {
                                enabled: false,
                            },
                            title: {
                                enabled: false,
                            },
                        });
                    } else {
                        this.update({
                            labels: {
                                enabled: true,
                            },
                            title: {
                                enabled: true,
                            },
                        });
                    }
                },
            },
        },
        false
    );

}