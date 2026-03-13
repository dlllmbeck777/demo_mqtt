import React from "react";

import Roles from "../../../../services/api/roles";

const Main = ({ value }) => {
  const [name, setName] = React.useState("");

  async function asyncFunc() {
    try {
      const res = await Roles.getRolesName({ ROLES_ID: value });
      setName(res?.data?.ROLES_NAME);
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    asyncFunc();
  }, []);
  return name;
};

export default Main;
