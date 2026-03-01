import bcrypt from 'bcryptjs';

export const hashPassword = async (plainPassword:string) : Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword,salt);
}


export const comparePassword = (plainPassword: string, hashPassword: string): Promise<boolean> => bcrypt.compare(plainPassword,hashPassword)


export const validatePassword = (password: string) => {
    if(!password || password.length < 6){
        throw Object.assign(new Error('Password must be at least 6 characers!'), { status: 400 })
    }
}