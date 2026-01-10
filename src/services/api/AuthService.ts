import { User } from "@/types/user";
import { BaseService } from "./BaseService";

export class AuthService extends BaseService {
    constructor() {
        super("/auth");
    }

    async getUser() {
        return this.get<User | null>("/me");
    }

    async getGoogleLoginURL() {
        return this.get<{ url: string }>("/google");
    }

    async logout() {
        await this.post("/logout", {})
    }
}
