import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography
} from '@mui/material';

const EXCHANGE_RATES_URL_KEY = 'exchangeRatesUrl';

function SettingsPage() {
    const [exchangeRatesUrl, setExchangeRatesUrl] = useState(
        localStorage.getItem(EXCHANGE_RATES_URL_KEY) || ''
    );
    const [successMessage, setSuccessMessage] = useState('');

    const handleSave = () => {
        const trimmedUrl = exchangeRatesUrl.trim();

        localStorage.setItem(EXCHANGE_RATES_URL_KEY, trimmedUrl);
        setExchangeRatesUrl(trimmedUrl);
        setSuccessMessage('Exchange rates URL saved.');
    };

    return (
        <Box>
            <Typography variant='h4' gutterBottom>
                Settings
            </Typography>

            <Card>
                <CardContent>
                    <Stack spacing={3}>
                        {successMessage && (
                            <Alert severity='success'>{successMessage}</Alert>
                        )}

                        <Typography variant='h6'>
                            Exchange Rates URL
                        </Typography>

                        <TextField
                            label='Custom exchange rates JSON URL'
                            value={exchangeRatesUrl}
                            onChange={(event) => setExchangeRatesUrl(event.target.value)}
                            fullWidth
                            placeholder='https://example.com/rates.json'
                        />

                        <Button variant='contained' onClick={handleSave}>
                            Save URL
                        </Button>

                        <Typography color='text.secondary'>
                            If no custom URL is provided, the app uses the default exchange rates URL.
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

export default SettingsPage;
