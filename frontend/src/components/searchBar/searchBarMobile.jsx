import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import { setFocus, setBlur, setText } from "../../services/actions/searchBar";

const SearchBarMobile = () => {
  const dispatch = useDispatch();
  const searchBar = useSelector((state) => state.searchBar);
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.status.success,
    "&:hover": {
      backgroundColor: theme.palette.status.info,
    },
    marginLeft: 0,
    width: "100%",
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.text.secondary,
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
    },
  }));
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon sx={{ color: "icon.secondary" }} />
      </SearchIconWrapper>
      <StyledInputBase
        key="search"
        value={searchBar.text}
        onClick={() => {
          dispatch(setFocus());
        }}
        onBlur={() => {
          dispatch(setBlur());
        }}
        onChange={(e) => {
          dispatch(setText(e.target.value));
        }}
        sx={{
          fontSize: "1.1rem",
          input: {
            "&:hover": {
              "&::placeholder": {
                opacity: 1,
              },
            },
            "&:focus": {
              "&::placeholder": {
                opacity: 1,
              },
            },
          },
        }}
        autoFocus={searchBar.isFocus}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
      />
    </Search>
  );
};

export default SearchBarMobile;
