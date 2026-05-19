import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

/**
 * Formats a cost date object as day/month/year text.
 */
const formatCostDate = (date) => `${date.day}/${date.month}/${date.year}`;

/**
 * Displays the detailed monthly costs report in a table.
 */
function ReportTable({ costs }) {
    const hasCosts = Array.isArray(costs) && costs.length > 0;

    if (!hasCosts) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography>No costs found for this month.</Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Original Sum</TableCell>
                        <TableCell>Converted Sum</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {costs.map((cost, index) => (
                        <TableRow key={`${cost.description}-${index}`}>
                            <TableCell>{formatCostDate(cost.date)}</TableCell>
                            <TableCell>{cost.category}</TableCell>
                            <TableCell>{cost.description}</TableCell>
                            <TableCell>{`${cost.sum} ${cost.currency}`}</TableCell>
                            <TableCell>{`${cost.convertedSum} ${cost.convertedCurrency}`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ReportTable;
