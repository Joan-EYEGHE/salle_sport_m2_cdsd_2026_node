import { sequelize, User } from '../models/index';
import { hashPassword } from '../utils/password';

const users = [
  {
    fullName: 'Admin GymFlow',
    email: 'admin@gymflow.com',
    password: 'admin1234',
    role: 'ADMIN' as const,
  },
  {
    fullName: 'Caissier GymFlow',
    email: 'cashier@gymflow.com',
    password: 'cashier1234',
    role: 'CASHIER' as const,
  },
  {
    fullName: 'Contrôleur GymFlow',
    email: 'controller@gymflow.com',
    password: 'controller1234',
    role: 'CONTROLLER' as const,
  },
];

async function seed() {
  await sequelize.authenticate();
  console.log('Connexion à la base établie.');

  for (const u of users) {
    const passwordHash = await hashPassword(u.password);
    const [, created] = await User.upsert({
      fullName: u.fullName,
      email: u.email,
      passwordHash,
      role: u.role,
      isActive: true,
      firstConnection: false,
    });
    console.log(`[${created ? 'CRÉÉ' : 'MIS À JOUR'}] ${u.email} (${u.role})`);
  }

  await sequelize.close();
  console.log('Seed terminé. Connexion fermée.');
}

seed().catch((err) => {
  console.error('Erreur seed :', err);
  process.exit(1);
});
