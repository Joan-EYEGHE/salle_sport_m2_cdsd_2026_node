import { sequelize } from "../config/database";

import { initUserModel, User } from "./user.model";
import { initActivityModel, Activity } from "./activity.model";
import { initMemberModel, Member } from "./member.model";
import { initSubscriptionModel, Subscription } from "./subscription.model";
import { initBatchModel, Batch } from "./batch.model";
import { initTicketModel, Ticket } from "./ticket.model";
import { initTransactionModel, Transaction } from "./transaction.model";
import { initAccessLogModel, AccessLog } from "./accesslog.model";

initUserModel(sequelize);
initActivityModel(sequelize);
initMemberModel(sequelize);
initSubscriptionModel(sequelize);
initBatchModel(sequelize);
initTicketModel(sequelize);
initTransactionModel(sequelize);
initAccessLogModel(sequelize);

// --- Associations ---

Member.hasMany(Subscription, { foreignKey: 'id_membre' });
Subscription.belongsTo(Member, { foreignKey: 'id_membre' });

Activity.hasMany(Subscription, { foreignKey: 'id_activity' });
Subscription.belongsTo(Activity, { foreignKey: 'id_activity' });

Activity.hasMany(Batch, { foreignKey: 'id_activity' });
Batch.belongsTo(Activity, { foreignKey: 'id_activity' });

Batch.hasMany(Ticket, { foreignKey: 'id_batch' });
Ticket.belongsTo(Batch, { foreignKey: 'id_batch' });

Member.hasMany(Transaction, { foreignKey: 'id_membre' });
Transaction.belongsTo(Member, { foreignKey: 'id_membre' });

Member.hasMany(AccessLog, { foreignKey: 'id_membre' });
AccessLog.belongsTo(Member, { foreignKey: 'id_membre', as: 'membre' });

Member.hasMany(Ticket, { foreignKey: 'id_membre' });
Ticket.belongsTo(Member, { foreignKey: 'id_membre' });

User.hasMany(AccessLog, { foreignKey: 'id_controller' });
AccessLog.belongsTo(User, { foreignKey: 'id_controller' });

// AUDIT FIX: association manquante, accesslog.data.ts l'utilise dans include
Ticket.hasMany(AccessLog, { foreignKey: 'id_ticket' });
AccessLog.belongsTo(Ticket, { foreignKey: 'id_ticket' });

// --- Exports ---

export {
    sequelize,
    User,
    Activity,
    Member,
    Subscription,
    Batch,
    Ticket,
    Transaction,
    AccessLog,
};
