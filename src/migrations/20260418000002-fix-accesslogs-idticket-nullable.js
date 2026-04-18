'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('access_logs', 'id_ticket', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('access_logs', 'id_ticket', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  },
};
