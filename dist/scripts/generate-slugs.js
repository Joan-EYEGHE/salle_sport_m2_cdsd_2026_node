"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../models/index");
const slugify_1 = __importDefault(require("slugify"));
const crypto_1 = require("crypto");
function generateSlug(prenom, nom) {
    const base = (0, slugify_1.default)(`${prenom} ${nom}`, { lower: true, strict: true });
    const suffix = (0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 4);
    return `${base}-${suffix}`;
}
async function run() {
    await index_1.sequelize.authenticate();
    console.log('Connexion à la base établie.');
    const members = await index_1.Member.findAll({ where: { slug: null } });
    console.log(`${members.length} membre(s) sans slug trouvé(s).`);
    let updated = 0;
    for (const member of members) {
        let slug = generateSlug(member.prenom, member.nom);
        let attempts = 0;
        while (attempts < 5) {
            const conflict = await index_1.Member.findOne({ where: { slug } });
            if (!conflict)
                break;
            slug = generateSlug(member.prenom, member.nom);
            attempts++;
        }
        await member.update({ slug });
        console.log(`[OK] ${member.prenom} ${member.nom} → ${slug}`);
        updated++;
    }
    await index_1.sequelize.close();
    console.log(`Migration terminée : ${updated} slug(s) générés.`);
}
run().catch((err) => {
    console.error('Erreur migration slugs :', err);
    process.exit(1);
});
