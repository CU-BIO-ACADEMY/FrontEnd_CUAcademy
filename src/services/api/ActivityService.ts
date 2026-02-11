import { BaseService } from "./BaseService";

// ========== User Types ==========
export interface User {
    id: string;
    email: string;
    display_name: string;
    profile_image_url: string | null;
}

export interface StudentInfo {
    id: string;
    user_id: string;
    prefix: string;
    full_name: string;
    education_level: number;
    school: string;
}

export interface RegisteredUser {
    id: string;
    schedule_id: string;
    student_information_id: string;
    payment_status: "pending" | "approved" | "rejected";
    payment_file_id: string | null;
    payment_file_url: string | null;
    created_at: string;
    student_info: StudentInfo | null;
    user: User | null;
}

// ========== Schedule Types ==========
export interface ActivitySchedule {
    id: string;
    activity_id: string;
    event_start_at: string;
    price: number;
    max_users: number;
}

// Schedule สำหรับ list view (getAllActivities)
export interface ActivityScheduleWithUsers extends ActivitySchedule {
    users_registered: number;
    registered_users: RegisteredUser[];
}

// Schedule สำหรับ detail view (getActivityById)
export interface ActivityScheduleDetail extends ActivitySchedule {
    users_registered: number;
    available_spots: number;
    registered_users: RegisteredUser[];
}

// ========== Attachment Types ==========
export interface AttachmentFile {
    id: string;
    filename: string;
    mimetype: string;
    size: number;
    url: string;
}

export interface Attachment {
    id: string;
    file_id: string;
    file_type: string;
    display_name: string | null;
    file: AttachmentFile;
}

// ========== Activity Types ==========
// Base interface สำหรับข้อมูลพื้นฐาน
interface BaseActivity {
    id: string;
    title: string;
    description: string;
    description_short: string;
    registration_open_at: string;
    registration_close_at: string;
    users_registered: number;
    approved: boolean;
}

// สำหรับ list view (getAllActivities / getPublishedActivities / getUnpublishedActivities)
export interface ActivityListItem extends BaseActivity {
    thumbnail_url: string;
    price_range?: { min: number; max: number };
    price?: number;
    next_event_start_at?: string;
    schedules: ActivityScheduleWithUsers[];
    
    // Computed fields สำหรับ backward compatibility (เอาค่าจาก schedule แรก)
    max_users?: number;
    event_start_at?: string;
}

// สำหรับ detail view (getActivityById)
export interface ActivityDetail extends BaseActivity {
    thumbnail: AttachmentFile;
    attachments: Attachment[];
    price_range?: { min: number; max: number };
    price?: number;
    schedules: ActivityScheduleDetail[];
    
    // Computed fields สำหรับ backward compatibility
    max_users?: number;
    event_start_at?: string;
}

// Legacy interface สำหรับ backward compatibility
export type Activity = ActivityListItem;

// ========== DTO Types ==========
export interface JoinActivityDTO {
    student_information_id: string;
    schedule_ids: string[];
    slip?: File;
}

export interface CreateActivityScheduleDTO {
    event_start_at: string;
    price: number;
    max_users: number;
}

export interface CreateActivityDTO {
    title: string;
    description: string;
    description_short: string;
    registration_open_at: string;
    registration_close_at: string;
    schedules: CreateActivityScheduleDTO[];
    thumbnail: File;
    attachments?: File[];
}

export class ActivityService extends BaseService {
    constructor() {
        super("/activities");
    }

    async getAllActivities(): Promise<ActivityListItem[]> {
        return this.get<ActivityListItem[]>("/");
    }

    async getUnpublishedActivities(): Promise<ActivityListItem[]> {
        return this.get<ActivityListItem[]>("/unpublished");
    }

    async createActivity(data: CreateActivityDTO): Promise<{ message: string }> {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("description_short", data.description_short);
        formData.append("registration_open_at", data.registration_open_at);
        formData.append("registration_close_at", data.registration_close_at);
        // ส่ง schedules เป็น JSON string ตามที่ backend ต้องการ
        formData.append("schedules", JSON.stringify(data.schedules));
        formData.append("thumbnail", data.thumbnail);

        // เพิ่ม metadata สำหรับ attachments (ชื่อไฟล์)
        if (data.attachments && data.attachments.length > 0) {
            const attachmentsMetadata = data.attachments.map(file => ({
                display_name: file.name
            }));
            formData.append("attachments_metadata", JSON.stringify(attachmentsMetadata));
            
            data.attachments.forEach((file) => {
                formData.append("attachments", file);
            });
        }

        return this.postWithForm<{ message: string }>("/", formData);
    }

    async joinActivity(activityId: string, data: JoinActivityDTO): Promise<{ message: string }> {
        const formData = new FormData();
        formData.append("student_information_id", data.student_information_id);
        formData.append("schedule_ids", JSON.stringify(data.schedule_ids));
        if (data.slip) {
            formData.append("slip", data.slip);
        }
        return this.postWithForm<{ message: string }>(`/${activityId}/join`, formData);
    }

    async approveActivity(activityId: string): Promise<{ message: string }> {
        return this.post<{ message: string }>(`/${activityId}/approve`, {});
    }

    async getActivityById(activityId: string): Promise<ActivityDetail> {
        return this.get<ActivityDetail>(`/${activityId}`);
    }

    async updateRegistrationStatus(registrationId: string, status: "approved" | "rejected"): Promise<{ message: string }> {
        return this.patch<{ message: string }>(`/registrations/${registrationId}/status`, { status });
    }

    async getFileUrl(fileId: string): Promise<{ url: string }> {
        return this.get<{ url: string }>(`/files/${fileId}/url`);
    }
}
