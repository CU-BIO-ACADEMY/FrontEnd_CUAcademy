"use client";

import { HistoryTable } from "@/components/(main)/history/HistoryTable";
import { TablePagination } from "@/components/TablePagination";
import { api } from "@/services";
import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";

export const HistoryContainer = () => {
    const [offset, setOffset] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const handleFetch = async () => {
        const result = await api.transactionService.getTransactions(10, offset);

        setTransactions(result);
    };

    useEffect(() => {
        handleFetch();
    }, [offset]);

    const handleNext = () => setOffset((prev) => prev + 10);

    const handlePrev = () => setOffset((prev) => prev - 10);

    return (
        <HistoryTable
            transactions={transactions}
            bottomContent={<TablePagination handlePrev={handlePrev} handleNext={handleNext} />}
        />
    );
};
