export interface Transaction {
    id: string;
    amount: number;
    balance_before: number;
    balance_after: number;
    user_id: string;
    transaction_type: "topup" | "payment";
    created_at: string;
}
