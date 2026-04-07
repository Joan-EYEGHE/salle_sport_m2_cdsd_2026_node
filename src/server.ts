import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./models";
import { UserService } from "./services/user.service";
// AUDIT FIX: ligne orpheline `sequelize` supprimée (no-op, résidu de copier-coller)


const start = async() => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");
        await sequelize.sync();
        //
        await UserService.seedUsers();
        app.listen(env.port, () => {
            console.log(`Server running on port :${env.port}`)
        })
    } catch (error) {
        console.log("Unable to start the server:",error);
        process.exit(1);
    }

}


start();
