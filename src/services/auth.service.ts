import { User } from "../models";
import { signToken, verifyToken } from "../utils/jwt";
import { comparePassword } from "../utils/password";

export const AuthService = {
    async login(email: string, password: string) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw Object.assign(new Error('Invalid credentials!'), { status: 401 })
        }

        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
            throw Object.assign(new Error('Invalid credentials!'), { status: 401 })
        }

        const token = signToken({ id: user.id, role: user.role })
        return {
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                firstConnection: user.firstConnection
            }
        }
    },

    async refresh(token: string) {
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            throw Object.assign(new Error('Invalid or expired token'), { status: 401 });
        }

        const user = await User.findByPk(decoded.id);
        if (!user || !user.isActive) {
            throw Object.assign(new Error('User not found or inactive'), { status: 401 });
        }

        const newToken = signToken({ id: user.id, role: user.role });
        return {
            token: newToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                firstConnection: user.firstConnection
            }
        };
    }
}
