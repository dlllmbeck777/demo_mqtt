import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { CustomIconToolbar } from "../../../../components";
import { DataGridPro } from "@mui/x-data-grid-pro";
import * as local from "@mui/x-data-grid-pro";
import { changePage } from "../../../../services/actions/diagnostic/diagnostic";
import { useDispatch, useSelector } from "react-redux";
import CodelistService from "../../../../services/api/codeList";
const dataGridPicker = {
  0: "systemHealth",
  1: "communicationsStatus",
  2: "logs",
  3: "alarmHistory",
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);

  const column = useSelector(
    (state) => state.diagnostic[dataGridPicker[value]].column
  );
  const row = useSelector(
    (state) => state.diagnostic[dataGridPicker[value]].row
  );
  const loading = useSelector(
    (state) => state.diagnostic[dataGridPicker[value]].loading
  );
  const [sortModel, setSortModel] = React.useState([
    { field: "time", sort: "desc" },
  ]);
  const rowCount = useSelector(
    (state) => state.diagnostic[dataGridPicker[value]]?.rowCount
  );
  const page = useSelector(
    (state) => state.diagnostic[dataGridPicker[value]]?.page
  );
  const { [CULTURE.replace(/-/g, "")]: translate } = local;
  const [pageSize, setPageSize] = React.useState(100);
  const changePageModel = (event) => {
    dispatch(changePage(dataGridPicker[value], event));
  };
  React.useEffect(() => {
    setSortModel([{ field: "time", sort: "desc" }]);
  }, [column]);

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{
        height: "calc(100% - 48px)",
        "& button": {
          minWidth: "36px !important",
          height: "36px !important",
          borderRadius: "50px !important",
          "& span": {
            margin: 0,
          },
        },
      }}
      {...other}
    >
      {value === index ? (
        dataGridPicker[value] === "systemHealth" ||
        dataGridPicker[value] === "communicationsStatus" ? (
          <Box sx={{ height: "100%", p: 2 }}>
            <DataGridPro
              className="template-container__body__property-box__datagrid"
              localeText={{
                ...translate.components.MuiDataGrid.defaultProps.localeText,
                toolbarColumns: "",
                toolbarFilters: "",
                toolbarDensity: "",
                toolbarExport: "",
              }}
              density="compact"
              columns={column}
              rows={row}
              loading={loading}
              components={{
                Toolbar: CustomIconToolbar,
                LoadingOverlay: LinearProgress,
              }}
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model)}
            />
          </Box>
        ) : (
          <Box sx={{ height: "100%", p: 2 }}>
            <DataGridPro
              className="template-container__body__property-box__datagrid"
              localeText={{
                ...translate.components.MuiDataGrid.defaultProps.localeText,
                toolbarColumns: "",
                toolbarFilters: "",
                toolbarDensity: "",
                toolbarExport: "",
              }}
              density="compact"
              columns={column}
              rows={row}
              loading={loading}
              components={{
                Toolbar: CustomIconToolbar,
                LoadingOverlay: LinearProgress,
              }}
              pagination
              rowCount={rowCount}
              pageSize={pageSize}
              page={page}
              paginationMode="server"
              onPageChange={(model) => changePageModel(model)}
              disablePageSize={true}
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model)}
            />
          </Box>
        )
      ) : (
        <></>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function DiagnosticEditor() {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [value, setValue] = React.useState(0);
  const [tabs, setTabs] = React.useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleTabLoad = async () => {
    let res = await CodelistService.getByParentHierarchy({
      CULTURE,
      LIST_TYPE: "DIAGNOSTIC_PAGE_TAB",
    });
    res.data.sort((a, b) => parseInt(a?.VAL1) - parseInt(b?.VAL1));
    setTabs(res?.data);
  };
  React.useEffect(() => {
    handleTabLoad();
  }, [CULTURE]);
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
          textColor="inherit"
          sx={{
            minHeight: "40px",
            backgroundColor: "background.info",
            pt: "2px",
            color: "text.primary",
          }}
        >
          {tabs.map((e, i) => {
            return (
              <Tab
                label={e?.CODE_TEXT}
                {...a11yProps(i)}
                sx={{ textTransform: "capitalize" }}
              />
            );
          })}
        </Tabs>
      </Box>
      <TabPanel value={value} index={value}></TabPanel>
    </Box>
  );
}

export default React.memo(DiagnosticEditor);
