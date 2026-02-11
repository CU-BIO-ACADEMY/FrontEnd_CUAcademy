export enum Role{
    MEMBER = "member",
    ADMIN = "admin"
}

export interface User {
    id: string;
    email: string;
    display_name: string;
    balance: number;
    role: Role;
}

