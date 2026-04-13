'use strict';

/** Renomme la colonne existante avant d’harmoniser le modèle User sur `active`. */
module.exports = {
  async up(queryInterface) {
    const desc = await queryInterface.describeTable('users');
    if (desc.active) return;
    if (desc.isActive) {
      await queryInterface.renameColumn('users', 'isActive', 'active');
      return;
    }
    if (desc.is_active) {
      await queryInterface.renameColumn('users', 'is_active', 'active');
      return;
    }
    throw new Error('users: colonne isActive / is_active introuvable — vérifier le schéma.');
  },

  async down(queryInterface) {
    const desc = await queryInterface.describeTable('users');
    if (!desc.active) return;
    await queryInterface.renameColumn('users', 'active', 'isActive');
  },
};
