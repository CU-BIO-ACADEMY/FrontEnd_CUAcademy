import { BaseService } from "./BaseService";

export class PaymentService extends BaseService {
    constructor() {
        super("/payment");
    }

    async topup(form: FormData) {
        return this.postWithForm<{ message: string }>("/", form);
    }
}
