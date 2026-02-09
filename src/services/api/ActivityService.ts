import { BaseService } from "./BaseService";

export interface Activity {
    id: string;
    title: string;
    description: string;
    description_short: string;
    max_users: number;
    price: number;
    thumbnail_url: string;
    users_registered: number;
    approved: boolean;
    event_start_at: string;
    registration_open_at: string;
    registration_close_at: string;
}

export interface JoinActivityDTO {
    student_information_id: string;
}

export interface CreateActivityDTO {
    title: string;
    description: string;
    description_short: string;
    max_users: number;
    price: number;
    registration_open_at: string;
    registration_close_at: string;
    event_start_at: string;
    thumbnail: File;
    attachments?: File[];
}

export class ActivityService extends BaseService {
    constructor() {
        super("/activities");
    }

    async getAllActivities(): Promise<Activity[]> {
        return this.get<Activity[]>("/");
    }

    async getUnpublishedActivities(): Promise<Activity[]> {
        return this.get<Activity[]>("/unpublished");
    }

    async createActivity(data: CreateActivityDTO): Promise<{ message: string }> {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("description_short", data.description_short);
        formData.append("max_users", data.max_users.toString());
        formData.append("price", data.price.toString());
        formData.append("registration_open_at", data.registration_open_at);
        formData.append("registration_close_at", data.registration_close_at);
        formData.append("event_start_at", data.event_start_at);
        formData.append("thumbnail", data.thumbnail);

        if (data.attachments) {
            data.attachments.forEach((file) => {
                formData.append("attachments", file);
            });
        }

        return this.postWithForm<{ message: string }>("/", formData);
    }

    async joinActivity(activityId: string, data: JoinActivityDTO): Promise<{ message: string }> {
        return this.post<{ message: string }>(`/${activityId}/join`, data);
    }

    async approveActivity(activityId: string): Promise<{ message: string }> {
        return this.post<{ message: string }>(`/${activityId}/approve`, {});
    }
}
