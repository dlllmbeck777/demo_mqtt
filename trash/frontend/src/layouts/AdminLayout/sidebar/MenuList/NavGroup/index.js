import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { List, Typography } from '@mui/material';
import NavCollapse from "../NavCollapse/"
import NavItem from '../NavItem';

const NavGroup = ({ item }) => {
    const theme = useTheme();

    const items = item.children?.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={menu.id} menu={menu} level={1} />;
            case 'item':
                return <NavItem key={menu.id} item={menu} level={1} />;

        }
    });

    return (
        <>
            <List
                subheader={
                    item.title && (
                        <Typography sx={{ ...theme.typography.menuCaption, }} display="block" gutterBottom>
                            {item.title}
                            {item.caption && (
                                <Typography sx={{ ...theme.typography.subMenuCaption, padding: "0" }} display="block" gutterBottom>
                                    {item.caption}
                                </Typography>
                            )}
                        </Typography>
                    )
                }
                sx={{ border: "1px solid #ddd", padding: "1px" }}
            >
                {items}
            </List>
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;