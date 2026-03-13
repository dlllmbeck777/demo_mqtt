import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import "../../../assets/styles/components/inputs/numberTextField.scss";
import UomService from "../../../services/api/uom";
import { useSelector } from "react-redux";
const MyNumberTextField = (props) => {
  const { handleChange = () => {}, value = "", UOM, DECIMALS, ...rest } = props;
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [adorment, setAdorment] = React.useState("");
  const handleChangeFunc = (e) => {
    handleChange(e.target.value);
  };
  const asyncLoadFunc = async () => {
    try {
      const body = { CULTURE, CODE: UOM };
      let res = await UomService.getUomCode(body);
      console.log(res);
      setAdorment(res?.data?.[0]?.CATALOG_SYMBOL);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    asyncLoadFunc();
  }, []);
  return (
    <TextField
      variant="outlined"
      type="number"
      onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
      value={
        parseFloat(value).toFixed(parseInt(DECIMALS))
          ? parseFloat(value).toFixed(parseInt(DECIMALS))
          : value
      }
      onChange={handleChangeFunc}
      className="number-text-field"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{adorment}</InputAdornment>
        ),
      }}
      {...rest}
    />
  );
};

export default React.memo(MyNumberTextField);
