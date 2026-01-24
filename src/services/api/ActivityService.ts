import { BaseService } from "./BaseService";

export interface CreateActivityData {
    title: string;
    description: string;
    description_short: string;
    max_users: number;
    price: number;
    registration_open_at: Date;
    registration_close_at: Date;
    event_start_at: Date;
    thumbnail: File;
}

export interface Activity {
    id: string;
    owner_id: string;
    title: string;
    thumbnail_file_id: string;
    thumbnail_url: string;
    description: string;
    description_short: string;
    max_users: number;
    price: number;
    event_start_at: string;
    registration_open_at: string;
    registration_close_at: string;
    approved?: boolean;
    users_registered?: number;
}

export class ActivityService extends BaseService {
    constructor() {
        super("/activities");
    }

    async createActivity(data: CreateActivityData) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("description_short", data.description_short);
        formData.append("max_users", data.max_users.toString());
        formData.append("price", data.price.toString());
        formData.append("registration_open_at", data.registration_open_at.toISOString());
        formData.append("registration_close_at", data.registration_close_at.toISOString());
        formData.append("event_start_at", data.event_start_at.toISOString());
        formData.append("thumbnail", data.thumbnail);

        return this.postWithForm("/", formData);
    }

    async getAllActivities(): Promise<Activity[]> {
        return this.get<Activity[]>("/");
    }

    async getUnpublishedActivities(): Promise<Activity[]> {
        return this.get<Activity[]>("/unpublished");
    }

    async approveActivity(id: string): Promise<void> {
        return this.post(`/${id}/approve`, {});
    }
}
