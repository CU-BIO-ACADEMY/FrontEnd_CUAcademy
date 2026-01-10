import { AuthService } from "./api/AuthService";
import { PaymentService } from "./api/PaymentService";

class ApiClient {
    private static instance: ApiClient;

    public readonly authService: AuthService;
    public readonly paymentService: PaymentService;

    private constructor() {
        this.authService = new AuthService();
        this.paymentService = new PaymentService();
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
