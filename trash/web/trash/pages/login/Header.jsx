import * as React from 'react';

import { Grid, Link, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import logo from '../../assets/Images/header/Logo.png'
import logoKazatomprom from '../../assets/Images/header/Group 1.png'

import LangSelector from '../../components/LangSelector'

const Mobil = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      display: "none",
    }
  }));
  const Pc = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
      display: "none",
    }
  }));
const Header = () => {
    return (
        <Box sx={{backgroundColor:"#ffffff"}}>
            <Mobil>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item sx={{ml: 2}}>
                        <Link href="/" sx={{ color: "inherit"}}>
                            <Grid item>
                                <img src={logo} alt="" />
                            </Grid>
                        </Link>
                    </Grid>
                    <Grid item>
                        <LangSelector/>
                    </Grid>
                </Grid>
            </Mobil>
            <Pc>
                <Grid textAlign="center">
                    <img src={logoKazatomprom} alt="" />
                </Grid>
            </Pc>
        </Box>
    );
}

export default Header