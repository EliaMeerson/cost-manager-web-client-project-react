import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { getReport } from '../db/db';
import ReportTable from '../components/ReportTable';

const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

const MONTHS = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
];

function ReportPage() {
    const currentDate = new Date();

    const [currency, setCurrency] = useState('USD');
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [report, setReport] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleGenerateReport = async () => {
        try {
            const selectedYear = Number(year);
            const selectedMonth = Number(month);

            setErrorMessage('');

            // The report function is asynchronous because it fetches exchange rates.
            const monthlyReport = await getReport(
                currency,
                selectedYear,
                selectedMonth
            );

            setReport(monthlyReport);
        } catch (error) {
            setErrorMessage('Failed to generate report');
            console.error(error);
        }
    };

    return (
        <Box>
            <Typography variant='h4' gutterBottom>
                Monthly Report
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField
                            select
                            label='Month'
                            value={month}
                            onChange={(event) => setMonth(event.target.value)}
                            fullWidth
                        >
                            {MONTHS.map((monthOption) => (
                                <MenuItem key={monthOption.value} value={monthOption.value}>
                                    {monthOption.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label='Year'
                            type='number'
                            value={year}
                            onChange={(event) => setYear(event.target.value)}
                            fullWidth
                        />

                        <TextField
                            select
                            label='Currency'
                            value={currency}
                            onChange={(event) => setCurrency(event.target.value)}
                            fullWidth
                        >
                            {CURRENCIES.map((currencyOption) => (
                                <MenuItem key={currencyOption} value={currencyOption}>
                                    {currencyOption}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            variant='contained'
                            onClick={handleGenerateReport}
                            sx={{ minWidth: 180 }}
                        >
                            Generate
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}

            {report && (
                <>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant='h6'>
                                Total: {report.total.sum} {report.total.currency}
                            </Typography>

                            <Typography color='text.secondary'>
                                Report for {report.month}/{report.year}
                            </Typography>
                        </CardContent>
                    </Card>

                    <ReportTable costs={report.costs} />
                </>
            )}
        </Box>
    );
}

export default ReportPage;
