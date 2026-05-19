import { useState } from 'react';
import {
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
import PieChartView from '../components/PieChartView';
import BarChartView from '../components/BarChartView';

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

const MONTH_SHORT_NAMES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

const getCostValue = (cost) => {
    if (typeof cost.convertedSum === 'number') {
        return cost.convertedSum;
    }

    return Number(cost.sum);
};

const buildPieChartData = (costs) => {
    const categoryTotals = {};

    costs.forEach((cost) => {
        const costValue = getCostValue(cost);

        if (!categoryTotals[cost.category]) {
            categoryTotals[cost.category] = 0;
        }

        categoryTotals[cost.category] += costValue;
    });

    return Object.keys(categoryTotals).map((category) => ({
        name: category,
        value: Number(categoryTotals[category].toFixed(2))
    }));
};

function ChartsPage() {
    const currentDate = new Date();

    const [currency, setCurrency] = useState('USD');
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [pieData, setPieData] = useState([]);
    const [barData, setBarData] = useState([]);

    const buildBarChartData = async (selectedYear, selectedCurrency) => {
        const monthlyTotals = [];

        for (let monthIndex = 1; monthIndex <= 12; monthIndex += 1) {
            const monthlyReport = await getReport(
                selectedCurrency,
                selectedYear,
                monthIndex
            );

            monthlyTotals.push({
                month: MONTH_SHORT_NAMES[monthIndex - 1],
                total: monthlyReport.total.sum
            });
        }

        return monthlyTotals;
    };

    const buildCharts = async () => {
        const selectedYear = Number(year);
        const selectedMonth = Number(month);

        /* The pie chart uses the selected month, while the bar chart scans the whole year. */
        const monthlyReport = await getReport(currency, selectedYear, selectedMonth);
        const yearlyMonthlyTotals = await buildBarChartData(selectedYear, currency);

        setPieData(buildPieChartData(monthlyReport.costs));
        setBarData(yearlyMonthlyTotals);
    };

    return (
        <Box>
            <Typography variant='h4' gutterBottom>
                Charts
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

                        <Button variant='contained' onClick={buildCharts}>
                            Generate Charts
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Stack spacing={3}>
                <PieChartView data={pieData} />
                <BarChartView data={barData} />
            </Stack>
        </Box>
    );
}

export default ChartsPage;
