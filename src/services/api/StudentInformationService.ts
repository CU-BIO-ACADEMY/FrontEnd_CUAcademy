import { BaseService } from "./BaseService";

export interface StudentInformation {
    id: string;
    user_id: string;
    prefix: string;
    full_name: string;
    education_level: number;
    school: string;
    food_allergies: string | null;
    parent_name: string;
    parent_email: string;
    secondary_email: string | null;
    phone_number: string;
    created_at: string;
    updated_at: string;
}

export interface CreateStudentInformationDTO {
    prefix: string;
    full_name: string;
    education_level: number;
    school: string;
    food_allergies?: string;
    parent_name: string;
    parent_email: string;
    secondary_email?: string;
    phone_number: string;
}

export interface UpdateStudentInformationDTO extends Partial<CreateStudentInformationDTO> {}

export interface StudentInformationExistsResponse {
    exists: boolean;
}

export class StudentInformationService extends BaseService {
    constructor() {
        super("/student-information");
    }

    async getStudentInformation(): Promise<StudentInformation> {
        return this.get<StudentInformation>("/");
    }

    async getAllStudentInformation(): Promise<StudentInformation[]> {
        return this.get<StudentInformation[]>("/all");
    }

    async createStudentInformation(
        data: CreateStudentInformationDTO
    ): Promise<{ message: string }> {
        return this.post<{ message: string }>("/", data);
    }

    async updateStudentInformation(
        id: string,
        data: UpdateStudentInformationDTO
    ): Promise<{ message: string }> {
        return this.put<{ message: string }>(`/${id}`, data);
    }

    async deleteStudentInformation(id: string): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/${id}`);
    }

    async checkExists(): Promise<StudentInformationExistsResponse> {
        return this.get<StudentInformationExistsResponse>("/exists");
    }
}
