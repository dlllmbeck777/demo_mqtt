import React from "react";
import { useSelector } from "react-redux";
import Loader from "./loader";
const Loading = (props) => {
  const { Element } = props;
  const isLoading = useSelector((state) => state.loader.loader);
  return (
    <React.Fragment>
      {isLoading ? <Loader></Loader> : <React.Fragment></React.Fragment>}
      {Element}
    </React.Fragment>
  );
};

export default Loading;
