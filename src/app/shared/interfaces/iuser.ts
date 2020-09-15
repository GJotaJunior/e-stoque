export interface IUser {
    uid?: string;
    name: string;
    email: string;
    isActive: boolean;
    isAdmin: boolean;
    registerBy: string;
    inactivatedDate?: Date;
}
