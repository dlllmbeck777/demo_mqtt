import { React, useState } from 'react';
import './App.css';
import ButtonAppBar from './AppBar';
import SimpleCard from './Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { lightGreen, yellow, grey, red, deepOrange, lime, lightBlue, green, cyan, deepPurple, blue } from '@mui/material/colors'
import { dark, light } from '@mui/material/styles/createPalette';






function App() {

  const [darkMode, SetDarkMode] = useState(false);

  const darkTheme = createTheme({
    palette:
    {
      mode: darkMode ? "dark" : "light",

      primary: {

        main: darkMode ? lime[900] : lime[200],
      },

      secondary: {
        main: darkMode ? red[900] : red[200],
      },

      text: {
        primary: darkMode ? green[900] : green[200],
      },

      Paper: {
        primary: 
      }



      /*text: {
        primary: {
          light: grey[900],
          main: grey[100],
          dark: grey[100],

        }

        secondary: grey[900],
        },
        background: {
          light: grey[100],
          default: grey[100],
          dark: grey[900],
        },


      }*/

    }
  });

  return (
    <ThemeProvider theme={darkTheme} >


      <Paper enableColorOnDark style={{ height: "250vh" }}>
        <div className="App">
          <ButtonAppBar check={darkMode} change={() => SetDarkMode(!darkMode)} >
            <h1>Dark Mode</h1>
          </ButtonAppBar>

          <SimpleCard >

          </SimpleCard>

        </div>
      </Paper>
    </ThemeProvider >
  );
}

export default App;
