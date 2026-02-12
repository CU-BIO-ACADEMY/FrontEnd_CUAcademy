export interface ApplicantActivity {
    activityId: string;
    activityTitle: string;
    paymentStatus: "pending" | "approved" | "rejected";
}

export interface Applicant {
    id: string;
    prefix: string;
    studentName: string;
    educationLevel: string;
    schoolName: string;
    foodAllergy?: string;
    parentName: string;
    parentEmail: string;
    backupEmail: string;
    createdAt: string;
    status?: "pending" | "approved" | "rejected";
    parentTel: string;
    activities?: ApplicantActivity[];
}

export const educationLevelMap: Record<string, number> = {
    "ม. 2": 2,
    "ม. 3": 3,
    "ม. 4": 4,
    "ม. 5": 5,
    "ม. 6": 6,
};

export const educationLevelReverseMap: Record<number, string> = {
    2: "ม. 2",
    3: "ม. 3",
    4: "ม. 4",
    5: "ม. 5",
    6: "ม. 6",
};
