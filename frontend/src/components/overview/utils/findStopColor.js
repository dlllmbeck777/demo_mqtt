export const findColor = (data, index, chartProps) => {
    let returnVal = "black";
    [
        ...Array(
            parseInt(
                chartProps?.[`[${index}] Stops`]
                    ? chartProps?.[`[${index}] Stops`]
                    : 0
            )
        ),
    ].map((e, i) => {
        if (
            parseFloat(chartProps?.[`[${index}][${i}] Low`]) <= data &&
            parseFloat(chartProps?.[`[${index}][${i}] High`]) >= data
        ) {
            returnVal = chartProps?.[`[${index}][${i}] Color`];
        }
    });
    return returnVal;
};