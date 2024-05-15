import { User } from "./UserInterface";

export interface Broadcast {
    title: string;
    body: string;
    users: User["_id"][];
    status?: "pending" | "sent";
}