"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpireTicketsJob = startExpireTicketsJob;
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
function formatTimeHm(d) {
    const h = d.getHours();
    const m = d.getMinutes();
    const hh = h < 10 ? `0${h}` : String(h);
    const mm = m < 10 ? `0${m}` : String(m);
    return `${hh}:${mm}`;
}
async function runExpireTickets() {
    const now = new Date();
    const [affectedCount] = await models_1.Ticket.unscoped().update({ status: "EXPIRE" }, {
        where: {
            status: "DISPONIBLE",
            date_expiration: { [sequelize_1.Op.lt]: now },
        },
    });
    const t = formatTimeHm(new Date());
    console.log(`[ExpireTickets] ${affectedCount} ticket(s) expirés à ${t}`);
}
function startExpireTicketsJob() {
    void runExpireTickets().catch((err) => {
        console.error("[ExpireTickets]", err);
    });
    node_cron_1.default.schedule("0 */4 * * *", () => {
        void runExpireTickets().catch((err) => {
            console.error("[ExpireTickets]", err);
        });
    });
}
