import { Card, CardContent, Typography } from '@mui/material';
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { DEFAULT_CHART_COLORS } from '../constants/chartColors';

/**
 * Displays a bar chart with the total costs for each month.
 */
function BarChartView({ data }) {
    const hasChartData = Array.isArray(data) && data.length > 0;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Monthly Costs in Selected Year
                </Typography>

                {!hasChartData ? (
                    <Typography>No chart data available.</Typography>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill={DEFAULT_CHART_COLORS[7]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default BarChartView;
