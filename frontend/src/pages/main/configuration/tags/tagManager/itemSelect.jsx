import React from "react";
import { Select } from "../../../../../components";
import { useDispatch, useSelector } from "react-redux";
import { instance, config } from "../../../../../services/baseApi";
import { addSaveTagValue } from "../../../../../services/actions/tags/tags";
import { setIsActiveConfirmation } from "../../../../../services/actions/confirmation/historyConfirmation";
export const TransactionTypeSelect = () => {
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const culture = useSelector((state) => state.lang.cultur);
  const defaultValue = useSelector(
    (state) => state.tags.saveValues?.TRANSACTION_TYPE
  );
  const dispatch = useDispatch();
  const [values, setvalues] = React.useState([]);

  const loadItems = async (value) => {
    try {
      let res = await instance.get(
        `/item/details/${value.toLowerCase()}`,
        config()
      );
      dispatch({
        type: "LOAD_ITEMS_FOR_TAGLINKS",
        payload: res.data,
      });
    } catch {
      dispatch({
        type: "LOAD_ITEMS_FOR_TAGLINKS",
        payload: [],
      });
    }
  };

  const handleChangeFunc = async (value) => {
    loadItems(value);
    dispatch(addSaveTagValue("TRANSACTION_TYPE", value));
  };
  React.useEffect(() => {
    var ignore = false;
    const body = JSON.stringify({ CULTURE: culture });
    const myFunc = async () => {
      try {
        let res = await instance.post("/tags/links/", body, config());
        if (!ignore) {
          setvalues(res.data);
          if (defaultValue) {
            loadItems(defaultValue);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (selectedIndex !== -3) {
      myFunc();
    }

    return () => {
      ignore = true;
    };
  }, [defaultValue, selectedIndex]);
  return (
    <Select
      values={values}
      valuesPath="TO_TYPE"
      defaultValue={defaultValue}
      dataTextPath="SHORT_LABEL"
      handleChangeFunc={handleChangeFunc}
    />
  );
};

export const TransactionPropertySelect = () => {
  const dispatch = useDispatch();
  const values = useSelector((state) => state.tags.items);
  const defaultValue = useSelector((state) => state.tags.saveValues?.ITEM_ID);

  const handleChangeFunc = async (value) => {
    const selectedValue = values.find((e) => e.ITEM_ID === value);
    dispatch(setIsActiveConfirmation(true));
    dispatch(addSaveTagValue("ITEM_ID", value));
    dispatch(
      addSaveTagValue(
        "TRANSACTION_PROPERTY",
        selectedValue?.PROPERTY_STRING || ""
      )
    );
  };

  return (
    <Select
      disabled={values.length === 0 ? true : false}
      values={values}
      valuesPath="ITEM_ID"
      defaultValue={defaultValue}
      dataTextPath="PROPERTY_STRING"
      handleChangeFunc={handleChangeFunc}
    />
  );
};
