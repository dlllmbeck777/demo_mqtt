export const showLoading = (series) => {
    series.showLoading();
    var loadingOverlay = series.container.querySelector(".highcharts-loading");
    if (loadingOverlay) {
        loadingOverlay.innerHTML =
            '<div class="loader-container"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>';
    }
}

export const loading = {
    loading: {
        labelStyle: {
            fontWeight: "bold",
            fontSize: "16px",
            color: "gray",
        },
        style: {
            backgroundColor: "transparent",
            opacity: 0.6,
        }
    }
}