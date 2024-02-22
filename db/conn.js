import dotenv from 'dotenv';
dotenv.config({path: '/etc/environment'});

import { Sequelize } from 'sequelize';

const db = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`,`${process.env.DB_PASSWORD}`, {
    host: `${process.env.DB_HOST}`,
    dialect: 'mysql'
});

try {
    db.authenticate();
    console.log('Deu bom');
} catch (err) {
    console.log(err);
}

export { db };
