import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

import { setSelectedDrawerItem } from "../../services/actions/drawerMenu/drawerMenu";
import history from "../../routers/history";
import { selectDrawerItem } from "../../services/actions/drawerMenu/drawerMenu";
const MyNavigator = ({ way }) => {
  document.title = `Ligeia.ai | ${way}`;
  selectDrawerItem(way);
  const dispatch = useDispatch();
  const { myKey } = useParams();
  const drawerMenu = useSelector((state) => state.drawerMenu.data);
  var url = "/";
  console.log(way);
  if (drawerMenu) {
    const configurationItems = drawerMenu[way.toUpperCase()].CHILD;
    Object.keys(configurationItems).map((e) => {
      var myKeyValidator = configurationItems[e].PATH.toLowerCase();
      myKeyValidator = myKeyValidator.replace(/ /g, "_");
      if (myKey === myKeyValidator) {
        var tempUrl =
          configurationItems[e].CHILD[
            Object.keys(configurationItems[e].CHILD)[0]
          ].PATH.toLowerCase();
        tempUrl = tempUrl.replace(/ /g, "_");
        url = `${window.location.pathname}/${tempUrl}`;
        dispatch(
          setSelectedDrawerItem(
            configurationItems[e].CHILD[
              Object.keys(configurationItems[e].CHILD)[0]
            ]
          )
        );
      }
    });
  } else {
    history.push(`/`);
  }
  return <Navigate to={`${url}`}></Navigate>;
};

export default MyNavigator;
