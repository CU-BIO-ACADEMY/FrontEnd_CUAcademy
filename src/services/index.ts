import { AuthService } from "./api/AuthService";
import { PaymentService } from "./api/PaymentService";
import { ActivityService } from "./api/ActivityService";
import { TransactionService } from "./api/TransactionService";

class ApiClient {
    private static instance: ApiClient;

    public readonly authService: AuthService;
    public readonly paymentService: PaymentService;
    public readonly activityService: ActivityService;
    public readonly transactionService: TransactionService;

    private constructor() {
        this.authService = new AuthService();
        this.paymentService = new PaymentService();
        this.activityService = new ActivityService();
        this.transactionService = new TransactionService();
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    public static resetInstance(): void {
        ApiClient.instance = null as any;
    }
}

export const api = ApiClient.getInstance();
