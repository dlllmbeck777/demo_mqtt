import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar'
import App from "./App"



export default function ButtonAppBar({ check, change }) {


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar color='primary' enableColorOnDark position="static">

                <Toolbar color='primary'>
                    <Avatar sx={{ marginLeft: 2 }} >H</Avatar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Defity[3]
                    </Typography>

                    <Switch
                        defaultChecked
                        onChange={change}
                        checked={check}

                    />

                </Toolbar>
            </AppBar>
        </Box>
    );
}
