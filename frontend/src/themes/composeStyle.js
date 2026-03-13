import React from "react";
import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import themeTypography from "./typography";
import * as locales from '@mui/material/locale';
import { useSelector } from "react-redux";

const ComposeStyle = () => {
    const theme = useSelector(state => state.lang?.cultur)
    const myTheme = createTheme({
        palette: palette(),
        typography: themeTypography()
    }, locales[theme?.replace(/-/g, "")]);
    return myTheme
}

export default ComposeStyle



