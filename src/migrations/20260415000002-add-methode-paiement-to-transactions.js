'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('transactions');
    if (desc.methode_paiement) return;

    await queryInterface.addColumn('transactions', 'methode_paiement', {
      type: Sequelize.ENUM('CASH', 'WAVE', 'ORANGE'),
      allowNull: true,
      defaultValue: 'CASH',
      after: 'type',
    });
  },

  async down(queryInterface) {
    const desc = await queryInterface.describeTable('transactions').catch(() => null);
    if (!desc || !desc.methode_paiement) return;
    await queryInterface.removeColumn('transactions', 'methode_paiement');
  },
};
