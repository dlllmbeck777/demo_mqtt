import React from "react";
import { Box, Grid, MenuItem, Button } from "@mui/material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import CircleIcon from "@mui/icons-material/Circle";
import { Dropdown } from "./dropdown";
import NestedMenuItem from "./nestedMenuItem";
import { useDispatch } from "react-redux";
import { setSelectedCollapseMenu } from "../../../services/actions/collapseMenu/collapseMenu";
import {
  updateLayouts,
  loadTapsOverview,
} from "../../../services/actions/overview/taps";
import MenuLastItemStatus from "./menuLastItemStatus";
import history from "../../../routers/history";
function MyMenuItems({ item, itemKey }) {
  const dispatch = useDispatch();
  async function handleClick(item) {
    dispatch(updateLayouts());
    dispatch(
      await setSelectedCollapseMenu({
        ...item,
      })
    );
    dispatch(await loadTapsOverview());
    history.push(`/${item.path}`);
  }

  return (
    <div>
      <Box>
        <Dropdown
          trigger={
            <Grid
              item
              className="overview-container__horizontal-menu__body__item__text"
            >
              <Button>{itemKey} </Button>
            </Grid>
          }
          menu={Object.keys(item).map((e, i) => {
            if (item[e].path)
              return (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleClick(item[e]);
                  }}
                >
                  {item[e].STATUS &&
                    (item[e].STATUS === "True" ? (
                      <CircleIcon sx={{ color: "green", mr: 0.5 }} />
                    ) : (
                      <CircleIcon sx={{ color: "red", mr: 0.5 }} />
                    ))}
                  {e}
                </MenuItem>
              );
            return (
              <NestedMenuItem
                key={i}
                label={e}
                rightIcon={<ArrowRight />}
                menu={Object.keys(item[e]).map((key, index) => {
                  return (
                    <MenuLastItemStatus
                      item={item?.[e]?.[key]}
                      key={index}
                      handleClick={handleClick}
                      text={key}
                    />
                  );
                })}
              />
            );
          })}
        />
      </Box>
    </div>
  );
}

export default React.memo(MyMenuItems);
