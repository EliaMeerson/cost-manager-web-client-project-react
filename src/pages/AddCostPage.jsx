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
import { addCost } from '../db/db';

const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

const CATEGORIES = [
    'FOOD',
    'CAR',
    'EDUCATION',
    'ENTERTAINMENT',
    'HEALTH',
    'SHOPPING',
    'OTHER'
];

const INITIAL_FORM_DATA = {
    sum: '',
    currency: 'USD',
    category: 'FOOD',
    description: ''
};

function AddCostPage() {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    const isFormValid = () => {
        const costSum = Number(formData.sum);

        if (!formData.sum || costSum <= 0) {
            setErrorMessage('Sum must be greater than 0.');
            return false;
        }

        if (!formData.description.trim()) {
            setErrorMessage('Description is required.');
            return false;
        }

        return true;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        clearMessages();

        if (!isFormValid()) {
            return;
        }

        const newCost = addCost({
            sum: Number(formData.sum),
            currency: formData.currency,
            category: formData.category,
            description: formData.description.trim()
        });

        setSuccessMessage(`Cost added successfully: ${newCost.description}`);
        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <Box>
            <Typography variant='h4' gutterBottom>
                Add New Cost
            </Typography>

            <Card>
                <CardContent>
                    <Box component='form' onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {successMessage && (
                                <Alert severity='success'>{successMessage}</Alert>
                            )}
                            {errorMessage && (
                                <Alert severity='error'>{errorMessage}</Alert>
                            )}

                            <TextField
                                label='Sum'
                                name='sum'
                                type='number'
                                value={formData.sum}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                select
                                label='Currency'
                                name='currency'
                                value={formData.currency}
                                onChange={handleChange}
                                fullWidth
                            >
                                {CURRENCIES.map((currency) => (
                                    <MenuItem key={currency} value={currency}>
                                        {currency}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                label='Category'
                                name='category'
                                value={formData.category}
                                onChange={handleChange}
                                fullWidth
                            >
                                {CATEGORIES.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label='Description'
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                            />

                            <Button type='submit' variant='contained' size='large'>
                                Add Cost
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default AddCostPage;
