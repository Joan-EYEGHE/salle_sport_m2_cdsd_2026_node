import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./models";
sequelize


const start = async() => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");
        await sequelize.sync();
        app.listen(env.port, () => {
            console.log(`Server running on port :${env.port}`)
        })
    } catch (error) {
        console.log("Unable to start the server:",error);
        process.exit(1);
    }

}


start();
