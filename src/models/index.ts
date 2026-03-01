import { sequelize } from "../config/database";
import { initUserModel, User } from "./user.model";

initUserModel(sequelize);


export {User,sequelize}