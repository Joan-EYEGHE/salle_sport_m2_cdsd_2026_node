'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('access_logs');
    if (!tableDesc.id_membre) {
      await queryInterface.addColumn('access_logs', 'id_membre', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        after: 'id_ticket',
      });
    }
  },
  async down(queryInterface) {
    const tableDesc = await queryInterface.describeTable('access_logs');
    if (tableDesc.id_membre) {
      await queryInterface.removeColumn('access_logs', 'id_membre');
    }
  },
};
