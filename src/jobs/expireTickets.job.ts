import cron from "node-cron";
import { Op } from "sequelize";
import { Ticket } from "../models";

function formatTimeHm(d: Date): string {
    const h = d.getHours();
    const m = d.getMinutes();
    const hh = h < 10 ? `0${h}` : String(h);
    const mm = m < 10 ? `0${m}` : String(m);
    return `${hh}:${mm}`;
}

async function runExpireTickets(): Promise<void> {
    const now = new Date();
    const [affectedCount] = await Ticket.unscoped().update(
        { status: "EXPIRE" },
        {
            where: {
                status: "DISPONIBLE",
                date_expiration: { [Op.lt]: now },
            },
        },
    );
    const t = formatTimeHm(new Date());
    console.log(`[ExpireTickets] ${affectedCount} ticket(s) expirés à ${t}`);
}

export function startExpireTicketsJob(): void {
    void runExpireTickets().catch((err: unknown) => {
        console.error("[ExpireTickets]", err);
    });
    cron.schedule("0 */1 * * *", () => {
        void runExpireTickets().catch((err: unknown) => {
            console.error("[ExpireTickets]", err);
        });
    });
}
