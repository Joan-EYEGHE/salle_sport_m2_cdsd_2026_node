'use strict';

/**
 * Ajoute `active` aux 7 tables listées.
 * La table `users` est couverte par 20260414000001-rename-users-isActive-to-active.js (colonne `active`).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const def = {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    };

    const tables = [
      'members',
      'activities',
      'subscriptions',
      'batches',
      'tickets',
      'transactions',
      'access_logs',
    ];

    for (const table of tables) {
      const desc = await queryInterface.describeTable(table);
      if (desc.active) continue;
      await queryInterface.addColumn(table, 'active', {
        ...def,
        after: 'id',
      });
    }
  },

  async down(queryInterface) {
    const tables = [
      'access_logs',
      'transactions',
      'tickets',
      'batches',
      'subscriptions',
      'activities',
      'members',
    ];
    for (const table of tables) {
      const desc = await queryInterface.describeTable(table).catch(() => null);
      if (!desc || !desc.active) continue;
      await queryInterface.removeColumn(table, 'active');
    }
  },
};
