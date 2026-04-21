"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const ticket_data_1 = require("../data/ticket.data");
const accesslog_data_1 = require("../data/accesslog.data");
exports.TicketService = {
    async list(query) {
        return ticket_data_1.TicketData.findAll({
            status: query.status,
            batch_id: query.batch_id ? Number(query.batch_id) : undefined,
        });
    },
    async getById(id) {
        const ticket = await ticket_data_1.TicketData.findByPk(id);
        if (!ticket)
            throw Object.assign(new Error('Ticket not found'), { status: 404 });
        return ticket;
    },
    async sell(id) {
        const ticket = await ticket_data_1.TicketData.findByPk(id);
        if (!ticket)
            throw Object.assign(new Error('Ticket not found'), { status: 404 });
        if (ticket.status !== 'DISPONIBLE') {
            throw Object.assign(new Error(`Impossible de vendre un ticket au statut ${ticket.status}`), { status: 400 });
        }
        await ticket_data_1.TicketData.update(id, { status: 'VENDU' });
        const updated = await ticket_data_1.TicketData.findByPk(id);
        return updated;
    },
    async validate(code, controllerId) {
        const ticket = await ticket_data_1.TicketData.findByCode(code);
        if (!ticket) {
            await accesslog_data_1.AccessLogData.create({
                id_ticket: null,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: new Date(),
            });
            return { valid: false, reason: 'Ticket inconnu', ticket_info: null };
        }
        const now = new Date();
        const isExpiredByDate = Boolean(ticket.date_expiration && ticket.date_expiration < now);
        // Ticket déjà utilisé
        if (ticket.status === 'UTILISE') {
            await accesslog_data_1.AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            return { valid: false, reason: 'Ticket déjà utilisé', ticket_info: ticket };
        }
        // Statut explicitement expiré (avant DISPONIBLE / VENDU pour ne pas confondre avec la date seule)
        if (ticket.status === 'EXPIRE') {
            await accesslog_data_1.AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            return { valid: false, reason: 'Ticket expiré', ticket_info: ticket };
        }
        // DISPONIBLE / VENDU avant isExpiredByDate : sinon un VENDU avec date passée
        // était rejeté comme « expiré » sans jamais atteindre la vente valide.
        // Ticket disponible mais pas encore vendu — accès refusé
        if (ticket.status === 'DISPONIBLE') {
            await accesslog_data_1.AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            return {
                valid: false,
                reason: 'Ticket non vendu — ce ticket doit être acheté avant d\'être utilisé',
                ticket_info: ticket,
            };
        }
        // Ticket vendu — accès accordé, passage à UTILISE
        if (ticket.status === 'VENDU') {
            await ticket_data_1.TicketData.update(ticket.id, { status: 'UTILISE' });
            await accesslog_data_1.AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'SUCCES',
                id_controller: controllerId,
                date_scan: now,
            });
            const updatedTicket = await ticket_data_1.TicketData.findByPk(ticket.id);
            return { valid: true, reason: null, ticket_info: updatedTicket };
        }
        // Date dépassée (cas résiduels : cohérence DB)
        if (isExpiredByDate) {
            await ticket_data_1.TicketData.update(ticket.id, { status: 'EXPIRE' });
            await accesslog_data_1.AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            return { valid: false, reason: 'Ticket expiré', ticket_info: ticket };
        }
        // Cas imprévu
        await accesslog_data_1.AccessLogData.create({
            id_ticket: ticket.id,
            id_membre: null,
            resultat: 'ECHEC',
            id_controller: controllerId,
            date_scan: now,
        });
        return { valid: false, reason: 'Statut de ticket non reconnu', ticket_info: ticket };
    },
};
