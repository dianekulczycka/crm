import {IStat} from "../order/IStat";

export interface IManager {
    id: number;
    email: string;
    name: string;
    surname: string;
    isActive: boolean;
    lastLogin: string | null;
    isBanned: boolean;
    stats?: IStat[];
}