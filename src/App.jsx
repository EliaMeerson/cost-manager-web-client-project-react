import { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import AddCostPage from './pages/AddCostPage';
import ReportPage from './pages/ReportPage';
import ChartsPage from './pages/ChartsPage';
import SettingsPage from './pages/SettingsPage';
import { openCostsDB } from './db/db';

const DATABASE_NAME = 'CostManagerDB';
const DATABASE_VERSION = 1;
const DEFAULT_PAGE = 'add';

function App() {
    const [page, setPage] = useState(DEFAULT_PAGE);

    // Initializing database, runs once
    useEffect(() => {
        openCostsDB(DATABASE_NAME, DATABASE_VERSION);
    }, []);

    // The selected page is rendered according to the navbar state.
    const renderPage = () => {
        switch (page) {
            case 'add':
                return <AddCostPage />;
            case 'report':
                return <ReportPage />;
            case 'charts':
                return <ChartsPage />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <AddCostPage />;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
            <Navbar currentPage={page} onChangePage={setPage} />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {renderPage()}
            </Container>
        </Box>
    );
}

export default App;
