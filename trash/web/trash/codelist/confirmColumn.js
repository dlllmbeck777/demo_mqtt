export const columns = [
    {
        field: "CULTURE",
        headerName: "Culture",
        editable: false,
        width: 100
    },
    {
        field: "CODE",
        headerName: "Code",
        editable: false,
        width: 150
    },
    {
        field: "CODE_TEXT",
        headerName: "Code Text",
        editable: false,
        width: 150
    },

    {
        field: "PARENT",
        headerName: "Parent",
        editable: false,
        width: 100
    },
    {
        field: "LEGACY_CODE",
        headerName: "Legacy Code",
        editable: false,
        width: 100
    },
    {
        field: "VAL1",
        headerName: "Val1",
        editable: false,
        type: "number",
        headerAlign: "left",
        align: "left",
        width: 100
    },
    {
        field: "VAL2",
        headerName: "Val2",
        editable: false,
        type: "number",
        headerAlign: "left",
        align: "left",
        width: 100
    },
    {
        field: "VAL3",
        headerName: "Val3",
        editable: false,
        type: "number",
        headerAlign: "left",
        align: "left",
        width: 100
    },

    {
        field: "DATE1",
        headerName: "Date1",
        editable: false,
        type: "date",
        width: 100
    },
    {
        field: "DATE2",
        headerName: "Date2",
        editable: false,
        type: "date",
        width: 100
    },
    {
        field: "CHAR1",
        headerName: "Char1",
        editable: false,
        width: 100
    },
    {
        field: "CHAR2",
        headerName: "Char2",
        editable: false,
        width: 100
    },
    {
        field: "LAYER_NAME",
        headerName: "Layer Name",
        editable: false,
        width: 100
    },
    {
        field: "HIDDEN",
        headerName: "Hidden",
        width: 100,
        editable: false,
        type: 'singleSelect',
        valueOptions: ['True', 'False']
    },
    {
        field: "LAST_UPDT_USER",
        headerName: "Last Update User",
        editable: false,
        cellClassName: "super-app-theme--cell",
        width: 100
    },
    {
        field: "LAST_UPDT_DATE",
        headerName: "Last Update Date",
        editable: false,
        cellClassName: "super-app-theme--cell",
        width: 100
    },
];