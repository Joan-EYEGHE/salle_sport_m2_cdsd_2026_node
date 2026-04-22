import { TicketData } from "../data/ticket.data";
import { AccessLogData } from "../data/accesslog.data";
import { TransactionData } from "../data/transaction.data";

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
            throw Object.assign(new Error(
                `Impossible de vendre un ticket au statut ${ticket.status}`
            ), { status: 400 });
        }

        await TicketData.update(id, { status: 'VENDU' });
        const updated = await TicketData.findByPk(id);

        // Générer la transaction REVENU
        const activityNom = updated?.batch?.activity?.nom ?? 'Ticket';
        const prix = Number(updated?.prix_unitaire ?? 0);
        const codeTicket = updated?.code_ticket ?? String(id);

        await TransactionData.create({
            type: 'REVENU',
            libelle: `Vente ticket ${codeTicket} — ${activityNom}`,
            montant: prix,
            id_membre: null,
            date: new Date(),
        });

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
        const isExpiredByDate = Boolean(ticket.date_expiration && ticket.date_expiration < now);

        // Ticket déjà utilisé
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

        // Statut explicitement expiré (avant DISPONIBLE / VENDU pour ne pas confondre avec la date seule)
        if (ticket.status === 'EXPIRE') {
            await AccessLogData.create({
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
            await AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            console.log('[validate DISPONIBLE] retour:', JSON.stringify({
                valid: false,
                reason: 'Ticket non vendu — ce ticket doit être acheté avant d\'être utilisé',
                ticket_info: 'omis',
            }));
            return {
                valid: false,
                reason: 'Ticket non vendu — ce ticket doit être acheté avant d\'être utilisé',
                ticket_info: ticket,
            };
        }

        // Ticket vendu — accès accordé, passage à UTILISE
        if (ticket.status === 'VENDU') {
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
        }

        // Date dépassée (cas résiduels : cohérence DB)
        if (isExpiredByDate) {
            await TicketData.update(ticket.id!, { status: 'EXPIRE' });
            await AccessLogData.create({
                id_ticket: ticket.id,
                id_membre: null,
                resultat: 'ECHEC',
                id_controller: controllerId,
                date_scan: now,
            });
            return { valid: false, reason: 'Ticket expiré', ticket_info: ticket };
        }

        // Cas imprévu
        await AccessLogData.create({
            id_ticket: ticket.id,
            id_membre: null,
            resultat: 'ECHEC',
            id_controller: controllerId,
            date_scan: now,
        });
        return { valid: false, reason: 'Statut de ticket non reconnu', ticket_info: ticket };
    },
};
