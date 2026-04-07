import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: Number(process.env.PORT || 5000),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306), // AUDIT FIX: fallback était 8889 (MAMP), WAMP utilise 3306
        name: process.env.DB_NAME || 'salle_sport_m2_cdsd',
        user: process.env.DB_USER || 'root',
        pass: process.env.DB_PASS || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
}