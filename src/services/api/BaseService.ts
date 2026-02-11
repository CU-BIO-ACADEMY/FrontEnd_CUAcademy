import { formApiFetch, normalApiFetch } from "@/lib/api";

export class BaseService {
    protected baseURL: string;

    constructor(baseURL: string) {
        if (process.env.NODE_ENV === "production") {
            this.baseURL = "/api" + baseURL;
        } else {
            this.baseURL = "http://localhost:8000/api" + baseURL;
        }
    }

    protected async get<T>(endpoint: string): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        return await normalApiFetch(url);
    }

    protected async getWithOptions<T>(endpoint: string, options: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        return await normalApiFetch(url, options);
    }

    protected async post<T>(endpoint: string, data: unknown): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return await normalApiFetch(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    protected async postWithForm<T>(endpoint: string, data: FormData): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return await formApiFetch(url, {
            method: "POST",
            body: data,
        });
    }

    protected async put<T>(endpoint: string, data: unknown): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return await normalApiFetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    protected async patch<T>(endpoint: string, data: unknown): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return await normalApiFetch(url, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    protected async delete<T>(endpoint: string): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return await normalApiFetch(url, { method: "DELETE" });
    }
}
