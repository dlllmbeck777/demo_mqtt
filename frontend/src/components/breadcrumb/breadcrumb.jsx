import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Breadcrumbs as MUIBreadcrumbs, Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import history from "../../routers/history";
import { confirmationPushHistory } from "../../services/utils/historyPush";
import { setGoFunctionConfirmation } from "../../services/actions/confirmation/historyConfirmation";

const Breadcrumbs = ({ withTreemMenu }) => {
  //TODO use useLocation, remove params
  const dispatch = useDispatch();
  const pathnames = decodeURI(window.location.pathname)
    .split("/")
    .filter((x) => x);
  const handleClick = (routeTo) => {
    dispatch(setGoFunctionConfirmation(() => history.push(routeTo)));
    dispatch(confirmationPushHistory());
  };
  const { params } = useParams(); //  important for updating breadcrumb
  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      separator="\"
      className="breadcrumb-container"
      sx={{ paddingLeft: withTreemMenu ? "40px" : "24px" }}
    >
      <HomeIcon
        fontSize="small"
        className="breadcrumb-container__home-icon"
        onClick={() => handleClick("/")}
      />

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        name = name
          .replace(/_/g, " ")
          .replace(/%20/g, " ")
          .replaceAll("U+002F", "/");
        return isLast ? (
          <Typography
            key={name}
            className="breadcrumb-container__text  breadcrumb-container__text-last"
          >
            {name}
          </Typography>
        ) : (
          <Typography
            key={name}
            onClick={() => handleClick(routeTo)}
            className="breadcrumb-container__text"
          >
            {name}
          </Typography>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
