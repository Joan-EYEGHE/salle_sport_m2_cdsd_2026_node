import { TicketData } from "../data/ticket.data";
import { AccessLogData } from "../data/accesslog.data";

export const TicketService = {
    async list(query: { status?: string; batch_id?: string }) {
        return TicketData.findAll({
            status: query.status,
            batch_id: query.batch_id ? Number(query.batch_id) : undefined,
        });
    },

    async getById(id: number) {
        const ticket = await TicketData.findByPk(id);
        if (!ticket) throw Object.assign(new Error('Ticket not found'), { status: 404 });
        return ticket;
    },

    async sell(id: number) {
        const ticket = await TicketData.findByPk(id);
        if (!ticket) throw Object.assign(new Error('Ticket not found'), { status: 404 });
        if (ticket.status !== 'DISPONIBLE') {
            throw Object.assign(new Error(`Impossible de vendre un ticket au statut ${ticket.status}`), { status: 400 });
        }
        await TicketData.update(id, { status: 'VENDU' });
        const updated = await TicketData.findByPk(id);
        return updated;
    },

    async validate(code: string, controllerId: number) {
        const ticket = await TicketData.findByCode(code);

        if (!ticket) {
            await AccessLogData.create({
                id_ticket: null,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: new Date(),
            });
            return { valid: false, reason: 'Ticket inconnu', ticket_info: null };
        }

        const now = new Date();
        const isExpiredByDate = ticket.date_expiration && ticket.date_expiration < now;

        if (ticket.status === 'UTILISE') {
            await AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            return { valid: false, reason: 'Ticket déjà utilisé', ticket_info: ticket };
        }

        if (ticket.status === 'EXPIRE' || isExpiredByDate) {
            if (ticket.status !== 'EXPIRE') {
                await TicketData.update(ticket.id!, { status: 'EXPIRE' });
            }
            await AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            return { valid: false, reason: 'Ticket expiré', ticket_info: ticket };
        }

        if (ticket.status === 'DISPONIBLE') {
            await AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            return { valid: false, reason: 'Ticket non vendu', ticket_info: ticket };
        }

        // status === 'VENDU' and not expired
        await TicketData.update(ticket.id!, { status: 'UTILISE' });
        await AccessLogData.create({
            id_ticket: ticket.id,
            id_membre: null,
            resultat: 'SUCCES',
            id_controller: controllerId,
            date_scan: now,
        });
        const updatedTicket = await TicketData.findByPk(ticket.id!);
        return { valid: true, reason: null, ticket_info: updatedTicket };
    },
};
