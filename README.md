# GymFlow — Backend API (`salle_sport_m2_cdsd_2026_node`)

Backend de l’application GymFlow : **API REST** (Node.js/Express) connectée à une base **MySQL** via **Sequelize**.

## Stack

- Node.js + TypeScript
- Express
- Sequelize + MySQL (`mysql2`)
- Auth JWT

## Prérequis

- Node.js 18+ recommandé
- MySQL en local (ex: WAMP)
- Une base MySQL créée (par défaut: `salle_sport_m2_cdsd`)

## Installation

```bash
npm install
```

## Configuration (variables d’environnement)

Le backend utilise un fichier `.env` à la racine du projet. Valeurs attendues (exemple) :

- `PORT=5000`
- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_NAME=salle_sport_m2_cdsd`
- `DB_USER=root`
- `DB_PASS=`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=1d`

## Lancer en développement

```bash
npm run dev
```

API disponible par défaut sur : `http://localhost:5000/api`

## Initialisation (DB + seed)

Au démarrage, le serveur :

- teste la connexion MySQL
- synchronise les modèles Sequelize
- crée des utilisateurs par défaut si la table `users` est vide

### Comptes seed (si aucun user n’existe)

- `admin@example.com` / `admin1234` (role: `ADMIN`)
- `cashier@example.com` / `cashier1234` (role: `CASHIER`)
- `controller@example.com` / `controller1234` (role: `CONTROLLER`)

## Endpoints (aperçu)

Base path : `/api`

- `/auth` : login/logout/refresh/me
- `/users` : gestion utilisateurs
- `/tickets` : billets (liste, détail, vente, validation)
- `/batches` : lots de tickets (liste, détail, génération)
- `/access-logs` : journal des validations (liste, stats, export CSV)
- `/activities`, `/members`, `/transactions` : autres ressources

Les routes sont protégées via :

- un middleware d’auth (JWT)
- un middleware RBAC (rôles : `ADMIN`, `CASHIER`, `CONTROLLER`)

## Scripts npm

- `npm run dev` : lance le serveur (`tsx src/server.ts`)
- `npm run build` : compile TypeScript (`tsc`)

