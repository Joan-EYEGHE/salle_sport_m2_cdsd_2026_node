import { sequelize, Member } from '../models/index';
import slugify from 'slugify';
import { randomUUID } from 'crypto';

function generateSlug(prenom: string, nom: string): string {
    const base = slugify(`${prenom} ${nom}`, { lower: true, strict: true });
    const suffix = randomUUID().replace(/-/g, '').substring(0, 4);
    return `${base}-${suffix}`;
}

async function run() {
    await sequelize.authenticate();
    console.log('Connexion à la base établie.');

    const members = await Member.findAll({ where: { slug: null as any } });
    console.log(`${members.length} membre(s) sans slug trouvé(s).`);

    let updated = 0;
    for (const member of members) {
        let slug = generateSlug(member.prenom, member.nom);
        let attempts = 0;
        while (attempts < 5) {
            const conflict = await Member.findOne({ where: { slug } });
            if (!conflict) break;
            slug = generateSlug(member.prenom, member.nom);
            attempts++;
        }
        await member.update({ slug });
        console.log(`[OK] ${member.prenom} ${member.nom} → ${slug}`);
        updated++;
    }

    await sequelize.close();
    console.log(`Migration terminée : ${updated} slug(s) générés.`);
}

run().catch((err) => {
    console.error('Erreur migration slugs :', err);
    process.exit(1);
});
