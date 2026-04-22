'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('activities', 'slug', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      after: 'nom',
    });

    const [activities] = await queryInterface.sequelize.query(
      'SELECT id, nom FROM activities',
    );

    for (const a of activities) {
      const base = String(a.nom)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const suffix = Math.random().toString(36).substring(2, 6);
      const slug = `${base || 'activite'}-${suffix}`;
      await queryInterface.sequelize.query('UPDATE activities SET slug = ? WHERE id = ?', {
        replacements: [slug, a.id],
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('activities', 'slug');
  },
};
