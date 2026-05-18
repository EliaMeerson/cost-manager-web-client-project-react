/* eslint-disable react-hooks/set-state-in-effect */
// src/context/CostContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { openCostsDB, addCost, getReport } from '../db/db';

const CostContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCosts = () => useContext(CostContext);

export const CostProvider = ({ children }) => {
    const [report, setReport] = useState(null);
    const [currency, setCurrency] = useState('USD');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const refreshReport = useCallback(async () => {
        const data = await getReport(currency, year, month);
        setReport(data);
    }, [currency, month, year]);

    useEffect(() => {
        openCostsDB("CostManagerReactDB", 1);
        refreshReport().catch(console.error);
    }, [refreshReport]);

    const addNewCost = async (costData) => {
        addCost(costData);
        await refreshReport();
    };

    return (
        <CostContext.Provider value={{
            report,
            currency, setCurrency,
            month, setMonth,
            year, setYear,
            addNewCost
        }}>
            {children}
        </CostContext.Provider>
    );
};