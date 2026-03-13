import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

import { setBlur, setFocus, setText } from "../../services/actions/searchBar";

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const SearchBar = (props) => {
  const dispatch = useDispatch();
  const searchBar = useSelector((state) => state.searchBar);
  const { searchBarSize, searchBarTheme } = props;
  const Search = styled("div")(({ theme }) => {
    return {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: "icon.main",
      "&:hover": {
        backgroundColor: searchBarTheme === "dark" ? "#ffffff22" : "#00000022",
      },
      marginLeft: 0,
      width: "100%",
    };
  });
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: searchBarTheme === "dark" ? "#ffffff" : "#000000",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        width: "0ch",
      },

      [theme.breakpoints.up("sm")]: {
        width: searchBar.isFocus
          ? searchBarSize.sm.focus
          : searchBarSize.sm.blur,
      },
      [theme.breakpoints.up("md")]: {
        width: searchBar.isFocus
          ? searchBarSize.md.focus
          : searchBarSize.md.blur,
      },
      [theme.breakpoints.up("lg")]: {
        width: searchBar.isFocus
          ? searchBarSize.lg.focus
          : searchBarSize.lg.blur,
      },
      [theme.breakpoints.up("xl")]: {
        width: searchBar.isFocus
          ? searchBarSize.xl.focus
          : searchBarSize.xl.blur,
      },
    },
  }));
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        value={searchBar.text}
        onClick={(e) => {
          dispatch(setFocus());
        }}
        onBlur={() => {
          dispatch(setBlur());
        }}
        onChange={(e) => {
          dispatch(setText(e.target.value));
        }}
        sx={{
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
export default SearchBar;
