import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { clean_error } from "../../services/actions/error";
import { useIsMount } from "../../hooks/useIsMount";
import "../../assets/styles/components/error/componentError.scss";

const errorTypeCalc = (code) => {
  if (code >= 300) {
    return "red";
  } else if (code >= 200) {
    return "green";
  } else if (code >= 100) {
    return "blue";
  }
};

const ErrorMessage = (props) => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const err = useSelector((state) => state.error);
  const { Element } = props;
  const errMsgClose = () => {
    dispatch(clean_error());
  };
  React.useEffect(() => {
    let timer;
    if (!isMount) {
      timer = setTimeout(() => {
        dispatch({
          type: "CLEAN_ERROR_SUCCESS",
        });
      }, 25000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [err.isError]);

  return (
    <React.Fragment>
      <Element />
      <Snackbar open={err.isError}>
        <Alert
          onClose={errMsgClose}
          // severity={errorTypeCalc(err.statusCode)}
          className="error-message"
          sx={{
            backgroundColor: errorTypeCalc(err.statusCode),
            color: "white",
            svg: {
              fill: "white",
            },
          }}
        >
          {err.statusCode === 500 ? "Internal Server Error" : err.errMsg}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default ErrorMessage;
