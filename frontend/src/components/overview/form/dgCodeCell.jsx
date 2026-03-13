import React from "react";
import { useSelector } from "react-redux";
import CodelistService from "../../../services/api/codeList";
const DgCodeCell = ({ value }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [data, setData] = React.useState("");
  async function asyncFunction() {
    try {
      let val = await CodelistService.getByParentHierarchy({
        CULTURE,
        CODE: value,
      });
      setData(val?.data[0]?.CODE_TEXT);
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    asyncFunction();
  }, [CULTURE]);
  return <div>{data}</div>;
};

export default DgCodeCell;
