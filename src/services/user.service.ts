import { hashPassword, validatePassword } from './../utils/password';
import { User } from "../models";
import { Op } from 'sequelize';

type ListQuery = {
    page?: number;
    limit?: number;
    search?: string;
    /** When "true" or "1", list active and inactive users. Otherwise only isActive === true. */
    includeInactive?: string;
}
type CreateUserInput = {
    fullName: string;
    email: string;
    password: string;
    role: "ADMIN" | "CASHIER" | "CONTROLLER";
}

const normalizeEmail = (email: string) => email.trim().toLocaleLowerCase();


export const UserService = {
    async list(query: ListQuery) {
        const page = query.page && query.page > 0 ? query.page : 1;
        const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 20;
        const offset = (page - 1) * limit

        const where: Record<string, unknown> & { [Op.or]?: object[] } = {}

        const includeInactive =
            query.includeInactive === 'true' || query.includeInactive === '1';
        if (!includeInactive) {
            where.isActive = true;
        }

        if (query.search && query.search.trim()) {
            const q = `%${query.search.trim()}%`;
            where[Op.or] = [
                { fullName: { [Op.like]: q } },
                { email: { [Op.like]: q } }
            ]
        }

        const { rows, count } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['passwordHash'] },
            limit,
            offset,
            order: [['fullName', 'ASC']]
        });
        return {
            items: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    },

    async create(input: CreateUserInput) {
        if (!input.fullName?.trim()) {
            throw Object.assign(new Error('FullName is required!'), { status: 400 });
        }
        if (!input.email?.trim()) {
            throw Object.assign(new Error('Email is required!'), { status: 400 });
        }
        if (!input.role?.trim()) {
            throw Object.assign(new Error('Role is required!'), { status: 400 });
        }
        validatePassword(input.password);

        const email = normalizeEmail(input.email);

        const exists = await User.findOne({ where: { email } })
        if (exists) {
            throw Object.assign(new Error('Email already exists!'), { status: 400 });
        }

        const hashed = await hashPassword(input.password);
        //
        const user = await User.create({
            fullName: input.fullName.trim(),
            email,
            passwordHash: hashed,
            role: input.role,
            firstConnection: false,
            isActive: true,
        });
        const safeUser = User.findByPk(user.id, { attributes: { exclude: ["passwordHash"] } });
        return safeUser;
    },



    // AUDIT FIX: méthode manquante appelée par router.param dans user.routes.ts
    async findById(id: number) {
        return User.findByPk(id, { attributes: { exclude: ['passwordHash'] } });
    },

}