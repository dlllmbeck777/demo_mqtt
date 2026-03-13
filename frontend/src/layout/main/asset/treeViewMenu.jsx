import React from "react";
import { useDispatch } from "react-redux";
import $ from "jquery";
import { Box } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { ComponentError, SearchBarMobile } from "../../../components";

import {
  loadTreeViewWidth,
  updateTreeViewCouch,
} from "../../../services/actions/treeview/treeview";
import "../../../assets/styles/page/overview/main.scss";
const DrawerMenu = (props) => {
  const dispatch = useDispatch();
  const ref = React.useRef();

  const { Element, path, delSearchBar = false } = props;
  function saveWidth(width) {
    dispatch(updateTreeViewCouch(path, width));
  }
  function showLeftArrow() {
    $(".treemenu-container__box__toggle-button-left").show();
    $(".treemenu-container__box__toggle-button-right").hide();
  }
  function showRightArrow() {
    $(".treemenu-container__box__toggle-button-left").hide();
    $(".treemenu-container__box__toggle-button-right").show();
  }
  function openTreeMenu(width) {
    showLeftArrow();
    $(".treemenu-container__box").animate({ width: width }, 400);
  }
  function closeTreeMenu() {
    showRightArrow();
    $(".treemenu-container__box").animate({ width: 0 }, 400);
  }

  const handler = (mouseDownEvent) => {
    const startSize = $(".treemenu-container__box").width();
    const startPosition = mouseDownEvent.pageX;
    document.getElementById("main-box").style.userSelect = "none";
    function onMouseMove(mouseMoveEvent) {
      if (startSize - startPosition + mouseMoveEvent.pageX < 10) {
        $(".treemenu-container__box").width(0);
        showRightArrow();
      } else {
        $(".treemenu-container__box").width(
          startSize - startPosition + mouseMoveEvent.pageX
        );
        showLeftArrow();
      }
    }
    function onMouseUp() {
      document.getElementById("main-box").style.userSelect = "text";
      dispatch(
        updateTreeViewCouch(path, $(".treemenu-container__box").width())
      );
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp);
  };
  React.useEffect(() => {
    const myFunc = async () => {
      var res = await dispatch(await loadTreeViewWidth(path));
      res[path] > 0 ? openTreeMenu(res[path]) : closeTreeMenu();
      $(".treemenu-container__box__toggle-button").show();
    };
    myFunc();
  }, []);

  return (
    <Box className="treemenu-container">
      <Box className="treemenu-container__box">
        {!delSearchBar && (
          <>
            <Box className="treemenu-container__box__search-bar">
              <SearchBarMobile />
            </Box>
            <Box className="treemenu-container__box__divider" />
          </>
        )}

        <Box
          ref={ref}
          id="treemenu-container-offset-id"
          className="treemenu-container__box__toggle-button"
          onClick={() => {
            if ($(".treemenu-container__box").width() > 0) {
              closeTreeMenu();
              saveWidth(0);
            } else {
              var tempDiv = $("<div>")
                .css({
                  width: "min-content",
                  position: "absolute",
                  left: "-9999px",
                })
                .appendTo($("body"));

              tempDiv.html($(".treemenu-container__box__element-box").html());
              var width = tempDiv.width() < 250 ? 250 : tempDiv.width();
              tempDiv.remove();
              if ($(".treemenu-container__box").width() < width) {
                openTreeMenu(width + 10);
                saveWidth(width + 10);
              } else if (width === 0) {
                openTreeMenu(250);
                saveWidth(250);
              }
            }
          }}
        >
          <ChevronLeftIcon className="treemenu-container__box__toggle-button-left" />
          <ChevronRightIcon className="treemenu-container__box__toggle-button-right" />
        </Box>

        <Box className="treemenu-container__box__element-box">
          <ComponentError errMsg="Error">{Element}</ComponentError>
        </Box>
      </Box>
      <Box
        className="treemenu-container__resize-border"
        onMouseDown={handler}
      />
    </Box>
  );
};

export default React.memo(DrawerMenu);
