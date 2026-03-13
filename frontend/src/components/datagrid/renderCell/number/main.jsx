import React from "react";
const MyTextfield = (props) => {
  const { value = "", DECIMALS = "" } = props;
  console.log(DECIMALS);
  if (!isNaN(parseFloat(value).toFixed(parseInt(DECIMALS))))
    return parseFloat(value).toFixed(parseInt(DECIMALS))
      ? parseFloat(value).toFixed(parseInt(DECIMALS))
      : value;
  return value;
};

export default React.memo(MyTextfield);
