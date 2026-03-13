import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CodelistService from "../../../../services/api/codeList";
const Main = ({ value }) => {
  const [values, setValues] = React.useState("");
  const CULTURE = useSelector((state) => state.lang.cultur);
  const asyncLoadFunc = async () => {
    const body = JSON.stringify({ CULTURE, CODE: value });

    try {
      if (value !== "" && value) {
        let res = await CodelistService.getByParentHierarchy(body);
        setValues(res?.data?.[0]?.CODE_TEXT);
      }
    } catch (err) {}
  };

  React.useEffect(() => {
    asyncLoadFunc();
  }, []);
  return <div>{values}</div>;
};

export default Main;
