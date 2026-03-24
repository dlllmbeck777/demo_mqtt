import React from "react";
import Grid from "@mui/material/Grid";

import { Select } from "../../../../../components";
import { useDispatch, useSelector } from "react-redux";
import { instance, config } from "../../../../../services/baseApi";
import { addSaveTagValue } from "../../../../../services/actions/tags/tags";
import { setIsActiveConfirmation } from "../../../../../services/actions/confirmation/historyConfirmation";
import UomService from "../../../../../services/api/uom";
const Uom = () => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [qtDefault, setQtDefault] = React.useState([]);
  const [umDefault, setumDefault] = React.useState([]);
  const [uomDefault, setUomDefault] = React.useState([]);
  const [uomCode, setuomCode] = React.useState([]);
  const [qt, setqt] = React.useState([]);
  const [uom, setuom] = React.useState([]);

  const tagId = useSelector((state) => state.treeview.selectedItem?.TAG_ID);
  const UOM_CODE = useSelector((state) => state.tags.saveValues?.UOM_CODE);

  React.useEffect(() => {
    const myFunc = async () => {
      try {
        let res = await instance.get("/uom-unit/type/", config());
        setqt(res.data);
      } catch {}
    };
    myFunc();
    return () => {
      setuom([]);
    };
  }, [tagId]);

  React.useEffect(() => {
    const myFunc = async () => {
      try {
        let val = await UomService.getUomCode({ CULTURE, CODE: UOM_CODE });
        setuomCode(val?.data?.[0]);
        setQtDefault(val?.data?.[0]?.QUANTITY_TYPE);
        setumDefault(val?.data?.[0]?.NAME);
        setUomDefault(val?.data?.[0]?.CODE);
      } catch (err) {
        setuomCode([]);
        setQtDefault([]);
        setumDefault([]);
        setUomDefault([]);
        console.log(err);
      }
    };
    myFunc();
  }, [CULTURE, UOM_CODE]);

  React.useEffect(() => {
    const myFunc = async () => {
      try {
        const body = JSON.stringify({
          QUANTITY_TYPE: qtDefault,
        });
        let res = await instance.post("/uom-unit/name/", body, config());
        setuom(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    myFunc();
  }, [qtDefault]);

  const handleChangeFunc = (e) => {
    setQtDefault(e);
  };
  return (
    <>
      <Grid item xs={12} md={6}>
        <Grid
          container
          className="tag-manager-container__body__property-box__prop-item__box__select-box"
        >
          <Grid
            item
            className="tag-manager-container__body__property-box__prop-item__box__body tag-manager-container__body__property-box__prop-item__box__label"
          >
            Quantity Type
          </Grid>
          <Grid
            item
            className={
              "tag-manager-container__body__property-box__prop-item__box__label-field"
            }
          >
            <Select
              values={qt}
              valuesPath="QUANTITY_TYPE"
              dataTextPath="QUANTITY_TYPE"
              defaultValue={qtDefault}
              handleChangeFunc={handleChangeFunc}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid
          container
          className="tag-manager-container__body__property-box__prop-item__box__select-box"
        >
          <Grid
            item
            className="tag-manager-container__body__property-box__prop-item__box__body tag-manager-container__body__property-box__prop-item__box__label"
          >
            Uom Name
          </Grid>
          <Grid
            item
            className={
              "tag-manager-container__body__property-box__prop-item__box__label-field"
            }
          >
            <Select
              values={uom}
              valuesPath="NAME"
              dataTextPath="NAME"
              defaultValue={umDefault}
              disabled={true}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid
          container
          className="tag-manager-container__body__property-box__prop-item__box__select-box"
        >
          <Grid
            item
            className="tag-manager-container__body__property-box__prop-item__box__body tag-manager-container__body__property-box__prop-item__box__label"
          >
            Unit Of Measure
          </Grid>
          <Grid
            item
            className={
              "tag-manager-container__body__property-box__prop-item__box__label-field"
            }
          >
            <Select
              values={uom}
              valuesPath="CODE"
              dataTextPath="CATALOG_SYMBOL"
              defaultValue={uomDefault}
              disabled={uom.length === 0}
              handleChangeFunc={(e) => {
                dispatch(setIsActiveConfirmation(true));
                dispatch(addSaveTagValue("UOM_CODE", e));
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Uom;
