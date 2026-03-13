import React from "react";
import Grid from "@mui/material/Grid";

import { useDispatch, useSelector } from "react-redux";
import {
  addSaveTagValue,
  fillTagData,
} from "../../../../../services/actions/tags/tags";
import {
  setBodyConfirmation,
  setIsActiveConfirmation,
  setSaveFunctonConfirmation,
  setTitleConfirmation,
} from "../../../../../services/actions/confirmation/historyConfirmation";
import { saveTag, addNewTag } from "../../../../../services/actions/tags/tags";
import { applyFontWeight } from "../../../../../services/actions/fontSize";
import { Divider } from "@mui/material";
import HelperTextField from "./helperTextField";
const PropertiesEditor = ({ service }) => {
  const dispatch = useDispatch();
  const tagValues = useSelector((state) => state.tags.tagValues);
  const tagId = useSelector((state) => state.treeview.selectedItem.TAG_ID);
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const name = useSelector((state) => state.treeview.selectedItem.NAME);
  React.useEffect(() => {
    if (selectedIndex === -2) {
      dispatch(addNewTag(service));
    }
  }, [selectedIndex]);
  const saveFunction = () => async (dispatch) => {
    return await dispatch(saveTag(service));
  };
  React.useEffect(() => {
    dispatch(setSaveFunctonConfirmation(saveFunction));
    dispatch(setTitleConfirmation("You want to save this ?"));
    dispatch(setBodyConfirmation(`${name ? name : "new"}`));
    if (selectedIndex !== -2 && selectedIndex !== -3) {
      dispatch(fillTagData(tagId, service));
    }
  }, [tagId, name]);

  React.useEffect(() => {
    applyFontWeight();
  }, []);
  const handleChangeFunc = React.useCallback((key, value) => {
    dispatch(setIsActiveConfirmation(true));
    dispatch(addSaveTagValue(key, value));
  }, []);
  if (Object.keys(tagValues).length > 0 && (tagId || selectedIndex === -2)) {
    return (
      <Grid
        key={selectedIndex}
        container
        className="tag-manager-container__body__property-box__prop-item"
        rowGap={0.5}
      >
        <Grid
          item
          xs={12}
          className="tag-manager-container__body__property-box__prop-item__box"
        >
          <Grid container alignItems={"center"} rowSpacing={0.5}>
            <Grid
              item
              xs={12}
              className="tag-manager-container__body__property-box__prop-item__box__header"
            >
              Tag Link
            </Grid>

            {Object.keys(tagValues?.TAG_LINK).map((e, key) => {
              return (
                <>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className="tag-manager-container__body__property-box__prop-item__box__body"
                  >
                    <Grid
                      container
                      className="tag-manager-container__body__property-box__prop-item__box__select-box"
                      key={key}
                    >
                      <Grid
                        item
                        className="tag-manager-container__body__property-box__prop-item__box__label"
                      >
                        {tagValues?.TAG_LINK[e]?.SHORT_LABEL}
                      </Grid>
                      <Grid
                        item
                        className={
                          "tag-manager-container__body__property-box__prop-item__box__label-field"
                        }
                      >
                        <HelperTextField
                          row={tagValues?.TAG_LINK[e]}
                          handleChange={handleChangeFunc}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6}></Grid>
                </>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ margin: "8px 0 !important" }}>
          <Divider />
        </Grid>
        <Grid
          item
          xs={12}
          className="tag-manager-container__body__property-box__prop-item__box"
        >
          <Grid container alignItems={"center"} rowGap={0.5}>
            <Grid
              item
              xs={12}
              className="tag-manager-container__body__property-box__prop-item__box__header"
            >
              Tag Information
            </Grid>
            {Object.keys(tagValues?.TAG_INFORMATIONS).map((e, key) => {
              return tagValues?.TAG_INFORMATIONS[e]?.PROPERTY_TYPE === "UOM" ? (
                <HelperTextField
                  row={tagValues?.TAG_INFORMATIONS[e]}
                  handleChange={handleChangeFunc}
                />
              ) : (
                <Grid item xs={12} md={6} key={key}>
                  <Grid
                    container
                    className="tag-manager-container__body__property-box__prop-item__box__select-box"
                  >
                    <Grid
                      item
                      className="tag-manager-container__body__property-box__prop-item__box__body tag-manager-container__body__property-box__prop-item__box__label"
                    >
                      {tagValues?.TAG_INFORMATIONS[e]?.SHORT_LABEL}
                    </Grid>
                    <Grid
                      item
                      className={
                        "tag-manager-container__body__property-box__prop-item__box__label-field"
                      }
                    >
                      <HelperTextField
                        row={tagValues?.TAG_INFORMATIONS[e]}
                        handleChange={handleChangeFunc}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    );
  }
  return <></>;
};

export default PropertiesEditor;
