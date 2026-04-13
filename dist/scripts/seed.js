"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../models/index");
const password_1 = require("../utils/password");
const users = [
    {
        fullName: 'Admin GymFlow',
        email: 'admin@gymflow.com',
        password: 'admin1234',
        role: 'ADMIN',
    },
    {
        fullName: 'Caissier GymFlow',
        email: 'cashier@gymflow.com',
        password: 'cashier1234',
        role: 'CASHIER',
    },
    {
        fullName: 'Contrôleur GymFlow',
        email: 'controller@gymflow.com',
        password: 'controller1234',
        role: 'CONTROLLER',
    },
];
async function seed() {
    await index_1.sequelize.authenticate();
    console.log('Connexion à la base établie.');
    for (const u of users) {
        const passwordHash = await (0, password_1.hashPassword)(u.password);
        const [, created] = await index_1.User.upsert({
            fullName: u.fullName,
            email: u.email,
            passwordHash,
            role: u.role,
            isActive: true,
            firstConnection: false,
        });
        console.log(`[${created ? 'CRÉÉ' : 'MIS À JOUR'}] ${u.email} (${u.role})`);
    }
    await index_1.sequelize.close();
    console.log('Seed terminé. Connexion fermée.');
}
seed().catch((err) => {
    console.error('Erreur seed :', err);
    process.exit(1);
});
