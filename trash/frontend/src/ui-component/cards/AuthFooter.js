// material-ui
import { Link, Typography, Stack } from '@mui/material';

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link}  target="_blank" underline="hover">
            Ligeia
        </Typography>
        <Typography variant="subtitle2" component={Link}  target="_blank" underline="hover">
            &copy; KazAtomProm
        </Typography>
    </Stack>
);

export default AuthFooter;
