// src/db/db.js

const DEFAULT_RATES_URL = 'https://eliameerson.github.io/currency-api/rates.json';
let activeDatabaseName = 'CostManagerReactDB';

// Initialize the database if it does not exist yet.
export const openCostsDB = (databaseName, databaseVersion) => {
    activeDatabaseName = databaseName;

    if (!localStorage.getItem(activeDatabaseName)) {
        localStorage.setItem(activeDatabaseName, JSON.stringify([]));
    }

    console.log(`Database '${activeDatabaseName}' (v${databaseVersion}) is ready.`);

    return {
        addCost,
        getReport
    };
};

// Add a new cost item and automatically append today's date.
export const addCost = (cost) => {
    const storedCosts = localStorage.getItem(activeDatabaseName);
    const costs = storedCosts ? JSON.parse(storedCosts) : [];
    const currentDate = new Date();

    const newCost = {
        sum: Number(cost.sum),
        currency: cost.currency,
        category: cost.category,
        description: cost.description,
        date: {
            day: currentDate.getDate(),
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        }
    };

    costs.push(newCost);
    localStorage.setItem(activeDatabaseName, JSON.stringify(costs));

    return newCost;
};

// Fetch exchange rates from the API and use fallback rates if the request fails.
const fetchRates = async (customUrl) => {
    const ratesUrl = customUrl || DEFAULT_RATES_URL;

    try {
        const response = await fetch(ratesUrl);

        if (!response.ok) {
            throw new Error('Exchange rates request failed.');
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch rates, using fallback.', error);

        return {
            USD: 1,
            ILS: 3.4,
            GBP: 0.6,
            EURO: 0.7
        };
    }
};

// Filter costs by month and year, then calculate the total in the requested currency.
export const getReport = async (targetCurrency, year, month) => {
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;
    const storedCosts = localStorage.getItem(activeDatabaseName);
    const costs = storedCosts ? JSON.parse(storedCosts) : [];
    const savedUrl = localStorage.getItem('exchangeRatesUrl');
    const rates = await fetchRates(savedUrl);

    const filteredCosts = costs.filter((cost) => (
        cost.date.month === currentMonth &&
        cost.date.year === currentYear
    ));

    let totalSum = 0;

    const processedCosts = filteredCosts.map((cost) => {
        const sumInUsd = cost.sum / rates[cost.currency];
        const convertedSum = sumInUsd * rates[targetCurrency];

        totalSum += convertedSum;

        return {
            ...cost,
            convertedSum: Number(convertedSum.toFixed(2)),
            convertedCurrency: targetCurrency
        };
    });

    return {
        year: currentYear,
        month: currentMonth,
        costs: processedCosts,
        total: {
            currency: targetCurrency,
            sum: Number(totalSum.toFixed(2))
        }
    };
};