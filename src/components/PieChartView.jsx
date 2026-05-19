import { Card, CardContent, Typography } from '@mui/material';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { CATEGORY_COLORS, DEFAULT_CHART_COLORS } from '../constants/chartColors';

/**
 * Gets the chart color that matches a category name.
 */
const getCategoryColor = (categoryName, index) => (
    CATEGORY_COLORS[categoryName] ||
    DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]
);

/**
 * Displays a pie chart with total costs grouped by category.
 */
function PieChartView({ data }) {
    const hasChartData = Array.isArray(data) && data.length > 0;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Costs by Category
                </Typography>

                {!hasChartData ? (
                    <Typography>No chart data available.</Typography>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={120}
                                label
                            >
                                {data.map((categoryCost, index) => (
                                    <Cell
                                        key={`category-cost-${categoryCost.name}`}
                                        fill={getCategoryColor(categoryCost.name, index)}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default PieChartView;
