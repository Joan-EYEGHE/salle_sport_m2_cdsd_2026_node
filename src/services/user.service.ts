import { hashPassword } from './../utils/password';
import { users } from "../data/user.data";
import { User } from "../models";


export const UserService = {
    list() {
        return [...users];
    },
    findById(userId: number) {
        return users.find(u => u.id === userId);
    },



    //seeder
    async seedUsers(){
        const userCount = await User.count();
        if(userCount === 0){
            const adminPass = await hashPassword('admin1234')
            await User.create({
                fullName: 'Super Admin',
                email: 'admin@example.com',
                passwordHash: adminPass,
                role: 'ADMIN',
                firstConnection: false,
                isActive: true,
            });
            console.log('Default admin created : admin@example.com / admin1234')
            //
            const cashierPass = await hashPassword('cashier1234')
            await User.create({
                fullName: 'Cashier',
                email: 'cashier@example.com',
                passwordHash: cashierPass,
                role: 'CASHIER',
                firstConnection: false,
                isActive: true,
            });
            console.log('Default cashier created : cashier@example.com / cashier1234')
            //
            const controllerPass = await hashPassword('cashier1234')
            await User.create({
                fullName: 'Controller',
                email: 'controller@example.com',
                passwordHash: controllerPass,
                role: 'CONTROLLER',
                firstConnection: false,
                isActive: true,
            });
            console.log('Default controller created : controller@example.com / controller1234')
        }
    }
}