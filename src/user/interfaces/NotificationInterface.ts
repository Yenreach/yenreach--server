import { User } from "./UserInterface";

export interface Notification {
    title: string;
    body: string;
    user: User["_id"]
    status?: "pending" | "sent";
    data?: any[];
}