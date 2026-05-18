// src/db/db.js

const DEFAULT_RATES_URL = "https://eliameerson.github.io/currency-api/rates.json";
let _dbName = "CostManagerReactDB";

// Initialize the database if it doesn't exist yet
export const openCostsDB = (databaseName, databaseVersion) => {
    _dbName = databaseName;
    if (!localStorage.getItem(_dbName)) {
        localStorage.setItem(_dbName, JSON.stringify([]));
    }
    console.log(`Database "${_dbName}" (v${databaseVersion}) is ready.`);
};

// Add a new cost item and automatically append today's date
export const addCost = (cost) => {
    const costs = JSON.parse(localStorage.getItem(_dbName)) || [];

    const newCost = {
        sum: Number(cost.sum),
        currency: cost.currency,
        category: cost.category,
        description: cost.description,
        date: {
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        }
    };

    costs.push(newCost);
    localStorage.setItem(_dbName, JSON.stringify(costs));
    return newCost;
};

// Fetch exchange rates from the API (with a hardcoded fallback)
const fetchRates = async (customUrl) => {
    const url = customUrl || DEFAULT_RATES_URL;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch rates, using fallback", error);
        return { "USD": 1, "ILS": 3.4, "GBP": 0.6, "EURO": 0.7 };
    }
};

// Filter costs by month/year and calculate the total in the requested currency
export const getReport = async (targetCurrency, year, month) => {
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || (new Date().getMonth() + 1);
    const costs = JSON.parse(localStorage.getItem(_dbName)) || [];
    const rates = await fetchRates();

    const filteredCosts = costs.filter(c =>
        c.date.month === currentMonth && c.date.year === currentYear
    );

    let totalSum = 0;

    const processedCosts = filteredCosts.map(c => {
        const sumInUSD = c.sum / rates[c.currency];
        const convertedSum = sumInUSD * rates[targetCurrency];
        totalSum += convertedSum;
        return { ...c };
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