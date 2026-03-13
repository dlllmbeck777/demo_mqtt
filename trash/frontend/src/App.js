import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Routes from './routes/index';
import themes from './themes';
import NavigationScroll from './layouts/NavigationScroll';



function App() {
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <NavigationScroll>
          <Routes navigate={navigate} />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App