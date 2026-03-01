import { User } from "../models";
import { signToken } from "../utils/jwt";
import { comparePassword } from "../utils/password";

export const AuthService = {
    async login(email: string, password: string) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            // const error = new Error('Invalid credentials!') as any;
            // error.status = 401;
            // throw error;
            throw Object.assign(new Error('Invalid credentials!'),{status : 401})
        }

        const isMatch = await comparePassword(password,user.passwordHash);
        if(!isMatch){
            throw Object.assign(new Error('Invalid credentials!'),{status : 401})
        }
        //generate a jwt token
        const token = signToken({ id: user.id, role: user.role })
        return {
            // token: "This@Is#A1Very.Fake%Token",
            token,
            user:{
                id: user.id,
                fullName:user.fullName,
                email: user.email,
                role: user.role,
                firstConnection: user.firstConnection
            }
        }
    }
}
