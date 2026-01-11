import { Transaction } from "@/types/transaction";
import { BaseService } from "./BaseService";

export class TransactionService extends BaseService {
    constructor() {
        super("/transactions");
    }

    getTransactions(limit: number, offsets: number) {
        return this.get<Transaction[]>(`/?limit=${limit}&offset=${offsets}`);
    }
}
