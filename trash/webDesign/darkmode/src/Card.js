import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Container } from '@mui/material';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

export default function BasicCard() {
    return (
        <Container fixed>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card sx={{ marginTop: 4 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14, textAlign: "left" }} color="secondary" gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            </Typography>
                            <Typography variant="h5" component="div">
                                be{bull}nev{bull}o{bull}lent
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="secondary">
                                adjective
                            </Typography>
                            <Typography sx={{ textAlign: "left" }} variant="body2">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                                <br />
                                {'"a benevolent smile"'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </Grid>


                <Grid item xs={6}>
                    <Card sx={{ marginTop: 4 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14, textAlign: "left" }} color="primary" gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            </Typography>
                            <Typography variant="h5" component="div">
                                be{bull}nev{bull}o{bull}lent
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="primary">
                                adjective
                            </Typography>
                            <Typography sx={{ textAlign: "left" }} variant="body2">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                                <br />
                                {'"a benevolent smile"'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </Grid>

            </Grid>
        </Container>

    );
}
