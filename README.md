<div align="center">

# 🏋️ GymFlow — Backend API (Node.js)

**API REST sécurisée (JWT) pour la gestion d’une salle de sport** : membres, activités/cours, transactions, billetterie (tickets), logs de contrôle, statistiques & exports.

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens)
![License](https://img.shields.io/badge/License-MIT-FF6B35?style=for-the-badge)

</div>

---

## ✨ Accroche

GymFlow Backend fournit une **API robuste et structurée** pour alimenter plusieurs frontends (Vue/React) avec une **authentification JWT** et une **gestion par rôles** (`ADMIN`, `CASHIER`, `CONTROLLER`).

> 📸 **Demo / Screenshot** : (placeholder) ajoute une capture Postman / un GIF (login → members → transaction).

---

## 📚 Table des matières

- [🚀 Features](#-features)
- [🧱 Stack technique](#-stack-technique)
- [📁 Architecture](#-architecture)
- [⚙️ Installation & Lancement](#️-installation--lancement)
- [🌐 Variables d'environnement](#-variables-denvironnement)
- [🔐 Comptes de seed](#-comptes-de-seed)
- [📖 Documentation API (Endpoints)](#-documentation-api-endpoints)
- [🔗 Dépôts liés](#-dépôts-liés)
- [👤 Auteur](#-auteur)
- [📜 License](#-license)

---

## 🚀 Features

- 🔐 **Auth JWT** : login / refresh / me
- 👤 **Gestion des utilisateurs** (RBAC : admin, caissier, contrôleur)
- 🧍 **Gestion des membres** : listing, profil, update, abonnement
- 📅 **Gestion des activités** : CRUD (admin) + listing/détail
- 💳 **Transactions** : création, listing, exports CSV, résumé
- 🎫 **Billetterie** : lots (`batches`), tickets, vente, validation
- 🧾 **Access logs** : stats, listing, export CSV (contrôle/scan)

---

## 🧱 Stack technique

| Catégorie | Tech |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Langage | TypeScript |
| DB | MySQL |
| ORM | Sequelize |
| Auth | JWT |
| Utilitaires | `bcryptjs`, `uuid`, `qrcode` |

---

## 📁 Architecture

```txt
salle_sport_m2_cdsd_2026_node/
├─ src/
│  ├─ config/              # env + connexion DB
│  ├─ controllers/         # handlers HTTP
│  ├─ middlewares/         # auth + role
│  ├─ models/              # modèles Sequelize + init
│  ├─ routes/              # routes Express (API)
│  ├─ services/            # logique métier
│  ├─ utils/               # helpers (jwt, password, errorHandler…)
│  ├─ app.ts               # express app
│  └─ server.ts            # boot (db/sync/seed + listen)
└─ package.json
```

---

## ⚙️ Installation & Lancement

### Prérequis

- Node.js **18+** recommandé
- MySQL local (ex: WAMP)
- Base créée : `salle_sport_m2_cdsd` (par défaut)

### Installation

```bash
npm install
```

### Lancer en dev

```bash
npm run dev
```

Base URL :

- `http://localhost:5000/api`

---

## 🌐 Variables d'environnement

Créer un `.env` à la racine :

| Variable | Exemple | Description |
|---|---:|---|
| `PORT` | `5000` | Port HTTP de l’API |
| `DB_HOST` | `localhost` | Host MySQL |
| `DB_PORT` | `3306` | Port MySQL |
| `DB_NAME` | `salle_sport_m2_cdsd` | Nom de la base |
| `DB_USER` | `root` | Utilisateur DB |
| `DB_PASS` | *(vide)* | Mot de passe DB |
| `JWT_SECRET` | `supersecret...` | Secret JWT |
| `JWT_EXPIRES_IN` | `1d` | Durée de validité |

---

## 🔐 Comptes de seed

Créés au démarrage si aucun user n’existe :

- `admin@example.com` / `admin1234` — `ADMIN`
- `cashier@example.com` / `cashier1234` — `CASHIER`
- `controller@example.com` / `controller1234` — `CONTROLLER`

---

## 📖 Documentation API (Endpoints)

Base URL : `http://localhost:5000/api`

### Auth

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| POST | `/auth/login` | ❌ | — | Connexion |
| POST | `/auth/logout` | ✅ | — | Déconnexion (token Bearer requis) |
| POST | `/auth/refresh` | ❌ | — | Renouveler le token (body : `{ token }`) |
| GET | `/auth/me` | ✅ | — | Profil courant |

### Users

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| GET | `/users` | ✅ | — | Liste des users |
| POST | `/users` | ✅ | — | Créer un user |
| GET | `/users/:id` | ✅ | `ADMIN`, `CASHIER` | Détail user |
| * | `/users/:id/tickets/*` | ✅ | `CONTROLLER` | Routes tickets “nested” |

### Activities

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| GET | `/activities` | ✅ | — | Liste activités |
| GET | `/activities/:id` | ✅ | — | Détail activité |
| POST | `/activities` | ✅ | `ADMIN` | Créer |
| PUT | `/activities/:id` | ✅ | `ADMIN` | Modifier |
| DELETE | `/activities/:id` | ✅ | `ADMIN` | Soft delete |

### Members

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| GET | `/members/qr/:uuid` | ✅ | `ADMIN`, `CASHIER` | Trouver membre via QR |
| POST | `/members/subscribe` | ✅ | `ADMIN`, `CASHIER` | Souscrire / abonnement |
| GET | `/members` | ✅ | `ADMIN`, `CASHIER` | Liste |
| GET | `/members/:id` | ✅ | `ADMIN`, `CASHIER` | Détail |
| PUT | `/members/:id` | ✅ | `ADMIN`, `CASHIER` | Modifier |

### Transactions

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| GET | `/transactions/summary` | ✅ | `ADMIN`, `CASHIER` | Résumé |
| GET | `/transactions/export` | ✅ | `ADMIN`, `CASHIER` | Export CSV |
| GET | `/transactions` | ✅ | `ADMIN`, `CASHIER` | Liste |
| POST | `/transactions` | ✅ | `ADMIN`, `CASHIER` | Créer |

### Tickets / Batches / Access logs

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| GET | `/tickets` | ✅ | `ADMIN`, `CASHIER` | Liste tickets |
| GET | `/tickets/:id` | ✅ | `ADMIN`, `CASHIER` | Détail ticket |
| PUT | `/tickets/:id/sell` | ✅ | `ADMIN`, `CASHIER` | Vendre ticket |
| POST | `/tickets/validate` | ✅ | `ADMIN`, `CONTROLLER` | Valider ticket (log) |
| GET | `/batches` | ✅ | `ADMIN`, `CASHIER` | Liste lots |
| POST | `/batches/generate` | ✅ | `ADMIN`, `CASHIER` | Générer lot |
| GET | `/batches/:id` | ✅ | `ADMIN`, `CASHIER` | Détail lot |
| GET | `/access-logs` | ✅ | `ADMIN`, `CONTROLLER` | Liste logs |
| GET | `/access-logs/stats` | ✅ | `ADMIN`, `CONTROLLER` | Stats |
| GET | `/access-logs/export` | ✅ | `ADMIN`, `CONTROLLER` | Export CSV |

---

## 🔗 Dépôts liés

- Vue.js : `https://github.com/Joan-EYEGHE/salle_sport_m2_cdsd_2026_vue`
- React.js : `https://github.com/Joan-EYEGHE/salle_sport_m2_cdsd_2026_react`
- Node.js : `https://github.com/Joan-EYEGHE/salle_sport_m2_cdsd_2026_node`

---

## 👤 Auteur

**Joan EYEGHE** — Master 2 CDSD 2026

---

## 📜 License

MIT

