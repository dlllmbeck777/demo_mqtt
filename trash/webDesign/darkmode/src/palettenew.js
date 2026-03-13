import { useState } from 'react';
import './App.css';
import ButtonAppBar from './AppBar';
import { PaletteMode, getDesignTokens } from '@mui/material';
import SimpleCard from './Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { amber, lightGreen, deepOrange, lime, lightBlue, green, cyan, deepPurple } from '@mui/material/colors'
import darkMode from './App';


const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: amber,
                divider: amber[200],
                text: {
                    primary: grey[900],
                    secondary: grey[800],
                },
            }
            : {
                // palette values for dark mode
                primary: deepOrange,
                divider: deepOrange[700],
                background: {
                    default: deepOrange[900],
                    paper: deepOrange[900],
                },
                text: {
                    primary: '#fff',
                    secondary: grey[500],
                },
            }),
    },


});



