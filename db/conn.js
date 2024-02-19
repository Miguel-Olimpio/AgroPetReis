import { Sequelize } from 'sequelize';

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
});

try {
    db.authenticate();
    console.log('Deu bom');
} catch (err) {
    console.log(err);
}

export { db };
