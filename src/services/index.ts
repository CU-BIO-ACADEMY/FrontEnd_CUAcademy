import { AuthService } from "./api/AuthService";
import { PaymentService } from "./api/PaymentService";
import { ActivityService } from "./api/ActivityService";
import { TransactionService } from "./api/TransactionService";
import { StudentInformationService } from "./api/StudentInformationService";

class ApiClient {
    private static instance: ApiClient;

    public readonly authService: AuthService;
    public readonly paymentService: PaymentService;
    public readonly activityService: ActivityService;
    public readonly transactionService: TransactionService;
    public readonly studentInformationService: StudentInformationService;

    private constructor() {
        this.authService = new AuthService();
        this.paymentService = new PaymentService();
        this.activityService = new ActivityService();
        this.transactionService = new TransactionService();
        this.studentInformationService = new StudentInformationService();
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
