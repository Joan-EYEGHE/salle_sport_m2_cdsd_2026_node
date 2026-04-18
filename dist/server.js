"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const expireTickets_job_1 = require("./jobs/expireTickets.job");
const models_1 = require("./models");
const start = async () => {
    try {
        await models_1.sequelize.authenticate();
        console.log("Database connected");
        await models_1.sequelize.sync();
        (0, expireTickets_job_1.startExpireTicketsJob)();
        app_1.default.listen(env_1.env.port, () => {
            console.log(`Server running on port :${env_1.env.port}`);
        });
    }
    catch (error) {
        console.log("Unable to start the server:", error);
        process.exit(1);
    }
};
start();
