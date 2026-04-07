import { Request } from "express"

export type Role = "ADMIN" | "CASHIER" | "CONTROLLER"

export interface User {
    id: number,
    fullname: string,
    email: string,
    password: string,
    role: Role,
    isActive: boolean
}

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number,
        fullname: string,
        email: string,
        role: Role,
    } | null
}