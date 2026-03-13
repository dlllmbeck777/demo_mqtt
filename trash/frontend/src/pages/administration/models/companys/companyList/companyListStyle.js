const styles = () => ({

    link: {
        textDecoration: "none",
        color: "#616161"
    },

    actions: {
        display: "flex",
        alignItems: "center",
        height: "40px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #EAEAEA",
    },

    button: {
        borderRadius: "4px",
        backgroundColor: "#2499ef",
        color: "#FFFFFF",
        width: "170px",
        height: "40px"
    },

    iconButton: {
        color: "#495057",
        background: "none",
        borderRadius: "0",
        '&:hover': {
            background: "none",
            color: "#458BF3"
        },
    },
    tableContainer: {
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAEAEA",
        borderRadius: "5px",
    },

    table: {
        backgroundColor: "#ffffff",
        borderColor: "#1d2438",
    },

    tableHeadRow: {
        border: "none",
        borderColor: "#1d2438"
    },

    tableHeadCell: {

        padding: "5px"

    },

    tableBodyCell: {
        padding: "5px"
    },

})

export default styles