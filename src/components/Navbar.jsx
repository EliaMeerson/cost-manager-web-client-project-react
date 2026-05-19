import {
    AppBar,
    Button,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';

const PAGES = [
    { id: 'add', label: 'Add Cost' },
    { id: 'report', label: 'Monthly Report' },
    { id: 'charts', label: 'Charts' },
    { id: 'settings', label: 'Settings' }
];

/**
 * Displays the main navigation bar for the Cost Manager application.
 */
function Navbar({ currentPage, onChangePage }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Cost Manager
                </Typography>

                <Stack direction="row" spacing={1}>
                    {PAGES.map((page) => (
                        <Button
                            key={page.id}
                            color="inherit"
                            variant={currentPage === page.id ? 'outlined' : 'text'}
                            onClick={() => onChangePage(page.id)}
                        >
                            {page.label}
                        </Button>
                    ))}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
