'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('members');
    if (desc.lieu_naissance) return;

    await queryInterface.addColumn('members', 'lieu_naissance', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      after: 'date_naissance',
    });
  },

  async down(queryInterface) {
    const desc = await queryInterface.describeTable('members').catch(() => null);
    if (!desc || !desc.lieu_naissance) return;
    await queryInterface.removeColumn('members', 'lieu_naissance');
  },
};
