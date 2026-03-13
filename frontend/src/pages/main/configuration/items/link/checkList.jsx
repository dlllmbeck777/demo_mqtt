import React from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { Box, Grid, Button, Divider } from "@mui/material/";

import { CheckboxList, DatePicker, Select } from "../../../../../components";
import {
  loadCheckedList,
  saveLinks,
  toggleChecked,
  cleanCompanyCheckedList,
} from "../../../../../services/actions/item/checkedList";
import ItemLinkService from "../../../../../services/api/itemLink";
import { cardinalityCheck } from "../../../../../services/actions/item/cardinality";
import { add_error } from "../../../../../services/actions/error";
import resourceList from "../../../../../services/api/resourceList";
import "../../../../../assets/styles/page/configuration/itemLinkDialog.scss";

let cancelToken;
const MyCheckList = (props) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const layer = useSelector((state) => state.auth.user.active_layer);
  const instanttime = new Date();
  const [date, setDate] = React.useState(instanttime);
  const [values, setValues] = React.useState([""]);
  const [selectedValue, setSelectedValue] = React.useState(false);
  const data = useSelector((state) => state.checkedList.listItem);
  const checkedItemsLen = useSelector(
    (state) => state.checkedList.checkedItems.length
  );
  const [btnText, setBtnText] = React.useState([]);
  async function asyncGetBtnText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "BUTTON_TEXT",
      });
      setBtnText(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetBtnText();
  }, [CULTURE]);
  const handleToggleFunc = (data) => {
    dispatch(toggleChecked(data));
  };
  const onChange = (newValue) => {
    setDate(newValue);
  };
  React.useEffect(() => {
    async function myFunc() {
      try {
        const body = JSON.stringify({
          TYPE: props.data.TYPE,
          [props.type]: props.data[props.type],
          CULTURE: CULTURE,
        });
        if (cancelToken) {
          cancelToken.cancel();
        }
        cancelToken = axios.CancelToken.source();
        let res = await ItemLinkService.getRelated(body, cancelToken);
        setValues(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    myFunc();
    return () => {
      setValues([""]);
      dispatch(cleanCompanyCheckedList());
    };
  }, []);
  return (
    <React.Fragment>
      <Grid
        container
        className="item-link-dialog-header"
        id="draggable-dialog-title"
      >
        <Grid item className="item-link-dialog-header__date-picker">
          <DatePicker value={instanttime} handleChange={onChange} />
        </Grid>
        <Grid item>
          <Select
            values={values}
            dataTextPath={"SHORT_LABEL"}
            handleChangeFunc={(value) => {
              setSelectedValue(value);
              dispatch(
                loadCheckedList(
                  value[props.type === "FROM_TYPE" ? "TO_TYPE" : "FROM_TYPE"],
                  props.type === "FROM_TYPE" ? "TO_TYPE" : "FROM_TYPE"
                )
              );
            }}
          />
        </Grid>
      </Grid>
      <Box sx={{ height: `${props.height - 110}px`, overflowY: "auto" }}>
        <CheckboxList
          data={data}
          dataTextPath="PROPERTY_STRING"
          handleToggleFunc={handleToggleFunc}
        />
      </Box>
      <Grid
        container
        columnSpacing={0.5}
        className="dialog-container__paper__footer item-link-dialog-footer"
      >
        <Grid item>Selected Items:{checkedItemsLen}</Grid>
        <Grid item>
          <Grid container columnSpacing={0.5}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  props.handleClose();
                }}
              >
                {
                  btnText?.filter((e) => e.ID === "BUTTON_TEXT_PROPERTIES")?.[0]
                    ?.SHORT_LABEL
                }
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={async () => {
                  if (
                    await dispatch(
                      cardinalityCheck(
                        props.data.TYPE,
                        props.type === "TO_TYPE"
                          ? "TO_ITEM_ID"
                          : "FROM_ITEM_ID",
                        selectedValue
                      )
                    )
                  ) {
                    dispatch(
                      await saveLinks(
                        date,
                        selectedValue.TYPE,
                        selectedValue.TO_TYPE,
                        selectedValue.FROM_TYPE,
                        props.refreshHandle
                      )
                    );
                    props.handleClose();
                  } else {
                    const body = JSON.stringify({
                      CULTURE,
                      ID: "TYPE.REACT.ITEM_LINK.CARDINALITY",
                    });
                    const res = await resourceList.getErrorMessage(layer, body);
                    dispatch(add_error(res.data, 400));
                  }
                }}
              >
                {
                  btnText?.filter((e) => e.ID === "BUTTON_TEXT_SAVE")?.[0]
                    ?.SHORT_LABEL
                }
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default MyCheckList;
