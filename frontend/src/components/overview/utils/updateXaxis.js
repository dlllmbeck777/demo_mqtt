export const updateXAxisTitle = (chartRef, title) => {
    chartRef.xAxis.map((e) => {
        e.update({
            title: {
                text: title
            },
        });
    });
}


export const updateXAxisTitleStyle = (chartRef, fontSize) => {
    chartRef.xAxis.map((e) => {
        e.update({
            title: {
                style: {
                    fontSize:
                        fontSize === ""
                            ? "11px"
                            : `${fontSize}px`,
                },
            },
        });
    });
}


export const updateXAxisType = (chartRef, type) => {
    chartRef.xAxis.map((e) => {
        e.update({
            type: type,
        });
    });
}


