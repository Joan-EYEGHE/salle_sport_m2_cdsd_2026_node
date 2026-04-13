/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const common = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS === undefined ? '' : process.env.DB_PASS,
  database: process.env.DB_NAME || 'salle_sport_m2_cdsd',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
};

module.exports = {
  development: common,
  production: common,
};
