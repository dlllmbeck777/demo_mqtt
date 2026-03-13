import React from "react";

import ResourceListService from "../../../../services/api/resourceList";
import { useSelector } from "react-redux";
const Main = ({ value, parent }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [error_message, setErrorMessage] = React.useState([]);
  async function myAsyncFunc() {
    try {
      console.log({ CULTURE, PARENT: parent });
      let res = await ResourceListService.getResourcelist({
        CULTURE,
        PARENT: parent,
      });
      setErrorMessage(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    myAsyncFunc();
  }, []);
  return error_message?.filter((e) => e.ID === value)?.[0]?.SHORT_LABEL
    ? error_message?.filter((e) => e.ID === value)?.[0]?.SHORT_LABEL
    : value;
};

export default Main;
